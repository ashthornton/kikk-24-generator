import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js'

import fragmentShader from './sketch.fs'
import { OutputPass } from 'three/examples/jsm/Addons.js'

export let props = {
	color: {
		value: '#feca81',
		onChange: ({ value }) => {
			uniforms.uColor.value.set(value)
		}
	},
	color2: {
		value: '#ff9214',
		onChange: ({ value }) => {
			uniforms.uColor2.value.set(value)
		}
	},
	bgColor: {
		value: '#184a8b',
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
		value: 14,
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
		value: 0.374,
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
		value: 0.345,
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
		value: 0.461,
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
	staticNoiseStrength: {
		value: 0.1,
		params: {
			min: 0,
			max: 2,
			step: 0.001
		},
		onChange: ({ value }) => {
			uniforms.uStaticNoiseStrength.value = value
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
		value: 2.8,
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
let composer
let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uColor: { value: new THREE.Color(props.color.value) },
	uColor2: { value: new THREE.Color(props.color2.value) },
	uBgColor: { value: new THREE.Color(props.bgColor.value) },
	uOrigin: { value: new THREE.Vector2(...props.origin.value) },
	uRingAmount: { value: props.ringAmount.value },
	uTimeOffset: { value: props.timeOffset.value },
	uSpeed: { value: props.speed.value },
	uWaveNoiseStrength: { value: props.waveNoiseStrength.value },
	uTextureNoiseStrength: { value: props.textureNoiseStrength.value },
	uStaticNoiseStrength: { value: props.staticNoiseStrength.value },
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
export let init = ({ renderer, scene, width, height }) => {
	camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000)

	composer = new EffectComposer(renderer)

	composer.addPass(new RenderPass(scene, camera))

	const params = {
		shape: 1,
		radius: 10,
		rotateR: Math.PI / 12,
		rotateB: Math.PI / 12 * 2,
		rotateG: Math.PI / 12 * 3,
		scatter: 0,
		blending: 0.5,
		blendingMode: 1,
		greyscale: false,
		disable: false
	}
	const halftonePass = new HalftonePass(width, height, params)
	
	const renderPixelatedPass = new RenderPixelatedPass( 10, scene, camera );
	// composer.addPass( renderPixelatedPass );
	// composer.addPass(halftonePass)

	// add gamma pass
	const outputPass = new OutputPass()
	composer.addPass(outputPass)


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

	composer.render()
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
		output: true
	}
}