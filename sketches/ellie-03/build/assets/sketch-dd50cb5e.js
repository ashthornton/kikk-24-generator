import{V as c,C as u,O as m,B as s,F as a,M as d,R as f}from"./three.module-859791a4.js";const C=`precision highp float;
#define GLSLIFY 1

uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

float random (vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233)) * 43758.5453123));
}

void main() {
	vec2 st = vUv;
    vec2 uv = vUv * uResolution.xy * 0.04;
    vec2 grid = floor(vec2(uv.x + uTime * 0.001, uv.y + (1.0 - uv.x) * pow(0.0, uv.x)));

    vec2 normalizedGrid = grid / uResolution.xy * 0.001; 

    float randomValue = random(normalizedGrid * cos(-uTime * 0.0000001) * mod(-uTime * 0.00001, 10000.0)) * random(normalizedGrid * sin(uTime * 0.00000001) * 1000.0); 

    vec3 color = randomValue > 0.5 ? vec3(1.0) : vec3(0.0);

	vec3 layer1 = mix(uColor1, uColor2, st.y);
	vec3 layer2 = mix(uColor1, uColor2, 1.0 - st.y);

	vec3 finalColor = mix(layer1, layer2, color);

    gl_FragColor = vec4(finalColor, 1.0);
}`;let i={color1:{value:"#eebcd1",onChange:({value:e})=>{r.uColor1.value.set(e)}},color2:{value:"#4dbbff",onChange:({value:e})=>{r.uColor2.value.set(e)}}},o,r={uResolution:{value:new c},uTime:{value:0},uColor1:{value:new u(i.color1.value)},uColor2:{value:new u(i.color2.value)}},p=({scene:e,width:n,height:l})=>{o=new m(1,1,1,1,1,1e3);let t=new s;t.setAttribute("position",new a([-1,3,0,-1,-1,0,3,-1,0],3)),t.setAttribute("uv",new a([0,2,0,0,2,0],2));let v=new d(t,new f({vertexShader:`
        attribute vec3 position;
        attribute vec2 uv;

        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.);
        }
        `,fragmentShader:C,uniforms:r}));e.add(v)},y=({renderer:e,scene:n,time:l,deltaTime:t})=>{r.uTime.value=l,e.render(n,o)},x=({width:e,height:n})=>{r.uResolution.value.x=e,r.uResolution.value.y=n,o.left=-e*.5,o.right=e*.5,o.top=n*.5,o.bottom=-n*.5,o.updateProjectionMatrix()},b="three",h={gui:{output:!0}};export{h as buildConfig,p as init,i as props,b as rendering,x as resize,y as update};
