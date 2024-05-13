export let props = {
	radius: {
		value: 20,
		params: {
			min: 1,
			max: 200,
			step: 1
		}
	},
	color: {
		value: '#0000ff',
	}
}

/**
 * @param {object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {CanvasRenderingContext2D} params.context
 * @param {number} params.width
 * @param {number} params.height
 * @param {number} params.pixelRatio
 */
export let init = ({ canvas, context, width, height }) => {}

/**
 * @param {object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {CanvasRenderingContext2D} params.context
 * @param {number} params.width
 * @param {number} params.height
 * @param {number} params.pixelRatio
 * @param {number} params.time
 * @param {number} params.deltaTime
 * @param {number} params.frame
 * @param {number} params.playhead
 * @param {number} params.playcount
 */
export let update = ({ context, width, height, time, deltaTime }) => {
	// set the fill color to black
	context.fillStyle = '#000000'
	// draw a rectangle covering the entire canvas
	context.fillRect(0, 0, width, height)

	// choose a radius for your canvas
	const radius = props.radius.value + Math.sin(time * 0.005) * 5

	// change the fill color to blue
	context.fillStyle = props.color.value
	// draw the circle
	context.beginPath()
	context.arc(width * 0.5, height * 0.5, radius, 0, 2 * Math.PI, false)
	// fill the previous path drawing with the current fillStyle
	context.fill()
}

/**
 * @param {object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {number} params.width
 * @param {number} params.height
 * @param {number} params.pixelRatio
 */
export let resize = ({ width, height }) => { }

export let rendering = '2d'

export let exportDir = './exports'
