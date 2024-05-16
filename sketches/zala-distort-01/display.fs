precision highp float;
#define PI 3.14159265359

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

uniform sampler2D tBackground;

uniform vec3 uOutlineColor;
uniform float uOutlineThickness;

uniform vec2 uRectangleSize;

uniform float uWarpStrength;

uniform vec2 uBigWarpScale;
uniform vec2 uDetailWarpScale;

uniform float uNoiseStrength;

uniform int uNumberOfRectangles;

varying vec2 vUv;

uniform bool uNoWarp;

// map function
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
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

float random(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * 443.8975);
	p3 += dot(p3, p3.yzx + 19.19);
	return fract((p3.x + p3.y) * p3.z);
}

float random(float n) {
    return fract(sin(n) * 43758.5453123);
}

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

void main() {

    vec2 mousePosition = vec2(0.5);

    vec2 centerUV = vUv - 0.5;
    centerUV *= 2.0;

    // make a rectangle around the mouse
    float rectangleWidth = uRectangleSize.x;
    float rectangleHeight = uRectangleSize.y;

    float distanceX = abs(centerUV.x - uMouse.x);
    float distanceY = abs(centerUV.y - uMouse.y);

    float outlineThickness = uOutlineThickness * 0.01;

    float sdShape = sdBox(centerUV-uMouse, vec2(rectangleWidth, rectangleHeight));
    float shape = 1.0 - step(0.0, sdShape);
    float outline = smoothstep(-outlineThickness, 0.0, sdShape) * (1.0 - smoothstep(0.0, outlineThickness, sdShape));


    float rectShape = 0.0;
    float rectOutline = 0.0;
    // add more rectangle shapes
    for(int i = 0; i < uNumberOfRectangles; i++) {
        // genrate a random position
        vec2 randomPosition = vec2(
            random(step(0.7, sin(float(i) * PI * 2.0 + uTime * 0.002)) + float(i) + 1.0), 
            random(step(0.7, cos(float(i + 2) * PI * 2.0 + uTime * 0.0015)) + float(i + 3) + 1.0)
        );

        randomPosition -= 0.5; // center it
        randomPosition *= 2.0; // scale it to -1 to 1

        // set that as the mouse position
        vec2 rectCenter = randomPosition;

        float rectWidth = random(float(i) + 2.0) * 0.25 * map( step(0.7, sin(uTime * 0.005 + float(i) * 0.5)), 0., 1., 0.7, 1.0);
        float rectHeight = random(float(i * i) + 3.0) * 0.25 * map( step(0.9, cos(uTime * 0.002 + float(i) * 1.5)), 0., 1., 0.7, 1.0);;

        float sdRectBox = sdBox(centerUV-rectCenter, vec2(rectWidth, rectHeight));

        float hideAnimation = step(0.0, sin(uTime * 0.00025 + float(i + 10) + float(i + 5) * PI * 2.0));

        rectShape += 1.0 - step(0.0, sdRectBox) * hideAnimation;
        rectOutline += smoothstep(-outlineThickness, 0.0, sdRectBox) * (1.0 - smoothstep(0.0, outlineThickness, sdRectBox)) * hideAnimation;
    }

    // warp the uvs with noise
    vec2 uv = vUv;

    if(!uNoWarp) {
        vec2 warpUV = vUv;

        float bigNoise = cnoise(vec3(warpUV * uBigWarpScale, uTime * 0.0005 + 45684.));
        warpUV += bigNoise * uWarpStrength;

        // extra noise 
        float noise = cnoise(vec3((vUv) * uDetailWarpScale, uTime * 0.0007));
        warpUV += noise * uWarpStrength * 1.5;

        // float numOfRows = 20.;
        // uv.y = fract(uv.y * numOfRows); // repeat the texture

        // float maskStep = 1.0 / numOfRows;

        // // mask out the top few rows
        // // float selectionMask = step(maskStep + maskStep * 4.0, vUv.y) - maskStep * 4.0;
        // float selectionMask = step(maskStep * 15.0, vUv.y);
        // selectionMask *= step(maskStep * 2.0, 1.0 - vUv.y);

        // uv.y = mix(vUv.y, uv.y, selectionMask);

        // // displace the uvs in the selection mask
        // float displace = map(sin(vUv.y * numOfRows * PI + uTime * 0.004), -1., 1., -1., 1.0);

        // uv.x = mix(uv.x, uv.x + displace, selectionMask);

        uv = mix(warpUV, uv, shape); // warp only outside the rect
        // warp only outside the other shapes too
        uv = mix(uv, vUv, rectShape);

    }

    vec3 outputColor = texture2D(tBackground, uv).rgb;

    // flicker the outline
    float flicker = random(step(0.0, sin(uTime * 0.005)));

    rectOutline *= mix(1.0, flicker, step(0.0, sin(uTime * 0.01) * cos(uTime * 0.01 + 45864.)));
    outline *= mix(1.0, flicker, step(0.3, sin(uTime * 0.01 + 421.) * cos(uTime * 0.01 + 45864.)));


    outputColor = mix(outputColor, uOutlineColor, outline); // blend the outline on top

    // blend all the shapes outlines
    outputColor = mix(outputColor, uOutlineColor, rectOutline);

    gl_FragColor = vec4(vec3(outputColor), 1.0);

    float noiseFactor = mix(uNoiseStrength, 0.0, shape); // only add noise outside the rect
    gl_FragColor.rgb = blendSoftLight(gl_FragColor.rgb, vec3(random(vUv * 5.) - 0.5), noiseFactor);
}


