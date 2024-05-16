precision highp float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

float random (vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233)) * 43758.5453123));
}

void main() {
	vec2 st = vUv;
    vec2 uv = vUv * uResolution.xy * 0.04;
    vec2 grid = floor(vec2(uv.x + uTime * 0.001, uv.y + (1.0 - uv.x) * pow(0.0, uv.x)));

    vec2 normalizedGrid = grid / uResolution.xy * 0.001; // Normalize the grid coordinates

    float randomValue = random(normalizedGrid * cos(-uTime * 0.0000001) * mod(-uTime * 0.00001, 10000.0)) * random(normalizedGrid * sin(uTime * 0.00000001) * 1000.0); // Pass the normalized grid coordinates to the random function

    vec3 color = randomValue > 0.5 ? vec3(1.0) : vec3(0.0);

	vec3 layer1 = mix(uColor1, uColor2, st.y);
	vec3 layer2 = mix(uColor1, uColor2, 1.0 - st.y);

	vec3 finalColor = mix(layer1, layer2, color);

    gl_FragColor = vec4(finalColor, 1.0);
}
