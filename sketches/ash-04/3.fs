uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D t2;
uniform sampler2D t3;

varying vec2 vUv;

float random(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * 443.8975);
	p3 += dot(p3, p3.yzx + 19.19);
	return fract((p3.x + p3.y) * p3.z);
}

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
    float time = uTime * 0.001;

    vec4 tex = texture2D(t3, vec2(vUv.x, vUv.y));

    gl_FragColor = tex;

    gl_FragColor.rgb = blendSoftLight(gl_FragColor.rgb, vec3(random(vUv) - 0.5), 0.1);

    #include <colorspace_fragment>
}
