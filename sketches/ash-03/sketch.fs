precision highp float;

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

#define PI     3.14159265358
#define TWO_PI 6.28318530718

#include "../../lygia/generative/snoise.glsl"

void main() {
    vec2 uv = (2. * gl_FragCoord.xy - uResolution) / min(uResolution.x, uResolution.y);

    float time = uTime * 0.001;
    float radsPercent = atan(uv.x, uv.y) / TWO_PI; // get angle to center
    float dist = length(uv) * 2.; // multiply radius to achieve smaller rings
    float ringSegments = 1. + floor(dist * 4.); // number of ring segments depends on radius
    time *= ringSegments * 0.2; // increase time/spin moving out from center
    time = 0.01 * sin(time); // remap time into an oscillation
    float ringRadsOffset = 0.; // possible unique offset per ring
    radsPercent = mod(time + radsPercent + ringRadsOffset, 1.); // rotate individual rings
    // if (mod(ringSegments, 2.) == 1.)
    //     ringSegments++; // make sure we have even number of segments
    float segment = radsPercent * ringSegments; // progress around circle
    float segmentNumber = floor(segment); // iterate over ring segments - get segment number
    // segment -= segment * segmentNumber; // get segment progress

    float noise = snoise(vec3(uv * 2., time * 0.1)); // add noise to the rings

    gl_FragColor = vec4(vUv * segment, 1., 1.);
    gl_FragColor = vec4(noise, 0., 0., 1.);
}
