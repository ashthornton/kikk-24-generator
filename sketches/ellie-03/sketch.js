import * as THREE from 'three';
import fragmentShader from './sketch.fs';

export let props = {
	color1: {
		value: '#C2C3DA',
		onChange: ({ value }) => {
			uniforms.uColor1.value.set(value)
		}
	},
	color2: {
		value: '#FFC165',
		onChange: ({ value }) => {
			uniforms.uColor2.value.set(value)
		}
	},
	color3: {
		value: '#FF3A3A',
		onChange: ({ value }) => {
			uniforms.uColor3.value.set(value)
		}
	},
	color4: {
		value: '#0F144E',
		onChange: ({ value }) => {
			uniforms.uColor4.value.set(value)
		}
	}
}

let camera;
let uniforms = {
	uResolution: { value: new THREE.Vector2() },
	uTime: { value: 0 },
	uColor1: { value: new THREE.Color(props.color1.value) },
	uColor2: { value: new THREE.Color(props.color2.value) },
	uColor3: { value: new THREE.Color(props.color3.value) },
	uColor4: { value: new THREE.Color(props.color4.value) }
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

export let rendering = 'three';

export let buildConfig = {
	gui: {
		output: true
	}
}