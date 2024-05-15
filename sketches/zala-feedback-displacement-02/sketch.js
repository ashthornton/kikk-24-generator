import * as THREE from 'three'
import simulationFrag from './sketch.fs'

let camera
let sceneFBO

let isInited = false

export let props = {
	color1: {
		value: "#0088cc",
		type: "color",
		displayName: "Bottom Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uColor1.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	color2: {
		value: "#fdd3e0",
		type: "color",
		displayName: "Top Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uColor2.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	pauseDistortion: {
		value: () => {

			if(props.pauseDistortion.params.label === 'pause') {
				props.pauseDistortion.params.label = 'play'
			} else {
				props.pauseDistortion.params.label = 'pause'
			}
			
			simUniforms.uDebugSimulatorTexture.value = !simUniforms.uDebugSimulatorTexture.value
			
		},
		displayName: "Pause Distortion",
		params: {
			label: "pause",
		}
	},
	reset: { 
		value: () => {
			simUniforms.uBaseTexture.value = new THREE.Texture()
			isInited = false
			simUniforms.uSetup.value = 2
		},
		params: {
			label: "reset simulation",
		}
	},
	noiseSpeed: {
		value: 0.1,
		displayName: "Noise Speed",
		params: {
			min: 0,
			max: 1,
			step: 0.001
		},
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uNoiseSpeed.value = prop.value
		}
	},
	noiseScale: {
		value: 2.0,
		type: "number",
		displayName: "Noise Scale",
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uNoiseScale.value = prop.value
		}
	},
	noiseDirection: {
		value: [0, 1],
		displayName: "Noise Direction",
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uNoiseDirection.value.set(prop.value[0], prop.value[1])
		}
	},
	animationType: {
		value: 1.0,
		params: {
			min: 0,
			max: 1,
			step: 1.0
		},
		displayName: "Animation Type",
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uAnimation.value = prop.value
		}
	},
	debugDispTexture: {
		value: false,
		displayName: "Debug Displacement Texture",
		onChange: (prop, { width, height, pixelRatio }) => {
			displayUniforms.uDebugDisplacementTexture.value = prop.value
		}
	}
}

let simUniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uDelta: { value: 0 },
	uTexture: { value: new THREE.Texture() },
	uBaseTexture: { value: new THREE.Texture() },
	uSetup: { value: 2 },

	uColor1: { value: new THREE.Color().setHex(props.color1.value.replace('#', '0x')) },
	uColor2: { value: new THREE.Color().setHex(props.color2.value.replace('#', '0x')) },
	
	uDebugSimulatorTexture: { value: false },
	uNoiseSpeed: { value: props.noiseSpeed.value },
	uNoiseScale: { value: props.noiseScale.value },
	uNoiseDirection: { value: new THREE.Vector2(props.noiseDirection.value[0], props.noiseDirection.value[1]) },
	uAnimation: { value: props.animationType.value }
}

let displayUniforms = {
	uDisplacementTexture: { value: new THREE.Texture() },
	uBaseTexture: { value: new THREE.Texture() },
	uDebugDisplacementTexture: { value: props.debugDispTexture.value }
}


let renderTargetA;
let renderTargetB;
let gradientRenderTarget;
let baseRenderTarget;

let resultsMaterial;

// Sets up a full screen mesh to do the simulation
function setupFBOMesh() {

	let geometry = new THREE.BufferGeometry()
	geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3))
	geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2))

	let mesh = new THREE.Mesh(geometry,
		new THREE.ShaderMaterial({
			vertexShader: `
				varying vec2 vUv;

				void main() {
					vUv = uv;
					gl_Position = vec4(position, 1.);
				}
        `,
			fragmentShader: simulationFrag,
			uniforms: simUniforms,
		})
	)

	sceneFBO.add(mesh)

}

