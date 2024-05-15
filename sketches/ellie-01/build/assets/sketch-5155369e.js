import{V as s,C as i,O as m,B as p,F as r,M as c,R as f}from"./three.module-859791a4.js";const d=`precision highp float;
#define GLSLIFY 1

uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
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

	vec4 gradient = vec4(mix(uColor1, uColor2, fract(y)), 1.0);

	gl_FragColor = vec4(gradient.rgb, 1.0);
}`;let u={rows:{value:7.7,params:{min:0,max:20,step:.1},onChange:({value:e})=>{t.uRows.value=e}},speed:{value:5,params:{min:1,max:10,step:1},onChange:({value:e})=>{t.uSpeed.value=e}},xDisplacement:{value:5,params:{min:0,max:20,step:.5},onChange:({value:e})=>{t.uXDisplacement.value=e}},color1:{value:"#eebcd1",onChange:({value:e})=>{t.uColor1.value.set(e)}},color2:{value:"#4dbbff",onChange:({value:e})=>{t.uColor2.value.set(e)}}},n,t={uResolution:{value:new s},uTime:{value:0},uColor1:{value:new i(u.color1.value)},uColor2:{value:new i(u.color2.value)},uRows:{value:u.rows.value},uXDisplacement:{value:u.xDisplacement.value},uSpeed:{value:u.speed.value}},C=({scene:e,width:o,height:l})=>{n=new m(1,1,1,1,1,1e3);let a=new p;a.setAttribute("position",new r([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new r([0,2,0,0,2,0],2));let v=new c(a,new f({vertexShader:`
        attribute vec3 position;
        attribute vec2 uv;

        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.);
        }
        `,fragmentShader:d,uniforms:t}));e.add(v)},w=({renderer:e,scene:o,time:l,deltaTime:a})=>{t.uTime.value=l,e.render(o,n)},x=({width:e,height:o})=>{t.uResolution.value.x=e,t.uResolution.value.y=o,n.left=-e*.5,n.right=e*.5,n.top=o*.5,n.bottom=-o*.5,n.updateProjectionMatrix()},y="three",h="./exports",b={gui:{output:!0,size:.2}};export{b as buildConfig,h as exportDir,C as init,u as props,y as rendering,x as resize,w as update};
