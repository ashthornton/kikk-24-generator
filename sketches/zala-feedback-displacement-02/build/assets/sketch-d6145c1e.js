import{T as v,V as p,C as d,S,W as h,N as y,R as C,F as B,a as z,O as _,B as w,b as c,M as T,c as P}from"./three.module-537d8d5f.js";const N=`precision highp float;
#define GLSLIFY 1

#include <common>
#include <packing>

uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;

uniform float uSetup;
uniform bool uDebugSimulatorTexture;
uniform float uAnimation;

uniform sampler2D uBaseTexture;
uniform sampler2D uTexture;
uniform vec3 uColor1;
uniform vec3 uColor2;

uniform float uNoiseSpeed;
uniform float uNoiseScale;
uniform vec2 uNoiseDirection;

varying vec2 vUv;

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
    vec3 Pi0 = floor(P); 
    vec3 Pi1 = Pi0 + vec3(1.0); 
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
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

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); 
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; 
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

vec4 cubic(float v) {
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    float w = 6.0 - x - y - z;
    return vec4(x, y, z, w);
}

vec4 textureBicubicLod(sampler2D sampler, vec2 texCoords, vec2 texSize, float lod) {
    vec2 resizedTexSize = texSize / pow(2., lod);
    vec2 invTexSize = 1.0 / resizedTexSize;

    texCoords = texCoords * resizedTexSize - 0.5;

    vec2 fxy = fract(texCoords);
    texCoords -= fxy;

    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);

    vec4 c = texCoords.xxyy + vec2(-0.5, +1.5).xyxy;

    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4(xcubic.yw, ycubic.yw) / s;

    offset *= invTexSize.xxyy;

    vec4 sample0 = texture2DLodEXT(sampler, offset.xz, lod);
    vec4 sample1 = texture2DLodEXT(sampler, offset.yz, lod);
    vec4 sample2 = texture2DLodEXT(sampler, offset.xw, lod);
    vec4 sample3 = texture2DLodEXT(sampler, offset.yw, lod);

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);
}

vec4 textureBicubicLodMix(sampler2D tex, vec2 uv, vec2 originalPixelSize, float level) {
    float ratio = mod(level, 1.0);
    float minLevel = floor(level);
    float maxLevel = ceil(level);
    vec4 minValue = textureBicubicLod(tex, uv, originalPixelSize, minLevel);
    vec4 maxValue = textureBicubicLod(tex, uv, originalPixelSize, maxLevel);
    return mix(minValue, maxValue, ratio);
}

void main() {

    if(uSetup == 1.) { 
        gl_FragColor = vec4(mix(uColor1, uColor2, vUv.y), 1.);
        return;
    }

    if(uSetup == 2.) { 
        gl_FragColor = vec4(vUv, 0., 1.);
        return;
    }

    if(uDebugSimulatorTexture) {
        gl_FragColor = texture2D(uTexture, vUv);
        return;
    }

    float lod = 2.0;
    vec4 downsample = textureBicubicLodMix(uBaseTexture, vUv, vec2(uResolution), lod);
    vec4 downsample1 = textureBicubicLodMix(uBaseTexture, vUv, vec2(uResolution), lod * 2.0);
    vec4 downsample3 = textureBicubicLodMix(uBaseTexture, vUv, vec2(uResolution), lod * 4.0);
    vec4 downsample4 = textureBicubicLodMix(uBaseTexture, vUv, vec2(uResolution), lod * 8.0);

    vec2 offset = vec2(0.0);

    if(uAnimation == 0.) {
        downsample -= 0.5;
        downsample1 -= 0.5;
        downsample3 -= 0.5;
        downsample4 -= 0.5;
    }

    offset.x = min(min(downsample.r, downsample1.r), min(downsample3.r, downsample4.r));
    offset.y = min(min(downsample.g, downsample1.g), min(downsample3.g, downsample4.g));

    vec2 distortedTexel = texture2D(uTexture, offset).rg;

    float noise = 0.0;
    if(uAnimation == 0.) {
        float len = min(min(length(downsample.rg), length(downsample1.rg)), min(length(downsample3.rg), length(downsample4.rg)));

        
        noise = map(cnoise(vec2(len * uNoiseScale, uTime * uNoiseSpeed * 0.01)), -1., 1., -0.5, 1.0);
    } else {
        noise = map(cnoise(vec3(distortedTexel * uNoiseScale, uTime * uNoiseSpeed * 0.01)), -1., 1., -0.8, 1.0);
    }

    offset = vec2(
        noise * uNoiseDirection.x,
        noise * uNoiseDirection.y
    );
    vec4 texel = texture2D(uTexture, vUv + offset * 0.001 * uDelta);

    gl_FragColor = vec4(texel.rg, 0.0, 1.);
}`;let i,r,m=!1,a={color1:{value:"#0088cc",type:"color",displayName:"Bottom Base Color",onChange:(e,{width:n,height:o,pixelRatio:l})=>{t.uColor1.value.setHex(e.value.replace("#","0x"))}},color2:{value:"#fdd3e0",type:"color",displayName:"Top Base Color",onChange:(e,{width:n,height:o,pixelRatio:l})=>{t.uColor2.value.setHex(e.value.replace("#","0x"))}},pauseDistortion:{value:()=>{a.pauseDistortion.params.label==="pause"?a.pauseDistortion.params.label="play":a.pauseDistortion.params.label="pause",t.uDebugSimulatorTexture.value=!t.uDebugSimulatorTexture.value},displayName:"Pause Distortion",params:{label:"pause"}},reset:{value:()=>{t.uBaseTexture.value=new v,m=!1,t.uSetup.value=2},params:{label:"reset simulation"}},noiseSpeed:{value:.1,displayName:"Noise Speed",params:{min:0,max:1,step:.001},onChange:(e,{width:n,height:o,pixelRatio:l})=>{t.uNoiseSpeed.value=e.value}},noiseScale:{value:2,type:"number",displayName:"Noise Scale",onChange:(e,{width:n,height:o,pixelRatio:l})=>{t.uNoiseScale.value=e.value}},noiseDirection:{value:[0,1],displayName:"Noise Direction",onChange:(e,{width:n,height:o,pixelRatio:l})=>{t.uNoiseDirection.value.set(e.value[0],e.value[1])}},animationType:{value:1,params:{min:0,max:1,step:1},displayName:"Animation Type",onChange:(e,{width:n,height:o,pixelRatio:l})=>{t.uAnimation.value=e.value}},debugDispTexture:{value:!1,displayName:"Debug Displacement Texture",onChange:(e,{width:n,height:o,pixelRatio:l})=>{D.uDebugDisplacementTexture.value=e.value}}},t={uResolution:{value:new p},uTime:{value:0},uDelta:{value:0},uTexture:{value:new v},uBaseTexture:{value:new v},uSetup:{value:2},uColor1:{value:new d().setHex(a.color1.value.replace("#","0x"))},uColor2:{value:new d().setHex(a.color2.value.replace("#","0x"))},uDebugSimulatorTexture:{value:!1},uNoiseSpeed:{value:a.noiseSpeed.value},uNoiseScale:{value:a.noiseScale.value},uNoiseDirection:{value:new p(a.noiseDirection.value[0],a.noiseDirection.value[1])},uAnimation:{value:a.animationType.value}},D={uDisplacementTexture:{value:new v},uBaseTexture:{value:new v},uDebugDisplacementTexture:{value:a.debugDispTexture.value}},u,s,f,x,g;function R(){let e=new w;e.setAttribute("position",new c([-1,3,0,-1,-1,0,3,-1,0],3)),e.setAttribute("uv",new c([0,2,0,0,2,0],2));let n=new T(e,new P({vertexShader:`
				varying vec2 vUv;

				void main() {
					vUv = uv;
					gl_Position = vec4(position, 1.);
				}
        `,fragmentShader:N,uniforms:t}));r.add(n)}function L(e){let n=new w;n.setAttribute("position",new c([-1,3,0,-1,-1,0,3,-1,0],3)),n.setAttribute("uv",new c([0,2,0,0,2,0],2)),g=new P({vertexShader:`
			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = vec4(position, 1.);
			}
		`,fragmentShader:`
			precision highp float;
			#include <common>

			uniform sampler2D uDisplacementTexture;
			uniform sampler2D uBaseTexture;

			uniform bool uDebugDisplacementTexture;

			varying vec2 vUv;

			void main() {

				vec2 offset = texture2D(uDisplacementTexture, vUv).rg;

				if(uDebugDisplacementTexture) {
					gl_FragColor = vec4(offset, 0.0, 1.0);
					return;
				}

				vec4 color = texture2D(uBaseTexture, offset);

				gl_FragColor = color;

				#include <colorspace_fragment>
			}
		`,uniforms:D});let o=new T(n,g);e.add(o)}let U=({scene:e,width:n,height:o})=>{r=new S,u=new h(n,o,{minFilter:y,magFilter:y,format:C,type:B,wrapS:z,wrapT:z}),s=u.clone(),f=u.clone(),x=u.clone(),x.texture.generateMipmaps=!0,i=new _(1,1,1,1,1,1e3),R(),L(e)},M=({renderer:e,scene:n,time:o,deltaTime:l})=>{t.uTime.value=o,t.uDelta.value=l,e.setRenderTarget(u),e.render(r,i),e.setRenderTarget(null),e.render(n,i);const b=u;u=s,s=b,g.uniforms.uDisplacementTexture.value=u.texture,t.uTexture.value=s.texture,m||(e.setRenderTarget(x),e.render(r,i),t.uBaseTexture.value=x.texture,t.uSetup.value=1,e.setRenderTarget(f),e.render(r,i),g.uniforms.uBaseTexture.value=f.texture,t.uSetup.value=0,m=!0)},A=({width:e,height:n})=>{t.uResolution.value.x=e,t.uResolution.value.y=n,i.left=-e*.5,i.right=e*.5,i.top=n*.5,i.bottom=-n*.5,i.updateProjectionMatrix()},V="three",I="./exports",E={gui:{output:!0,size:.2}};export{E as buildConfig,I as exportDir,U as init,a as props,V as rendering,A as resize,M as update};
