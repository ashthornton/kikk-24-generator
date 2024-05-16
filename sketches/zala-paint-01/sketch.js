import p5 from 'p5'

let gradientCanvas
let noiseCanvas
let particles = []
let frameRate = 60
let groupNumber = 100 // number of particles to add per frame
let drawCount = 0
let maxDrawCount = 15000
let frameCount = 0
let isInited = false
let _hasFinished = false

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

// Skewing and unskewing factors for 2, 3, and 4 dimensions
const F2 = 0.5*(Math.sqrt(3)-1);
const G2 = (3-Math.sqrt(3))/6;

const F3 = 1/3;
const G3 = 1/6;

var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  // To remove the need for index wrapping, double the permutation table length
const perm = new Array(512);
const gradP = new Array(512);

function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
}

Grad.prototype.dot2 = function(x, y) {
	return this.x*x + this.y*y;
};

Grad.prototype.dot3 = function(x, y, z) {
	return this.x*x + this.y*y + this.z*z;
};

var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
			new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
			new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];


function seed(seed) {
	if(seed > 0 && seed < 1) {
		// Scale the seed out
		seed *= 65536;
	}

	seed = Math.floor(seed);
	if(seed < 256) {
		seed |= seed << 8;
	}

	for(var i = 0; i < 256; i++) {
		var v;
		if (i & 1) {
		v = p[i] ^ (seed & 255);
		} else {
		v = p[i] ^ ((seed>>8) & 255);
		}

		perm[i] = perm[i + 256] = v;
		gradP[i] = gradP[i + 256] = grad3[v % 12];
	}
};

function simplex2D(xin, yin) {
	var n0, n1, n2; // Noise contributions from the three corners
	// Skew the input space to determine which simplex cell we're in
	var s = (xin+yin)*F2; // Hairy factor for 2D
	var i = Math.floor(xin+s);
	var j = Math.floor(yin+s);
	var t = (i+j)*G2;
	var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
	var y0 = yin-j+t;
	// For the 2D case, the simplex shape is an equilateral triangle.
	// Determine which simplex we are in.
	var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
		i1=1; j1=0;
	} else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
		i1=0; j1=1;
	}
	// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	// c = (3-sqrt(3))/6
	var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	var y1 = y0 - j1 + G2;
	var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
	var y2 = y0 - 1 + 2 * G2;
	// Work out the hashed gradient indices of the three simplex corners
	i &= 255;
	j &= 255;
	var gi0 = gradP[i+perm[j]];
	var gi1 = gradP[i+i1+perm[j+j1]];
	var gi2 = gradP[i+1+perm[j+1]];
	// Calculate the contribution from the three corners
	var t0 = 0.5 - x0*x0-y0*y0;
	if(t0<0) {
		n0 = 0;
	} else {
		t0 *= t0;
		n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
	}
	var t1 = 0.5 - x1*x1-y1*y1;
	if(t1<0) {
		n1 = 0;
	} else {
		t1 *= t1;
		n1 = t1 * t1 * gi1.dot2(x1, y1);
	}
	var t2 = 0.5 - x2*x2-y2*y2;
	if(t2<0) {
		n2 = 0;
	} else {
		t2 *= t2;
		n2 = t2 * t2 * gi2.dot2(x2, y2);
	}
	// Add contributions from each corner to get the final noise value.
	// The result is scaled to return values in the interval [-1,1].
	return 70 * (n0 + n1 + n2);
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

function initNoise(context) {
	noiseCanvas.background(0)
	noiseCanvas.loadPixels()

	let xoff = 0
	for (let x = 0; x < noiseCanvas.width; x++) {
		let yoff = 0
		for (let y = 0; y < noiseCanvas.height; y++) {

			let noiseVal = simplex2D(xoff * 15, yoff * 33)
			let bright = noiseCanvas.map(noiseVal, 0, 1, 0, 150)
			noiseCanvas.set(x, y, noiseCanvas.color(bright))

			yoff += 0.01
		}
		xoff += 0.01
	}

	// for (let x = 0; x < noiseCanvas.width; x++) {
	// 	for (let y = 0; y < noiseCanvas.height; y++) {

	// 		let noiseVal = simplex2D(x * 0.3, y * 0.48)

	// 		let bright = noiseCanvas.map(noiseVal, 0, 1, 0, 255)
	// 		noiseCanvas.set(x, y, noiseCanvas.color(bright))
	// 	}
	// }

	noiseCanvas.updatePixels()

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

	seed(Math.random())

	p.pixelDensity(2)
	p.frameRate(frameRate)

	gradientCanvas = p.createGraphics(width, height)
	gradientCanvas.pixelDensity(2)

	gradientCanvas.drawingContext.willReadFrequently = true
	p.drawingContext.willReadFrequently = true

	initGradient()
	gradientCanvas.loadPixels()

	noiseCanvas = p.createGraphics(width, height)
	noiseCanvas.pixelDensity(2)
	initNoise()
	noiseCanvas.loadPixels()
	noiseCanvas.drawingContext.willReadFrequently = true

	const rez1 = 0.008; // angle
	const rez2 = 0.005; // color
	const gap = 10;
	const len = 3;
	const startVary = 25;

	for (let i = -20; i < width+20; i += gap) {
		for (let j = -20; j < height+20; j += gap) {

			// const n2 = (p.noise(i * rez2, j * rez2)-0.2) * 1.7 // color

		  	let x = i + p.random(-startVary, startVary)
		  	let y = j + p.random(-startVary, startVary)

			// generate random number of segments
			p.randomSeed(i * j + 451.2)
			const numOfSegments = Math.floor(p.random(5, 16))

			const pointData = {
				x: i,
				y: j,
				segments: []
			}

			for (let k = numOfSegments; k > 0; k--) {
				
				const n1 = (p.noise(x * rez1, y * rez1)-0.2) * 1.7
				const ang = n1 * Math.PI * 2 
				const newX = Math.cos(ang) * len + x 
				const newY = Math.sin(ang) * len + y

				pointData.segments.push({
					x1: x,
					y1: y,
					x2: newX,
					y2: newY
				})
				
				x = newX;
				y = newY;
			}

			particles.push(pointData)
		}
	}
}

