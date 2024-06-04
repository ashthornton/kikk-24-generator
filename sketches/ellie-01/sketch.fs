uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
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

	float position = (vUv.y - 0.5) * 2.0; // vUv.y is the vertical coordinate in the texture space, it varies from 0.0 to 1.0

	vec3 gradient = mix(uColor1, uColor2, smoothstep(0.0, 0.325, fract(y)));
	gradient = mix(gradient, uColor3, smoothstep(0.325, 0.735, fract(y)));
	gradient = mix(gradient, uColor4, smoothstep(0.735, 1.0, fract(y)));

	gl_FragColor = vec4(gradient.rgb, 1.0);

	#include <colorspace_fragment>
}
