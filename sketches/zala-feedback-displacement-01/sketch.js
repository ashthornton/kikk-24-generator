import * as THREE from 'three'
import simulationFrag from './sketch.fs'
import { min } from 'three/examples/jsm/nodes/Nodes.js'

let camera
let sceneFBO

let isInited = false

export let props = {
	color1: { // bottom color
		value: "#0088cc",
		type: "color",
		displayName: "Bottom Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uColor1.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	color2: { // top color
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
			isInited = false
			simUniforms.uSetup.value = 1
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
		value: 140,
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
	noiseAngle: {
		value: Math.PI * 0.5,
		type: "number",
		params: {
			min: -Math.PI,
			max: Math.PI,
			step: 0.01
		},
		displayName: "Noise Angle",
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uNoiseAngle.value = prop.value
		},
		disabled: () => props.animationType.value === 1.0,
	},
	noiseBias: {
		value: 0.85,
		type: "number",
		displayName: "Noise Bias",
		params: {
			min: 0,
			max: 1,
			step: 0.01
		},
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uNoiseBias.value = prop.value
		},
		disabled: () => props.animationType.value === 1.0,
	},
	animationType: {
		value: 0.0,
		params: {
			min: 0,
			max: 1,
			step: 1.0
		},
		displayName: "Animation Type",
		onChange: (prop, { width, height, pixelRatio }) => {
			simUniforms.uAnimation.value = prop.value
		}
	}
}

let simUniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uDelta: { value: 0 },
	uTexture: { value: new THREE.Texture() },
	uSetup: { value: 1 },
	uColor1: { value: new THREE.Color().setHex(props.color1.value.replace('#', '0x')) },
	uColor2: { value: new THREE.Color().setHex(props.color2.value.replace('#', '0x')) },
	uDebugSimulatorTexture: { value: false },
	uNoiseSpeed: { value: props.noiseSpeed.value },
	uNoiseScale: { value: props.noiseScale.value },
	uNoiseDirection: { value: new THREE.Vector2(props.noiseDirection.value[0], props.noiseDirection.value[1]) },
	uNoiseAngle: { value: props.noiseAngle.value },
	uNoiseBias: { value: props.noiseBias.value },
	uAnimation: { value: props.animationType.value }
}


let renderTargetA;
let renderTargetB;

let resultsMaterial;

// Sets up a full screen mesh to do the simulation
function setupFBOMesh() {

	let geometry = new THREE.BufferGeometry()
	geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3))
	geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2))

	let mesh = new THREE.Mesh(geometry,
		new THREE.RawShaderMaterial({
			vertexShader: `
				attribute vec3 position;
				attribute vec2 uv;

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

	resultsMaterial = new THREE.RawShaderMaterial({
		vertexShader: `
			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = vec4(position, 1.);
			}
		`,
		fragmentShader: `
			precision highp float;
			uniform sampler2D uTexture;

			varying vec2 vUv;

			void main() {
				vec4 color = texture2D(uTexture, vUv);
				gl_FragColor = color;
			}
		`,
		uniforms: {
			uTexture: { value: null }
		}
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


    resultsMaterial.uniforms.uTexture.value = renderTargetA.texture
    simUniforms.uTexture.value = renderTargetB.texture

	if(!isInited) { // run setup once to create a base gradient texture
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