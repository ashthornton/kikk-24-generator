precision highp float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uNoise1Scale;
uniform float uNoise2Scale;
uniform float uNoise2XMultiplier;
uniform float uNoise2YMultiplier;

varying vec2 vUv;

#include "../../lygia/generative/fbm.glsl"

void main() {
    vec2 uv = vUv;

	float noise_1 = fbm(vec2(vUv * 2.0 + uTime * 0.0001 * uSpeed) * uNoise1Scale);
	vec3 layer1 = vec3(mix(uColor1, uColor2, noise_1));

	float noise_2 = fbm(vec2(
		vec2(
			vUv.x * uNoise2XMultiplier + sin(uTime * 0.00001),
			vUv.y * uNoise2YMultiplier - cos(uTime * 0.00001)
		)
		* 3.0 - (uTime * 0.0001) * uSpeed
	) * uNoise2Scale);
	vec3 layer2 = vec3(mix(uColor1, uColor2, noise_2));

	vec3 revealShape = vec3(0.0);
	vec3 solidShape = vec3(0.0);

	for(int i = 0; i < 7; i++) {
		float randX = random(vec2(float(i), 0.0) + (uTime * 0.0000000001));
		float randY = random(vec2(float(i), 1.0) + (uTime * 0.0000000001));
		float randW = random(vec2(float(i), 2.0) + (uTime * 0.0000000001));
		float randH = random(vec2(float(i), 3.0) + (uTime * 0.0000000001));

		vec2 pos = vec2(randX, randY);
		vec2 size = vec2(randW, randH);

		vec2 rect = step(pos, uv) - step(pos + size, uv);
		revealShape += vec3(rect.x * rect.y) * 0.3;
	}

	for(int i = 0; i < 5; i++) {
		float randX = random(vec2(float(i), 1.0) + (uTime * 0.0000000001));
		float randY = random(vec2(float(i), 0.5) + (uTime * 0.0000000001));
		float randW = random(vec2(float(i), 9.0) + (uTime * 0.0000000001));
		float randH = random(vec2(float(i), 0.3) + (uTime * 0.0000000001));

		vec2 pos = vec2(randX, randY);
		vec2 size = vec2(randW, randH) * 0.3;

		vec2 rect = step(pos, uv) - step(pos + size, uv);
		solidShape += vec3(rect.x * rect.y);
	}

	vec3 finalColor = mix(layer1, layer2, revealShape.x);
	finalColor = mix(finalColor, uColor3, solidShape.x);

	gl_FragColor = vec4(finalColor, 1.0);
}
