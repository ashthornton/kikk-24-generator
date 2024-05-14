import * as THREE from 'three'
import fragmentShader from './sketch.fs'

export let props = {
	color1: {
		value: '#fee1fa',
		onChange: ({ value }) => {
			uniforms.uColor1.value.set(value)
		}
	},
	bgColor1: {
		value: '#4dbbff',
		onChange: ({ value }) => {
			uniforms.uBgColor1.value.set(value)
		}
	},
	bgColor2: {
		value: '#000000',
		onChange: ({ value }) => {
			uniforms.uBgColor2.value.set(value)
		}
	},
	columns: {
		value: 166,
		params: {
			min: 0,
			max: 1000,
			step: 1
		},
		onChange: ({ value }) => {
			uniforms.uColumns.value = value
		}
	},
	seed: {
		value: 0.001,
		params: {
			step: 0.0001
		},
		onChange: ({ value }) => {
			uniforms.uSeed.value = value
		}
	},
	speedRange: {
		value: [-0.050, 0.05],
		params: {
			min: -1,
			max: 1,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uSpeedRange.value.set(value[0], value[1])
		}
	},
	sharpness: {
		value: 1.15,
		params: {
			min: 0,
			max: 10,
			step: 0.01
		},
		onChange: ({ value }) => {
			uniforms.uSharpness.value = value
		}
	},
	verticalStretch: {
		value: 0.407,
		params: {
			min: 0.001,
			max: 5,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uVerticalStretch.value = value
		}
	},
	intensity: {
		value: 1.067,
		params: {
			min: 0.001,
			max: 5,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uIntensity.value = value
		}
	},
	falloff: {
		value: 2.794,
		params: {
			min: 0.001,
			max: 5,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uFalloff.value = value
		}
	},
	diagonalFalloff: {
		value: 0.1,
		params: {
			min: 0.001,
			max: 5,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uDiagonalFalloff.value = value
		}
	}
}

let camera
let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uColor1: { value: new THREE.Color(props.color1.value) },
	uBgColor1: { value: new THREE.Color(props.bgColor1.value) },
	uBgColor2: { value: new THREE.Color(props.bgColor2.value) },
	uSeed: { value: props.seed.value },
	uColumns: { value: props.columns.value },
	uSpeedRange: { value: new THREE.Vector2(props.speedRange.value[0], props.speedRange.value[1] ) },
	uSharpness: { value: props.sharpness.value },
	uVerticalStretch: { value: props.verticalStretch.value },
	uIntensity: { value: props.intensity.value },
	uFalloff: { value: props.falloff.value },
	uDiagonalFalloff: { value: props.diagonalFalloff.value }
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

export let exportDir = './exports'

export let buildConfig = {
	gui: {
		output: true,
		size: 0.2
	}
}