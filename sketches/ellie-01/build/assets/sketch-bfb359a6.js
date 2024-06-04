import{V as s,C as l,O as m,B as c,F as i,M as p,S as f}from"./three.module-b0f710bc.js";const C=`#define GLSLIFY 1
uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uRows;
uniform float uXDisplacement;
uniform float uSpeed;

varying vec2 vUv;

void main() {
	vec2 uv = vUv;

	float y = uv.y * uRows;

	float minTime = 15.0;
	float time = uTime * 0.00001 * uSpeed;
	time += minTime;

	uv.y *= uRows;
	uv.x += time * sin(uv.y) * (cos(uv.y) * uXDisplacement);

	float x = uv.x + time * sin(uv.y) * (cos(uv.y) * uXDisplacement);
	y += x;

	float position = (vUv.y - 0.5) * 2.0; 

	vec3 gradient = mix(uColor1, uColor2, smoothstep(0.0, 0.325, fract(y)));
	gradient = mix(gradient, uColor3, smoothstep(0.325, 0.735, fract(y)));
	gradient = mix(gradient, uColor4, smoothstep(0.735, 1.0, fract(y)));

	gl_FragColor = vec4(gradient.rgb, 1.0);

	#include <colorspace_fragment>
}`;let n={rows:{value:7.7,params:{min:0,max:20,step:.1},onChange:({value:e})=>{o.uRows.value=e}},speed:{value:5,params:{min:1,max:10,step:1},onChange:({value:e})=>{o.uSpeed.value=e}},xDisplacement:{value:5,params:{min:0,max:20,step:.5},onChange:({value:e})=>{o.uXDisplacement.value=e}},color1:{value:"#EBADA7",onChange:({value:e})=>{o.uColor1.value.set(e)}},color2:{value:"#47CAB2",onChange:({value:e})=>{o.uColor2.value.set(e)}},color3:{value:"#0448F7",onChange:({value:e})=>{o.uColor3.value.set(e)}},color4:{value:"#0F144E",onChange:({value:e})=>{o.uColor4.value.set(e)}}},t,o={uResolution:{value:new s},uTime:{value:0},uColor1:{value:new l(n.color1.value)},uColor2:{value:new l(n.color2.value)},uColor3:{value:new l(n.color3.value)},uColor4:{value:new l(n.color4.value)},uRows:{value:n.rows.value},uXDisplacement:{value:n.xDisplacement.value},uSpeed:{value:n.speed.value}},g=({scene:e,width:u,height:r})=>{t=new m(1,1,1,1,1,1e3);let a=new c;a.setAttribute("position",new i([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new i([0,2,0,0,2,0],2));let v=new p(a,new f({vertexShader:`
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.);
        }
        `,fragmentShader:C,uniforms:o}));e.add(v)},x=({renderer:e,scene:u,time:r,deltaTime:a})=>{o.uTime.value=r,e.render(u,t)},w=({width:e,height:u})=>{o.uResolution.value.x=e,o.uResolution.value.y=u,t.left=-e*.5,t.right=e*.5,t.top=u*.5,t.bottom=-u*.5,t.updateProjectionMatrix()},y="three",h="./exports",D={gui:{output:!0,size:.2}};export{D as buildConfig,h as exportDir,g as init,n as props,y as rendering,w as resize,x as update};
