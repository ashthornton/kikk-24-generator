precision highp float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uRows;
uniform float uXDisplacement;
uniform float uSpeed;

varying vec2 vUv;

void main() {
	vec2 uv = vUv;

	float y = uv.y * uRows;

	float minTime = 15.0;
	float time = uTime * 0.00001 * uSpeed;
	time += minTime;

	uv.y *= uRows;
	uv.x += time * sin(uv.y) * (cos(uv.y) * uXDisplacement);

	float x = uv.x + time * sin(uv.y) * (cos(uv.y) * uXDisplacement);
	y += x;

	vec4 gradient = vec4(mix(uColor1, uColor2, fract(y)), 1.0);

	gl_FragColor = vec4(gradient.rgb, 1.0);
}
