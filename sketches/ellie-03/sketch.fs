uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

varying vec2 vUv;

float random (vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233)) * 43758.5453123));
}

void main() {
	vec2 st = fract(vUv * 20.0);
	vec2 grid = floor(vUv * 20.0);

    vec2 normalizedGrid = grid / uResolution.xy * 0.001;

    float randomValue = random(normalizedGrid * cos(-uTime * 0.0000001) * mod(-uTime * 0.000001, 10000.0)) * random(normalizedGrid * sin(uTime * 0.00000001) * 1000.0); // Pass the normalized grid coordinates to the random function

	float yPos = 1.0 - vUv.y;
	float yPos2 = 1.0 - st.y;

	vec3 gradient = mix(uColor1, uColor2, smoothstep(0.0, 0.26, yPos));
	gradient = mix(gradient, uColor3, smoothstep(0.26, 0.445, yPos));
	gradient = mix(gradient, uColor4, smoothstep(0.445, 1.0, yPos));

	vec3 gradient2 = mix(uColor1, uColor2, smoothstep(0.0, 0.26, yPos2));
	gradient2 = mix(gradient2, uColor3, smoothstep(0.26, 0.445, yPos2));
	gradient2 = mix(gradient2, uColor4, smoothstep(0.445, 1.0, yPos2));

    vec3 color = randomValue > 0.5 ? vec3(1.0) : vec3(0.0);

	vec3 finalColor = mix(gradient, gradient2, color);

    gl_FragColor = vec4(finalColor, 1.0);

    #include <colorspace_fragment>
}
