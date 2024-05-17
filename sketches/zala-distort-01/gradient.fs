precision highp float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1; // top
uniform vec3 uColor2; // middle 
uniform vec3 uColor3; // bottom

uniform float uStep1;
uniform float uStep2;
uniform float uStep3;

varying vec2 vUv;

void main() {

   // mix the three step gradient based on uv.y
   vec3 outputColor = vec3(0.);
   outputColor += mix(uColor3, uColor2, smoothstep(uStep1, uStep2, vUv.y));
   outputColor = mix(outputColor, uColor1, smoothstep(uStep2, uStep3, vUv.y));

   gl_FragColor = vec4(outputColor, 1.0);

}
