precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uBgColor1;
uniform vec3 uBgColor2;
uniform float uColumns;
uniform float uSeed;
uniform vec2 uSpeedRange;
uniform float uSharpness;
uniform float uVerticalStretch;
uniform float uIntensity;
uniform float uFalloff;
uniform float uDiagonalFalloff;

varying vec2 vUv;

float rand(float Seed) {
    return fract(sin(Seed * 4124213.) * 37523.);
}

float randInRange(float id, vec2 range) {
    id = rand(id);
    return range.x + id * (range.y - range.x);
}

void main() {
    vec2 uv = vUv;
    uv.x *= uResolution.x / uResolution.y;

    vec4 finalColor = vec4(mix(uBgColor1, uBgColor2, uv.y), 1.);

    float verticalStretch = 1. / uVerticalStretch;
    vec2 st = uv;

    vec2 gridID = floor(vec2(uv.x * uColumns, uv.y * verticalStretch)) * uSeed;

    uv.y += rand(gridID.x + 10. + uSeed) + randInRange(gridID.x + uSeed, uSpeedRange) * uTime * 0.001 + gridID.x * 2376.964;

    uv = fract(vec2(uv.x * uColumns, uv.y * verticalStretch));

    float diagonal = smoothstep(0., 0.1, uv.y - uv.x * uSharpness * st.y * uDiagonalFalloff);

    vec3 temp = vec3((1. - uv.x) * pow((1.0 - uv.y) * uIntensity, uFalloff)) * diagonal;

    finalColor.rgb = mix(finalColor.rgb, uColor1.rgb, temp);

    gl_FragColor = finalColor;
}
