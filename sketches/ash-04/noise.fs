precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uGradientMidPoint;
uniform vec2 uGradientRamp;
uniform float uNoiseScale;

varying vec2 vUv;

#include "../../lygia/generative/pnoise.glsl"

void main() {
    float time = uTime * 0.001 * uSpeed;
    float r = pnoise(vec3(vUv * uNoiseScale, time), vec3(24.)) * 0.5 + 0.5;
	// float g = pnoise(vec3(vUv * 10., time + 124.352), vec3(24.)) * 0.5 + 0.5;
    // float b = pnoise(vec3(vUv * 10., time + 21.97), vec3(24.)) * 0.5 + 0.5;

    r = smoothstep(uGradientRamp.x, uGradientRamp.y, r);

    vec3 firstColor = uColor1;
    vec3 middleColor = uColor2;
    vec3 endColor = uColor3;

    // create a gradient using these colours using the r channel
    float h = uGradientMidPoint; // adjust position of middleColor
    vec3 color = mix(mix(firstColor, middleColor, r/h), mix(middleColor, endColor, (r - h)/(1.0 - h)), step(h, r));

    // color = vec3(r, g, b);
    // color = smoothstep(0.4, 0.9, color);

    gl_FragColor = vec4(color, 1.);
}
