import * as THREE from 'three'
import fragmentShader from './sketch.fs'

export let props = {
	color: {
		value: '#f2c2d2',
		onChange: ({ value }) => {
			uniforms.uColor.value.set(value)
		}
	},
	bgColor: {
		value: '#2373df',
		onChange: ({ value }) => {
			uniforms.uBgColor.value.set(value)
		}
	},
	origin: {
		value: [0, 0],
		params: {
			min: -5,
			max: 5,
			step: 0.01
		},
		onChange: ({ value }) => {
			uniforms.uOrigin.value.set(...value)
		}
	},
	ringAmount: {
		value: 10,
		params: {
			min: 0,
			max: 250,
			step: 1
		},
		onChange: ({ value }) => {
			uniforms.uRingAmount.value = value
		}
	},
	timeOffset: {
		value: 1,
		params: {
			min: 0,
			max: 10,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uTimeOffset.value = value
		}
	},
	speed: {
		value: 1,
		params: {
			min: 0,
			max: 10,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uSpeed.value = value
		}
	},
	waveNoiseStrength: {
		value: 0.,
		params: {
			min: 0,
			max: 2,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uWaveNoiseStrength.value = value
		}
	},
	textureNoiseStrength: {
		value: 0.07,
		params: {
			min: 0,
			max: 2,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uTextureNoiseStrength.value = value
		}
	},
	edgeCurve: {
		value: 0.328,
		params: {
			min: -2,
			max: 2,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uEdgeCurve.value = value
		}
	},
	segments: {
		value: 3,
		params: {
			min: 0,
			max: 20,
			step: 0.1
		},
		onChange: ({ value }) => {
			uniforms.uSegments.value = value
		}
	}
}

let camera
let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uColor: { value: new THREE.Color(props.color.value) },
	uBgColor: { value: new THREE.Color(props.bgColor.value) },
	uOrigin: { value: new THREE.Vector2(...props.origin.value) },
	uRingAmount: { value: props.ringAmount.value },
	uTimeOffset: { value: props.timeOffset.value },
	uSpeed: { value: props.speed.value },
	uWaveNoiseStrength: { value: props.waveNoiseStrength.value },
	uTextureNoiseStrength: { value: props.textureNoiseStrength.value },
	uEdgeCurve: { value: props.edgeCurve.value },
	uSegments: { value: props.segments.value }
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
	camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000)

	let geometry = new THREE.BufferGeometry()
	geometry.setAttribute(
		'position',
		new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3),
	)
	geometry.setAttribute(
		'uv',
		new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2),
	)

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
	)

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
	uniforms.uTime.value = time

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
	uniforms.uResolution.value.x = width
	uniforms.uResolution.value.y = height

	camera.left = -width * 0.5
	camera.right = width * 0.5
	camera.top = height * 0.5
	camera.bottom = -height * 0.5

	camera.updateProjectionMatrix()
}

export let rendering = 'three'
