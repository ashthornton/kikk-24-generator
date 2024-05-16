import * as THREE from 'three';
import fragmentShader from './sketch.fs';

let camera;

export let props = {
	color1: {
		value: '#eab3c8',
		onChange: ({ value }) => {
			uniforms.uColor1.value.set(value)
		}
	},
	color2: {
		value: '#c3dbe9',
		onChange: ({ value }) => {
			uniforms.uColor2.value.set(value)
		}
	},
	color3: {
		value: '#b5d4cf',
		onChange: ({ value }) => {
			uniforms.uColor3.value.set(value)
		}
	},
	color4: {
		value: '#4dbbff',
		onChange: ({ value }) => {
			uniforms.uColor4.value.set(value)
		}
	},
	color5: {
		value: '#aac1cf',
		onChange: ({ value }) => {
			uniforms.uColor5.value.set(value)
		}
	},
	color6: {
		value: '#4dbbff',
		onChange: ({ value }) => {
			uniforms.uColor5.value.set(value)
		}
	},
	waveFrequency: {
		value: 9.0,
		params: {
			min: 0,
			max: 100,
			step: 1.0,
		},	
		onChange: ({ value }) => {
			uniforms.uWaveFrequency.value = value;
		}
	},
	waveAmplitude: {
		value: 1.0,
		params: {
			min: 0,
			max: 100,
			step: 1.0,
		},	
		onChange: ({ value }) => {
			uniforms.uWaveAmplitude.value = value;
		}
	},
	noise1Freq: {
		value: 1,
		params: {
			min: 0,
			max: 200.0,
			step: 1.0,
		},
		onChange: ({ value }) => {
			uniforms.uNoiseFreq1.value = value;
		}
	},
	noise1Amp: {
		value: 1,
		params: {
			min: 0,
			max: 200.0,
			step: 1.0,
		},
		onChange: ({ value }) => {
			uniforms.uNoiseAmp1.value = value;
		}
	},
	noise2Freq: {
		value: 55.0,
		params: {
			min: 0,
			max: 400.0,
			step: 1.0,
		},
		onChange: ({ value }) => {
			uniforms.uNoiseFreq2.value = value;
		}
	},
	noise3Freq: {
		value: 55.0,
		params: {
			min: 0,
			max: 400.0,
			step: 1.0,
		},
		onChange: ({ value }) => {
			uniforms.uNoiseFreq3.value = value;
		}
	},
	noise4Freq: {
		value: 100.0,
		params: {
			min: 0,
			max: 400.0,
			step: 1.0,
		},
		onChange: ({ value }) => {
			uniforms.uNoiseFreq4.value = value;
		}
	},
	distortYAmount: {
		value: 0.1,
		params: {
			min: 0,
			max: 10.0,
			step: 0.001,
		},
		onChange: ({ value }) => {
			uniforms.uDistortYAmount.value = value;
		}
	}
}

let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uColor1: { value: new THREE.Color(props.color1.value) },
	uColor2: { value: new THREE.Color(props.color2.value) },
	uColor3: { value: new THREE.Color(props.color3.value) },
	uColor4: { value: new THREE.Color(props.color4.value) },
	uColor5: { value: new THREE.Color(props.color5.value) },
	uColor6: { value: new THREE.Color(props.color6.value) },
	uWaveFrequency: { value: props.waveFrequency.value },
	uWaveAmplitude: { value: props.waveAmplitude.value },
	uNoiseFreq1: { value: props.noise1Freq.value },
	uNoiseAmp1: { value: props.noise1Freq.value },
	uNoiseFreq2: { value: props.noise2Freq.value },
	uNoiseFreq3: { value: props.noise3Freq.value },
	uNoiseFreq4: { value: props.noise4Freq.value },
	uDistortYAmount: { value: props.distortYAmount.value },
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

export let rendering = 'three';

export let exportDir = './exports'

export let buildConfig = {
	gui: {
		output: true
	}
}
