import * as THREE from 'three'

export let props = {
	framesToDraw: {
		value: 60
	},
	draw: {
		value: () => {
			frameCount = 0
		},
		displayName: null,
		params: {
			label: 'draw'
		}
	},
	clear: {
		value: () => {
			clear = true
		},
		displayName: null,
		params: {
			label: 'clear'
		}
	},
	resetRotation: {
		value: () => {
			mesh.rotation.set(0, 0, 0)
		},
		displayName: null,
		params: {
			label: 'reset rotation'
		}
	},
	meshPosition: {
		value: [0, 2, 0],
		displayName: 'Mesh Position',
		params: {
			min: -2,
			max: 2,
			step: 0.01
		},
		onChange: ({ value }) => {
			mesh.position.set(...value)
		}
	},
	color: {
		value: '#86b5f3',
		onChange: ({ value }) => {
			mesh.material.color.set(value)
		}
	},
	bgColor1: {
		value: '#86b5f3',
		onChange: ({ value }) => {
			bgMesh.material.uniforms.uColor1.value.set(value)
		}
	},
	bgColor2: {
		value: '#000000',
		onChange: ({ value }) => {
			bgMesh.material.uniforms.uColor2.value.set(value)
		}
	}
}

let camera
let mesh
let rt
let orthoCam
let projectionMesh
let bgMesh
let postScene
let frameCount = 0
let clear = false

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
	// renderer.autoClear = false

	camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
	camera.position.z = 2
	camera.lookAt(new THREE.Vector3())

	mesh = new THREE.Mesh(
		new THREE.SphereGeometry(1, 1, 1),
		new THREE.MeshBasicMaterial({
			color: props.color.value,
			wireframe: true
		})
	)
	mesh.position.set(...props.meshPosition.value)
	mesh.scale.setScalar(2)

	scene.add(mesh)

	rt = new THREE.WebGLRenderTarget(width, height)
	orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.0001, 10)

	postScene = new THREE.Scene()

	projectionMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(2, 2),
		new THREE.ShaderMaterial({
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = vec4(position, 1.);
				}
			`,
			fragmentShader: `
				uniform sampler2D tMap;
				varying vec2 vUv;
				void main() {
					gl_FragColor = texture2D(tMap, vUv);

					#include <colorspace_fragment>
				}
			`,
			uniforms: {
				tMap: { value: rt.texture }
			},
			transparent: true
		})
	)

	projectionMesh.renderOrder = 1
	postScene.add(projectionMesh)

	bgMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(2, 2),
		new THREE.ShaderMaterial({
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = vec4(position, 1.);
				}
			`,
			fragmentShader: `
				varying vec2 vUv;
				uniform vec3 uColor1;
				uniform vec3 uColor2;
				void main() {
					gl_FragColor = vec4(mix(uColor1, uColor2, vUv.y), 1.);
					#include <colorspace_fragment>
				}
			`,
			uniforms: {
				uColor1: { value: new THREE.Color(props.bgColor1.value) },
				uColor2: { value: new THREE.Color(props.bgColor2.value) },
			}
		})
	)

	bgMesh.renderOrder = 0
	postScene.add(bgMesh)
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
export let update = ({ renderer, scene, time, deltaTime, playhead, playcount, frame }) => {
	if (clear) {
		renderer.setRenderTarget(rt)
		renderer.clear()
		renderer.setRenderTarget(null)
		clear = false
	}

	if (frameCount <= props.framesToDraw.value) {
		mesh.rotation.y += deltaTime * 0.001

		const prevAutoClear = renderer.autoClear
		renderer.autoClear = false
		renderer.setRenderTarget(rt)
		renderer.render(scene, camera)
		renderer.autoClear = prevAutoClear
	}
	
	renderer.setRenderTarget(null)
	renderer.render(postScene, orthoCam)

	frameCount++
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
	camera.aspect = width / height
	camera.updateProjectionMatrix()

	rt.setSize(width, height)

	orthoCam.left = -width * 0.5
	orthoCam.right = width * 0.5
	orthoCam.top = height * 0.5
	orthoCam.bottom = -height * 0.5

	orthoCam.updateProjectionMatrix()
}

export let rendering = 'three'

export let duration = 5

export let exportDir = './exports'

export let buildConfig = {
	gui: {
		output: true,
		size: 0.3
	}
}