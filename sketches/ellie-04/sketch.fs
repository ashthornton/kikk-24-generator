precision highp float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform vec3 uColor6;

uniform float uWaveFrequency;
uniform float uWaveAmplitude;
uniform float uNoiseFreq1;
uniform float uNoiseAmp1;
uniform float uNoiseFreq2;
uniform float uNoiseFreq3;
uniform float uNoiseFreq4;
uniform float uDistortYAmount;

varying vec2 vUv;

#include "../../lygia/generative/pnoise.glsl"
#include "../../lygia/generative/fbm.glsl"

void main() {
	float minTime = 30.0;
	float time = uTime * 0.0001;
	time += minTime;
	
    vec2 uv = vUv;
	uv.y += sin(uv.x * uWaveFrequency + time) * uWaveAmplitude;
    float d1 = fbm(vec2(uv * uNoiseFreq2 + -time)) * 0.5 + 0.5 * 1.0;
    float d2 = fbm(vec2(uv * uNoiseFreq3 + -time)) * 0.5 + 0.5 * 1.0;
    float d3 = fbm(vec2(uv * uNoiseFreq4 + time)) * 0.5 + 0.5 * 1.0;

    float d = mix(d1, d2, sin(uv.x * time));
	d = mix(d, d3, sin(uv.x * uNoiseFreq1 * -time));
	d *= d * srandom(uv.x - 1.0 * 1.0) * uNoiseAmp1;

	float i = floor(uv.x * 0.0001);  
	float f = fract(uv.x);  
	float y = srandom(i);

	d *= y * cos(uv.x * 10.0) * 3.0;

    float steps = 4.0;
    float stepHeight = 1.0 / steps;
    float distortedY = vUv.y + d * uDistortYAmount;
    float stepIndex = floor(distortedY / stepHeight);
    float fraction = fract(distortedY / stepHeight);

    vec3 color1;
    vec3 color2;

    if (stepIndex == 3.0) {
        color1 = uColor1; 
        color2 = uColor2; 
    } else if (stepIndex == 2.0) {
        color1 = uColor2; 
        color2 = uColor3; 
    } else if (stepIndex == 1.0) {
        color1 = uColor3; 
        color2 = uColor4; 
    } else if (stepIndex == 0.0) {
        color1 = uColor4; 
        color2 = uColor4; 
    } else {
        color1 = uColor4; 
        color2 = uColor4; 
    }

    vec3 color = mix(color1, color2, smoothstep(0.0, 1.0, d));

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}
