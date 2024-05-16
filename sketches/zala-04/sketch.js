import * as THREE from 'three';
import fragmentShader from './display.fs'
import gradientFragment from './gradient.fs'
import throttle from './throttle.js'

export let props = {
	color1: { // bottom color
		value: "#0088cc",
		type: "color",
		displayName: "Bottom Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			gradientMaterial.uniforms.uColor1.value.setHex(prop.value.replace('#', '0x'))
		}
	},
	color2: { // top color
		value: "#fdd3e0",
		type: "color",
		displayName: "Top Base Color",
		onChange: (prop, { width, height, pixelRatio }) => {
			gradientMaterial.uniforms.uColor2.value.setHex(prop.value.replace('#', '0x'))
		}
	}
}

let camera;
let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uMouse: { value: new THREE.Vector2() },
	tBackground: { value: new THREE.Texture() },
}

const pointer = {
	x: 0,
	y: 0,
	gl: new THREE.Vector2(),
	glNormalized: new THREE.Vector2(),
	glScreenSpace: new THREE.Vector2()
}

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
			uResolution: { value: new THREE.Vector2(width, height) },
			uTime: { value: 0 },
			// uColor1: { value: new THREE.Color(props.color1.value.replace('#', '0x')) },
			// uColor2: { value: new THREE.Color(props.color2.value.replace('#', '0x')) }
			uColor1: { value: new THREE.Color(0x0088cc) },
			uColor2: { value: new THREE.Color(0xfdd3e0) }
		}
	})

	camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000)

	// add event listeners
	canvas.addEventListener('mousemove', throttle((e) => handleMousemove(e), 16))

	canvasWidth = width
	canvasHeight = height

	let geometry = new THREE.BufferGeometry();
	geometry.setAttribute(
		'position',
		new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3),
	);
	geometry.setAttribute(
		'uv',
		new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2),
	);

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
}

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
		if (time % 10 < 0.1) {
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

	canvasWidth = width
	canvasHeight = height

	uniforms.uResolution.value.x = width;
	uniforms.uResolution.value.y = height;

	camera.left = -width * 0.5;
	camera.right = width * 0.5;
	camera.top = height * 0.5;
	camera.bottom = -height * 0.5;

	camera.updateProjectionMatrix();
};

export let rendering = 'three';
