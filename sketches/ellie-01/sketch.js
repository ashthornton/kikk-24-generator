import * as THREE from 'three';
import fragmentShader from './sketch.fs';

export let props = {
	rows: {
		value: 7.7,
		params: {
			min: 0,
			max: 20,
			step: 0.1,
		},
		onChange: ({ value }) => {
			uniforms.uRows.value = value
		}
	},
	speed: {
		value: 5.0,
		params: {
			min: 1,
			max: 10,
			step: 1,
		},
		onChange: ({ value }) => {
			uniforms.uSpeed.value = value
		}
	},
	xDisplacement: {
		value: 5,
		params: {
			min: 0,
			max: 20,
			step: 0.5,
		},
		onChange: ({ value }) => {
			uniforms.uXDisplacement.value = value
		}
	},
	color1: {
		value: '#eebcd1',
		onChange: ({ value }) => {
			uniforms.uColor1.value.set(value)
		}
	},
	color2: {
		value: '#4dbbff',
		onChange: ({ value }) => {
			uniforms.uColor2.value.set(value)
		}
	}
}

let camera;
let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },

	uColor1: { value: new THREE.Color(props.color1.value) },
	uColor2: { value: new THREE.Color(props.color2.value) },
	uRows: { value: props.rows.value },
	uXDisplacement: { value: props.xDisplacement.value },
	uSpeed: { value: props.speed.value }
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

export let rendering = 'three'

export let exportDir = './exports'

export let buildConfig = {
	gui: {
		output: true,
		size: 0.2
	}
}