precision highp float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;

uniform vec2 uMouse;

uniform vec3 uOutlineColor;
uniform float uOutlineThickness;

uniform float uNoiseStrength;

varying vec2 vUv;

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

float random(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * 443.8975);
	p3 += dot(p3, p3.yzx + 19.19);
	return fract((p3.x + p3.y) * p3.z);
}

void main() {

    vec3 outputColor = mix(uColor1, uColor2, vUv.y);
    
    vec2 mousePosition = vec2(0.5);

    // make a rectangle around the mouse
    float rectangle = 0.0;
    float rectangleWidth = 0.1;
    float distanceX = abs((vUv.x - 0.5) * 2.0 - uMouse.x);
    float distanceY = abs((vUv.y - 0.5) * 2.0 - uMouse.y);

    float outlineThickness = uOutlineThickness * 0.01;
    float outline = 0.0;
    outline = step(rectangleWidth, distanceX) * (1.0 - step(rectangleWidth + outlineThickness, distanceX)); // do masking on X
    outline *= (1.0 - step(rectangleWidth + outlineThickness, distanceY));
    outline += step(rectangleWidth, distanceY) * (1.0 - step(rectangleWidth + outlineThickness, distanceY)); // do masking on Y
    outline *= (1.0 - step(rectangleWidth + outlineThickness, distanceX));
    outline = clamp(outline, 0.0, 1.0);

    float shape = (1.0 - step(rectangleWidth, distanceX)) * (1.0 - step(rectangleWidth, distanceY));

    outputColor = mix(outputColor, uOutlineColor, outline);

    gl_FragColor = vec4(outputColor, 1.);


    gl_FragColor.rgb = blendSoftLight(gl_FragColor.rgb, vec3(random(vUv * 5.) - 0.5), uNoiseStrength);

}
