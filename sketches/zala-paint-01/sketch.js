import p5 from 'p5'

let gradientCanvas
let numberOfParticles = 1000
let particles = []
let frameRate = 60
let groupNumber = 10 // number of particles to add per frame

export let props = {
	color1: {
		value: '#fbb7cc',
		type: "color",
		displayName: "Top Base Color",
		// onChange: (prop, { width, height, pixelRatio }) => {
		// 	simUniforms.uColor2.value.setHex(prop.value.replace('#', '0x'))
		// }
	},
	color2: {
		value: '#007ecc',
		type: "color",
		displayName: "Bottom Base Color",
		// onChange: (prop, { width, height, pixelRatio }) => {
		// 	simUniforms.uColor1.value.setHex(prop.value.replace('#', '0x'))
		// }
	}
}

function setGradient(context, width, height, color1, color2, axis) {
	context.noFill()
  
	if (axis === "y") {
	  // Top to bottom gradient
	  for (let i = 0; i <= height; i++) {

		let inter = context.map(i, 0, height, 0, 1)
		let c = context.lerpColor(color1, color2, inter)

		context.stroke(c)
		context.line(0, i, width, i)

	  }
	} else if (axis === "x") {
	  // Left to right gradient
	  for (let i = 0; i <= width; i++) {

		let inter = context.map(i, 0, width, 0, 1)
		let c = context.lerpColor(color1, color2, inter)

		context.stroke(c)
		context.line(i, 0, i, height)
	  }
	}
  }

/**
 * @param {object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {p5} params.p
 * @param {number} params.width
 * @param {number} params.height
 * @param {number} params.pixelRatio
 */
export function setup({ p, width, height }) {

	p.frameRate(frameRate)

	gradientCanvas = p.createGraphics(width, height)
	gradientCanvas.pixelDensity(2)

	initGradient()
	gradientCanvas.loadPixels()
}

function initGradient() {
	// draw gradient
	gradientCanvas.background(0)
	setGradient(gradientCanvas, gradientCanvas.width, gradientCanvas.height, gradientCanvas.color(props.color1.value), gradientCanvas.color(props.color2.value), "y")
}

/**
 * @param {object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {p5} params.p
 * @param {number} params.width
 * @param {number} params.height
 * @param {number} params.pixelRatio
 * @param {number} params.time
 * @param {number} params.deltaTime
 * @param {number} params.frame
 * @param {number} params.playhead
 * @param {number} params.playcount
 */
export function draw({ p }) {
	p.background(0, 0, 0)
	p.image(gradientCanvas, 0, 0) // add the bg gradient

	if (particles.length < numberOfParticles) {

		let addbBunch = groupNumber
		if(particles.length + groupNumber > numberOfParticles) {
			// add only the difference between the number of particles and the max number of particles
			addbBunch = numberOfParticles - particles.length
		}

		// add a group of particles
		for(let i = 0; i < addbBunch; i++) {
			// get random pixel coord in the image.pixels array
			const randomPixelCoord = Math.floor(p.random(0, gradientCanvas.width * gradientCanvas.height * 4))

			particles.push({
				x: p.random(0, p.width),
				y: p.random(0, p.height),
				index: randomPixelCoord,
				radius: p.random(5, 20)
			})
		}
	}

	for(let i = 0; i < particles.length; i++) {
		p.noStroke()

		p.fill(gradientCanvas.pixels[particles[i].index * 4], gradientCanvas.pixels[particles[i].index * 4 + 1], gradientCanvas.pixels[particles[i].index * 4 + 2])
		
		p.rect(particles[i].x, particles[i].y, particles[i].radius)

		if(particles[i].x < 0) {
			particles[i].x = p.width
		}

		if(particles[i].x > p.width) {
			particles[i].x = 0
		}

		if(particles[i].y < 0) {
			particles[i].y = p.height
		}

		if(particles[i].y > p.height) {
			particles[i].y = 0
		}
	
	}

}

export let rendering = 'p5';
