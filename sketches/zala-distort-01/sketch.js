import * as THREE from 'three';
import fragmentShader from './display.fs'
import gradientFragment from './gradient.fs'
import throttle from './throttle.js';
import { step } from 'three/examples/jsm/nodes/Nodes.js';

const pointer = {
	x: 0,
	y: 0,
	gl: new THREE.Vector2(),
	glNormalized: new THREE.Vector2(),
	glScreenSpace: new THREE.Vector2()
};

export let props = {
	color1: {
		value: "#fdd3e0",
		type: "color",  
		displayName: "Top Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			gradientMaterial.uniforms.uColor1.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	color2: {
		value: "#d3effd",
		type: "color",
		displayName: "Middle Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			gradientMaterial.uniforms.uColor2.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	color3: {
		value: "#0088cc", 
		type: "color",
		displayName: "Bottom Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			gradientMaterial.uniforms.uColor3.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	outlineThickness: {
		value: 0.35,
		displayName: "Outline Thickness",
		params: {
			min: 0,
			max: 1,
			step: 0.001
		},
		onChange: (prop, { width, height, pixelRatio }) => {
			uniforms.uOutlineThickness.value = prop.value
		}
	},
	outlineColor: {
		value: "#80ff00",
		type: "color",
		displayName: "Outline Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			uniforms.uOutlineColor.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	noiseStrength: {
		value: 0.115,
		displayName: "Noise Strength",
		params: {
			min: 0,
			max: 1,
			step: 0.001
		},
		onChange: (prop, { width, height, pixelRatio }) => {
			uniforms.uNoiseStrength.value = prop.value
		}
	},
	rectangleSize: {
		value: [0.1, 0.1],
		displayName: "Rectangle Size",
		onChange: (prop, { width, height, pixelRatio }) => {
			uniforms.uRectangleSize.value.set(prop.value[0], prop.value[1])
		}
	},
	step1: {
		value: 0.0,
		displayName: "Gradient Step 1",
		params: {
			min: -0.5,
			max: 1,
			step: 0.001
		},
		onChange: (prop, { width, height, pixelRatio }) => {
			gradientMaterial.uniforms.uStep1.value = prop.value
		}
	},
	step2: {
		value: 0.49,
		displayName: "Gradient Step 2",
		params: {
			min: 0,
			max: 1,
			step: 0.001
		},
		onChange: (prop, { width, height, pixelRatio }) => {
			gradientMaterial.uniforms.uStep2.value = prop.value
		}
	},
	step3: {
		value: 0.935,
		displayName: "Gradient Step 3",
		params: {
			min: 0,
			max: 1.5,
			step: 0.001
		},
		onChange: (prop, { width, height, pixelRatio }) => {
			gradientMaterial.uniforms.uStep3.value = prop.value
		}
	},
}

let camera

let _pointerTimeout = () => {}
let idle = false
let autoPointer = false
let prevPointerPos = new THREE.Vector2()
let pointerPos = new THREE.Vector2()

let canvasWidth, canvasHeight

let gradientRenderTarget
let gradientMaterial

let displayMaterial

let mesh

let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uMouse: { value: new THREE.Vector2() },
	uColor1: { value: new THREE.Color().setHex(props.color1.value.replace('#', '0x')) },
	uColor2: { value: new THREE.Color().setHex(props.color2.value.replace('#', '0x')) },
	uOutlineThickness: { value: props.outlineThickness.value },
	uOutlineColor: { value: new THREE.Color().setHex(props.outlineColor.value.replace('#', '0x')) },
	uNoiseStrength: { value: props.noiseStrength.value },
	tBackground: { value: new THREE.Texture() },
	uRectangleSize: { value: new THREE.Vector2().set(props.rectangleSize.value[0], props.rectangleSize.value[1]) }
}

const handleMousemove = (e) => {
	pointer.x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
	pointer.y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
	pointer.gl.set(pointer.x - canvasWidth / 2, -pointer.y + canvasHeight / 2)
	pointer.glNormalized.set((pointer.x / canvasWidth) * 2 - 1, -(pointer.y / canvasHeight) * 2 + 1)
	pointer.glScreenSpace.set(pointer.x / canvasWidth, 1 - pointer.y / canvasHeight)
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
export let init = ({ canvas, scene, width, height }) => {

	canvasWidth = width
	canvasHeight = height
	canvas.addEventListener('mousemove', throttle((e) => handleMousemove(e), 16))

	gradientRenderTarget = new THREE.WebGLRenderTarget(width, height, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		type: THREE.FloatType,
		wrapS: THREE.ClampToEdgeWrapping,
		wrapT: THREE.ClampToEdgeWrapping
	})

	gradientMaterial = new THREE.ShaderMaterial({
		vertexShader: `

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = vec4(position, 1.);
			}

		`,
		fragmentShader: gradientFragment,
		uniforms: {
			uColor1: { value: new THREE.Color().setHex(props.color1.value.replace('#', '0x')) },
			uColor2: { value: new THREE.Color().setHex(props.color2.value.replace('#', '0x')) },
			uColor3: { value: new THREE.Color().setHex(props.color3.value.replace('#', '0x')) },
			uStep1: { value: props.step1.value },
			uStep2: { value: props.step2.value },
			uStep3: { value: props.step3.value },
		}
	})


	camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000)

	let geometry = new THREE.BufferGeometry()
	geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3))
	geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2))

	displayMaterial = new THREE.ShaderMaterial({
		vertexShader: `
			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = vec4(position, 1.);
			}
		`,
		fragmentShader,
		uniforms,
	}),

	mesh = new THREE.Mesh(
		geometry,
		displayMaterial
	);

	scene.add(mesh)
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
	uniforms.uTime.value = time;

	if (!pointer.glNormalized.equals(prevPointerPos)) {
		prevPointerPos.copy(pointer.glNormalized)
		pointerPos.copy(pointer.glNormalized)

		idle = false
		autoPointer = false
	} else if (!idle & !autoPointer) {
		idle = true

		clearTimeout(_pointerTimeout)
		_pointerTimeout = setTimeout(() => {
			autoPointer = true
		}, 400)

	} else if (autoPointer) {
		// get a random position every x frames
		if (time % 1000 === 0) { // fix this! getting double frames sometimes
			pointerPos.x = Math.random() * 2 - 1
			pointerPos.y = Math.random() * 2 - 1
		}
	}

	uniforms.uMouse.value.copy(pointerPos)

	// render the gradient
	renderer.setRenderTarget(gradientRenderTarget)
	// swap the materials
	mesh.material = gradientMaterial
    renderer.render(scene, camera)

	uniforms.tBackground.value = gradientRenderTarget.texture

	mesh.material = displayMaterial
	renderer.setRenderTarget(null)
	renderer.render(scene, camera)
};

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

	canvasWidth = width
	canvasHeight = height

	uniforms.uResolution.value.x = width
	uniforms.uResolution.value.y = height

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
		output: true
	}
}