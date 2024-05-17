precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D tNoise;
uniform sampler2D tPrev;

varying vec2 vUv;

void main() {
    float time = uTime * 0.001;

    vec3 color = vec3(0.);

    vec4 noiseTex = texture2D(tNoise, vec2(vUv.x, vUv.y));

    float pixelUnit = 1. / uResolution.y;

    if (vUv.y > 1. - pixelUnit * 1.) {
        color = noiseTex.rgb; // draw 1 pixel high line at the top
    } else {
        color = texture2D(tPrev, vec2(vUv.x, vUv.y)).rgb;
    }

    gl_FragColor = vec4(color, 1.);
}
