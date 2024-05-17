precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D t2;
uniform float uDragSpeed;
uniform vec2 uDragSpeedRamp;
uniform float uBottomNoiseStrength;
uniform float uBottomNoiseScale;
uniform float uBottomNoiseSpeed;

varying vec2 vUv;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

#include "../../lygia/generative/pnoise.glsl"

void main() {
    float time = uTime * 0.001;

    float noiseX = pnoise(vec3(vec2(vUv.x * uBottomNoiseScale, vUv.y) * 6.465, time * uBottomNoiseSpeed), vec3(24.));
    noiseX *= smoothstep(0.9, 0., vUv.y);
    noiseX *= uBottomNoiseStrength;

    float speed = map(vUv.y, 1., 0., uDragSpeedRamp.x, uDragSpeedRamp.y); // speed up towards the bottom
    speed *= uDragSpeed;
    // speed = 0.002;

    vec4 paintTex = texture2D(t2, vec2(vUv.x + noiseX * smoothstep(0.1, 0.3, vUv.y), vUv.y + speed));

    // paintTex.rgb = vec3(noiseX);

    gl_FragColor = paintTex;
}
