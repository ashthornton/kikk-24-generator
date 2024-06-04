import * as THREE from 'three';
import fragmentShader from './sketch.fs';

export let props = {
	speed: {
		value: 2.0,
		params: {
			min: 1,
			max: 10,
			step: 1,
		},
		onChange: ({ value }) => {
			uniforms.uSpeed.value = value
		}
	},
	noise1Scale: {
		value: 0.82,
		params: {
			min: 0,
			max: 10,
			step: 0.01,
		},
		onChange: ({ value }) => {
			uniforms.uNoise1Scale.value = value
		}
	},
	noise2Scale: {
		value: 7.7,
		params: {
			min: 0,
			max: 10,
			step: 0.01,
		},
		onChange: ({ value }) => {
			uniforms.uNoise2Scale.value = value
		}
	},
	noise2XMultiplier: {
		value: 3.0,
		params: {
			min: 0,
			max: 500,
			step: 1,
		},
		onChange: ({ value }) => {
			uniforms.uNoise2XMultiplier.value = value
		}
	},
	noise2YMultiplier: {
		value: 310.0,
		params: {
			min: 0,
			max: 500,
			step: 1,
		},
		onChange: ({ value }) => {
			uniforms.uNoise2XMultiplier.value = value
		}
	},
	color1: {
		value: '#FFEEC2',
		onChange: ({ value }) => {
			uniforms.uColor1.value.set(value)
		}
	},
	color2: {
		value: '#F954A3',
		onChange: ({ value }) => {
			uniforms.uColor2.value.set(value)
		}
	},
	squareColor1: {
		value: '#FFEEC2',
		onChange: ({ value }) => {
			uniforms.uColor3.value.set(value)
		}
	},
	squareColor2: {
		value: '#F954A3',
		onChange: ({ value }) => {
			uniforms.uColor4.value.set(value)
		}
	},
	squareColor3: {
		value: '#0B2858',
		onChange: ({ value }) => {
			uniforms.uColor5.value.set(value)
		}
	},
	// gradient1Stops: {
	// 	value: {
	// 		0: 0.0,
	// 		1: 1.0,
	// 	},
	// 	params: {
	// 		min: 0,
	// 		max: 1,
	// 		step: 0.1,
	// 	},
	// 	onChange: ({ value }) => {
	// 		let keys = Object.keys(value)
	// 		let stops = keys.map(key => value[key])

	// 		uniforms.uGradient1Stop1.value = stops[0]
	// 		uniforms.uGradient1Stop2.value = stops[1]
	// 	}
	// },
	// gradient2Stops: {
	// 	value: {
	// 		0: 0.0,
	// 		1: 0.3,
	// 	},
	// 	params: {
	// 		min: 0,
	// 		max: 1,
	// 		step: 0.1,
	// 	},
	// 	onChange: ({ value }) => {
	// 		let keys = Object.keys(value)
	// 		let stops = keys.map(key => value[key])

	// 		uniforms.uGradient2Stop1.value = stops[0]
	// 		uniforms.uGradient2Stop2.value = stops[1]
	// 	}
	// }
}

let camera;
let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },

	uColor1: { value: new THREE.Color(props.color1.value) },
	uColor2: { value: new THREE.Color(props.color2.value) },
	uColor3: { value: new THREE.Color(props.squareColor1.value) },
	uColor4: { value: new THREE.Color(props.squareColor2.value) },
	uColor5: { value: new THREE.Color(props.squareColor3.value) },
	uSpeed: { value: props.speed.value },
	uNoise1Scale: { value: props.noise1Scale.value },
	uNoise2Scale: { value: props.noise2Scale.value },
	uNoise2XMultiplier: { value: props.noise2XMultiplier.value },
	uNoise2YMultiplier: { value: props.noise2YMultiplier.value },
	// uGradient1Stop1: { value: props.gradient1Stops.value[0] },
	// uGradient1Stop2: { value: props.gradient1Stops.value[1] },
	// uGradient2Stop1: { value: props.gradient2Stops.value[0] },
	// uGradient2Stop2: { value: props.gradient2Stops.value[1] }
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
export let init = ({ scene, width, height }) => {
	camera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 1000);

	let geometry = new THREE.BufferGeometry();
	geometry.setAttribute(
		'position',
		new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3),
	);
	geometry.setAttribute(
		'uv',
		new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2),
	);

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

	scene.add(mesh);
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

	renderer.render(scene, camera);
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
	uniforms.uResolution.value.x = width;
	uniforms.uResolution.value.y = height;

	camera.left = -width * 0.5;
	camera.right = width * 0.5;
	camera.top = height * 0.5;
	camera.bottom = -height * 0.5;

	camera.updateProjectionMatrix();
};

export let rendering = 'three'

export let exportDir = './exports'

export let buildConfig = {
	gui: {
		output: true,
		size: 0.2
	}
}
