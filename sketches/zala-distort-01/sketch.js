import * as THREE from 'three';
import fragmentShader from './sketch.fs';
import throttle from './throttle.js';

const pointer = {
	x: 0,
	y: 0,
	gl: new THREE.Vector2(),
	glNormalized: new THREE.Vector2(),
	glScreenSpace: new THREE.Vector2()
};

export let props = {
	color1: { // bottom color
		value: "#0088cc",
		type: "color",  
		displayName: "Bottom Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			uniforms.uColor1.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	color2: { // top color
		value: "#fdd3e0",
		type: "color",
		displayName: "Top Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			uniforms.uColor2.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	outlineThickness: {
		value: 0.16,
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
}

let camera

let canvasWidth
let canvasHeight

let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uMouse: { value: new THREE.Vector2() },
	uColor1: { value: new THREE.Color().setHex(props.color1.value.replace('#', '0x')) },
	uColor2: { value: new THREE.Color().setHex(props.color2.value.replace('#', '0x')) },
	uOutlineThickness: { value: props.outlineThickness.value },
	uOutlineColor: { value: new THREE.Color().setHex(props.outlineColor.value.replace('#', '0x')) },
	uNoiseStrength: { value: props.noiseStrength.value },
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


	camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000)

	let geometry = new THREE.BufferGeometry()
	geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3))
	geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2))

	let mesh = new THREE.Mesh(
		geometry,
		new THREE.ShaderMaterial({
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
	uniforms.uTime.value = time
	uniforms.uMouse.value.copy(pointer.glNormalized)

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



// store.pointer.x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
// 		store.pointer.y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
// 		store.pointer.gl.set(store.pointer.x - store.window.w / 2, -store.pointer.y + store.window.h / 2)
// 		store.pointer.glNormalized.set((store.pointer.x / store.window.w) * 2 - 1, -(store.pointer.y / store.window.h) * 2 + 1)
// 		store.pointer.glScreenSpace.set(store.pointer.x / store.window.w, 1 - store.pointer.y / store.window.h)