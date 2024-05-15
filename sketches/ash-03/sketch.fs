uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;

varying vec2 vUv;

#define PI     3.14159265358
#define TWO_PI 6.28318530718

// #include "../../lygia/generative/snoise.glsl"
#include "../../lygia/generative/worley.glsl"

void main() {
    vec2 uv = (2. * gl_FragCoord.xy - uResolution) / min(uResolution.x, uResolution.y);

    float time = uTime * 0.001;
    float radsPercent = atan(uv.x, uv.y) / TWO_PI; // get angle to center
    float dist = length(uv) * 2.; // multiply radius to achieve smaller rings
    float ringSegments = 1. + floor(dist * 10.); // number of ring segments depends on radius
    time += sin(time * 0.010) * 10.; // remap time into an oscillation
    time *= ringSegments * 0.002; // increase time/spin moving out from center
    float ringRadsOffset = 0.; // possible unique offset per ring
    radsPercent = mod(time + radsPercent + ringRadsOffset, 0.1); // rotate individual rings
    // if (mod(ringSegments, 2.) == 1.)
    //     ringSegments++; // make sure we have even number of segments
    float segment = radsPercent * ringSegments; // progress around circle
    float segmentNumber = floor(segment); // iterate over ring segments - get segment number
    // segment -= segment * segmentNumber; // get segment progress

    // float noise = snoise(vec3(uv * 1. + segment, time * 0.1)); // add noise to the rings

    // gl_FragColor = vec4(1. - segment, 0., 0., 1.);
    // gl_FragColor = vec4(noise, 0., 0., 1.);

    // float time = uTime * 0.0001;

    float noise = worley(vec3(segment + vUv * 3., time * 25.));
    float noise2 = worley(vec3(segment + vUv * 5.125, time * 25.));

    float finalNoise = noise * noise2 * (1. - clamp(segment, 0., 1.));

    vec3 color = vec3(0.91, 0.74, 0.82);

    color = mix(color, uColor, finalNoise);

    gl_FragColor = vec4(color, 1.0);

    // #include <colorspace_fragment>
}
