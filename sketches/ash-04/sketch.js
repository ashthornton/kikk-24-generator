import * as THREE from 'three'
import noiseFragment from './noise.fs'
import fragment1 from './1.fs'
import fragment2 from './2.fs'
import fragment3 from './3.fs'

export let props = {
	noiseSpeed: {
		value: 0.265,
		params: {
			min: 0,
			max: 2,
			step: 0.001
		},
		onChange: ({ value }) => {
			noiseUniforms.uSpeed.value = value
		}
	},
	noiseScale: {
		value: 8,
		params: {
			min: 0,
			max: 50,
			step: 0.01
		},
		onChange: ({ value }) => {
			noiseUniforms.uNoiseScale.value = value
		}
	},
	color1: {
		value: '#f3e6c8',
		onChange: ({ value }) => {
			noiseUniforms.uColor1.value.set(value)
		}
	},
	color2: {
		value: '#ff6f31',
		onChange: ({ value }) => {
			noiseUniforms.uColor2.value.set(value)
		}
	},
	color3: {
		value: '#091524',
		onChange: ({ value }) => {
			noiseUniforms.uColor3.value.set(value)
		}
	},
	gradientMidPoint: {
		value: 0.5,
		params: {
			min: 0,
			max: 1,
			step: 0.001
		},
		onChange: ({ value }) => {
			noiseUniforms.uGradientMidPoint.value = value
		}
	},
	gradientRamp: {
		value: [0.107, 0.704],
		params: {
			min: 0,
			max: 1,
			step: 0.001
		},
		onChange: ({ value }) => {
			noiseUniforms.uGradientRamp.value.set(...value)
		}
	},
	dragSpeed: {
		value: 0.006,
		params: {
			min: 0,
			max: 0.05,
			step: 0.0001
		},
		onChange: ({ value }) => {
			mesh3.material.uniforms.uDragSpeed.value = value
		}
	},
	dragSpeedRamp: {
		value: [0.1, 1.],
		params: {
			min: 0,
			max: 4,
			step: 0.01
		},
		onChange: ({ value }) => {
			mesh3.material.uniforms.uDragSpeedRamp.value.set(...value)
		}
	},
	bottomNoiseStrength: {
		value: 0.004,
		params: {
			min: 0,
			max: 0.05,
			step: 0.0001
		},
		onChange: ({ value }) => {
			mesh3.material.uniforms.uBottomNoiseStrength.value = value
		}
	},
	bottomNoiseScale: {
		value: 10,
		params: {
			min: 0,
			max: 50,
			step: 0.1
		},
		onChange: ({ value }) => {
			mesh3.material.uniforms.uBottomNoiseScale.value = value
		}
	},
	bottomNoiseSpeed: {
		value: 0.2,
		params: {
			min: 0,
			max: 5,
			step: 0.01
		},
		onChange: ({ value }) => {
			mesh3.material.uniforms.uBottomNoiseSpeed.value = value
		}
	}
}

let camera
let rt
let rt2
let rt3
let scene2
let mesh2
let scene3
let mesh3
let scene4
let mesh4
let globalUniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
}

let noiseUniforms = {
	uSpeed: { value: props.noiseSpeed.value },
	uColor1: { value: new THREE.Color(props.color1.value) },
	uColor2: { value: new THREE.Color(props.color2.value) },
	uColor3: { value: new THREE.Color(props.color3.value) },
	uGradientMidPoint: { value: props.gradientMidPoint.value },
	uGradientRamp: { value: new THREE.Vector2(...props.gradientRamp.value) },
	uNoiseScale: { value: props.noiseScale.value }
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
			fragmentShader: noiseFragment,
			uniforms: {
				...noiseUniforms,
				...globalUniforms
			},
		}),
	)

	scene.add(mesh)

	rt = new THREE.WebGLRenderTarget(width, height, {
		type: THREE.FloatType
	})

	scene2 = new THREE.Scene()

	mesh2 = new THREE.Mesh(
		geometry.clone(),
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
			fragmentShader: fragment1,
			uniforms: {
				tNoise: { value: rt.texture },
				tPrev: { value: null },
				...globalUniforms
			},
		}),
	)

	scene2.add(mesh2)

	rt2 = new THREE.WebGLRenderTarget(width, height, {
		type: THREE.FloatType
	})

	scene3 = new THREE.Scene()

	mesh3 = new THREE.Mesh(
		geometry.clone(),
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
			fragmentShader: fragment2,
			uniforms: {
				t2: { value: rt2.texture },
				uDragSpeed: { value: props.dragSpeed.value },
				uDragSpeedRamp: { value: new THREE.Vector2(...props.dragSpeedRamp.value) },
				uBottomNoiseStrength: { value: props.bottomNoiseStrength.value },
				uBottomNoiseScale: { value: props.bottomNoiseScale.value },
				uBottomNoiseSpeed: { value: props.bottomNoiseSpeed.value },
				...globalUniforms
			},
			transparent: true
		}),
	)
	mesh3.position.y += 0

	scene3.add(mesh3)

	rt3 = new THREE.WebGLRenderTarget(width, height, {
		type: THREE.FloatType
	})

	scene4 = new THREE.Scene()

	mesh4 = new THREE.Mesh(
		geometry.clone(),
		new THREE.ShaderMaterial({
			vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.);
        }
        `,
			fragmentShader: fragment3,
			uniforms: {
				t2: { value: rt2.texture },
				t3: { value: rt3.texture },
				...globalUniforms
			},
			transparent: true
		}),
	)

	scene4.add(mesh4)
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
	globalUniforms.uTime.value = time

	renderer.setRenderTarget(rt)
	renderer.render(scene, camera)
	renderer.setRenderTarget(null)

	mesh2.material.uniforms.tNoise.value = rt.texture

	renderer.setRenderTarget(rt2)
	renderer.render(scene2, camera)
	renderer.setRenderTarget(null)

	mesh3.material.uniforms.t2.value = rt2.texture

	const prevAutoClear = renderer.autoClear
	renderer.autoClear = false
	renderer.setRenderTarget(rt3)
	renderer.render(scene3, camera)
	renderer.setRenderTarget(null)
	renderer.autoClear = prevAutoClear

	mesh4.material.uniforms.t3.value = rt3.texture
	mesh2.material.uniforms.tPrev.value = rt3.texture

	renderer.render(scene4, camera)
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
	globalUniforms.uResolution.value.x = width
	globalUniforms.uResolution.value.y = height

	camera.left = -width * 0.5
	camera.right = width * 0.5
	camera.top = height * 0.5
	camera.bottom = -height * 0.5

	camera.updateProjectionMatrix()

	rt.setSize(width, height)
	rt2.setSize(width, height)
	rt3.setSize(width, height)
}

export let rendering = 'three'