function setupDisplayMesh(scene) {
	let geometry = new THREE.BufferGeometry()
	geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3))
	geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2))

	resultsMaterial = new THREE.ShaderMaterial({
		vertexShader: `
			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = vec4(position, 1.);
			}
		`,
		fragmentShader: `
			precision highp float;
			#include <common>

			uniform sampler2D uDisplacementTexture;
			uniform sampler2D uBaseTexture;

			uniform bool uDebugDisplacementTexture;

			varying vec2 vUv;

			void main() {

				vec2 offset = texture2D(uDisplacementTexture, vUv).rg;

				if(uDebugDisplacementTexture) {
					gl_FragColor = vec4(offset, 0.0, 1.0);
					return;
				}

				vec4 color = texture2D(uBaseTexture, offset);

				gl_FragColor = color;

				#include <colorspace_fragment>
			}
		`,
		uniforms: displayUniforms,
	})

	let resultsMesh = new THREE.Mesh(
		geometry,
		resultsMaterial
	)

	scene.add(resultsMesh)
}

/**
 * @param {object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {THREE.Renderer} params.renderer
 * @param {THREE.Scene} params.scene
 * @param {number} params.width
 * @param {number} params.height
 * @param {number} params.pixelRatio
 */
export let init = ({ scene, width, height }) => {

	sceneFBO = new THREE.Scene()
	
	renderTargetA = new THREE.WebGLRenderTarget(width, height, {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat,
		type: THREE.FloatType,
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping
	})

	renderTargetB = renderTargetA.clone()

	gradientRenderTarget = renderTargetA.clone()

	baseRenderTarget = renderTargetA.clone()
	baseRenderTarget.texture.generateMipmaps = true
	
	camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000)

	setupFBOMesh()
	
	setupDisplayMesh(scene)
	
};

/**
 * @param {object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {THREE.Renderer} params.renderer
 * @param {THREE.Scene} params.scene
 * @param {number} params.width
 * @param {number} params.height
 * @param {number} params.pixelRatio
 * @param {number} params.time
 * @param {number} params.deltaTime
 * @param {number} params.frame
 * @param {number} params.playhead
 * @param {number} params.playcount
 */
export let update = ({ renderer, scene, time, deltaTime }) => {

	simUniforms.uTime.value = time
	simUniforms.uDelta.value = deltaTime

	// Do ping-pong rendering
	renderer.setRenderTarget(renderTargetA)
    renderer.render(sceneFBO, camera)

    renderer.setRenderTarget(null)
    renderer.render(scene, camera)

    // swap render targets
    const tmp = renderTargetA
    renderTargetA = renderTargetB
    renderTargetB = tmp

    resultsMaterial.uniforms.uDisplacementTexture.value = renderTargetA.texture
    simUniforms.uTexture.value = renderTargetB.texture

	if(!isInited) { // run setup once to create a base gradient texture and base UV displacement texture

		// save the base UV displacement texture
		renderer.setRenderTarget(baseRenderTarget)
    	renderer.render(sceneFBO, camera)
		simUniforms.uBaseTexture.value = baseRenderTarget.texture
		
		// render the plane again with setup == 1 to create a gradient texture
		simUniforms.uSetup.value = 1
		renderer.setRenderTarget(gradientRenderTarget)
		renderer.render(sceneFBO, camera)

		resultsMaterial.uniforms.uBaseTexture.value = gradientRenderTarget.texture // save the gradient texture from the first frame at setup == 1

		// put it back to 0 to run the simulation
		simUniforms.uSetup.value = 0
		isInited = true
	}
}

/**
 * @param {object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {THREE.Renderer} params.renderer
 * @param {THREE.Scene} params.scene
 * @param {number} params.width
 * @param {number} params.height
 * @param {number} params.pixelRatio
 */
export let resize = ({ width, height }) => {
	simUniforms.uResolution.value.x = width
	simUniforms.uResolution.value.y = height

	camera.left = -width * 0.5
	camera.right = width * 0.5
	camera.top = height * 0.5
	camera.bottom = -height * 0.5

	camera.updateProjectionMatrix()
}

export let rendering = 'three'

export let exportDir = './exports'

export let buildConfig = {
	gui: {
		output: true,
		size: 0.2
	}
}