uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uBgColor;
uniform float uRingAmount;
uniform float uTimeOffset;
uniform float uSpeed;
uniform float uWaveNoiseStrength;
uniform float uTextureNoiseStrength;
uniform float uEdgeCurve;
uniform float uSegments;
uniform vec2 uOrigin;

varying vec2 vUv;

#define PI     3.14159265358
#define TWO_PI 6.28318530718

// #include "../../lygia/generative/pnoise.glsl"
#include "../../lygia/generative/fbm.glsl"
// #include "../../lygia/generative/worley.glsl"

void main() {
    vec2 uv = (2. * gl_FragCoord.xy - uResolution) / min(uResolution.x, uResolution.y) + uOrigin;
    float time = uTime * 0.001 * uSpeed;

    float noise = fbm(vec3(vUv * 1., time * 0.1)) * 0.5 + 0.5;
    float noise2 = fbm(vec3(uv * 20., time * 0.2)) * 0.5 + 0.5;
    // noise = step(0.5, noise);

    float radsPercent = atan(uv.x, uv.y) / TWO_PI; // get angle to center
    float dist = length(uv); // multiply radius to achieve smaller rings
    float ringSegments = 0. + floor(dist * uRingAmount); // number of ring segments depends on radius
    time += sin(time * 0.010) * 10.; // remap time into an oscillation
    time *= ringSegments * 0.002 * uTimeOffset; // increase time/spin moving out from center
    float ringRadsOffset = dist * uEdgeCurve + noise * uWaveNoiseStrength; // possible unique offset per ring
    radsPercent = mod(time + radsPercent * uSegments + ringRadsOffset, 0.1); // rotate individual rings
    float segment = radsPercent * ringSegments; // progress around circle

    float finalNoise = (1. - clamp(segment, 0., 1.)) + noise2 * uTextureNoiseStrength;

    vec3 color = uBgColor;

    // color += noise;

    color = mix(color, uColor, finalNoise);

    gl_FragColor = vec4(color, 1.0);

    // gl_FragColor = vec4(vec3(segment), 1.);

    #include <colorspace_fragment>
}