function initGradient() {
	// draw gradient
	gradientCanvas.background(0)
	setGradient(gradientCanvas, gradientCanvas.width, gradientCanvas.height, gradientCanvas.color(props.color1.value), gradientCanvas.color(props.color2.value), "y")
}

function drawParticles(p) {
	
	// other anim
	// if(_hasFinished) return

	// const lerpAmout = frameCount % 100 / 100
	// if(lerpAmout >= 0.99) _hasFinished = true

	if (drawCount < maxDrawCount) {
		// add a group of particles
		let addbBunch = groupNumber
		if(drawCount + groupNumber > maxDrawCount) {
			// add only the difference between the number of particles and the max number of particles
			addbBunch = maxDrawCount - drawCount
		}

		drawCount += addbBunch
	}

	for(let i = 0; i < drawCount; i++) {

		// get random particle index
		p.randomSeed(i * 50 + i)
		const randomParticleIndex = Math.floor(p.random(0, particles.length))

		// get random pixel coord in the image.pixels array
		const randomPixelCoord = Math.floor(p.random(0, gradientCanvas.width * gradientCanvas.height * 4))
		p.stroke(gradientCanvas.pixels[randomPixelCoord * 4], gradientCanvas.pixels[randomPixelCoord * 4 + 1], gradientCanvas.pixels[randomPixelCoord * 4 + 2], 255)

		// other anim
		// p.fill(gradientCanvas.pixels[randomPixelCoord * 4], gradientCanvas.pixels[randomPixelCoord * 4 + 1], gradientCanvas.pixels[randomPixelCoord * 4 + 2], 255)

		// get colour from gradient at this point
		// p.stroke(gradientCanvas.get(particles[randomParticleIndex].x, particles[randomParticleIndex].y + 50 ))

		p.strokeCap(p.SQUARE)

		// other anim
		// const lerpPosX = p.lerp(particles[randomParticleIndex].segments[0].x1, particles[randomParticleIndex].segments[particles[randomParticleIndex].segments.length-1].x1, lerpAmout)
		// const lerpPosY = p.lerp(particles[randomParticleIndex].segments[0].y1, particles[randomParticleIndex].segments[particles[randomParticleIndex].segments.length-1].y1, lerpAmout)
		// p.circle(lerpPosX, lerpPosY, 5)

		for(let j = 0; j < particles[randomParticleIndex].segments.length; j++) {

			let maxStroke = 5
			let minStroke = 3

			let stroke = p.map(j, 0, particles[randomParticleIndex].segments.length, maxStroke, minStroke)

			p.strokeWeight(stroke)

			p.line(
				particles[randomParticleIndex].segments[j].x1, 
				particles[randomParticleIndex].segments[j].y1, 
				particles[randomParticleIndex].segments[j].x2, 
				particles[randomParticleIndex].segments[j].y2
			)
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
 * @param {number} params.time
 * @param {number} params.deltaTime
 * @param {number} params.frame
 * @param {number} params.playhead
 * @param {number} params.playcount
 */
export function draw({ p }) {
	p.randomSeed()

	// if(!isInited) {
		p.tint(255, 255)
		p.blendMode(p.BLEND)

		p.background(0, 0, 0)
		p.image(gradientCanvas, 0, 0) // add the bg gradient
		// isInited = true
	// }

	drawParticles(p)

	// noisy overlay
	p.blendMode(p.OVERLAY)
	
	p.tint(255, 50) // Display at half opacity
	p.image(noiseCanvas, 0, 0) // add the noise

	frameCount++

}

export let rendering = 'p5';

export let buildConfig = {
	gui: {
		output: true
	}
}
