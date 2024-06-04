import{V as s,C as l,O as m,B as c,F as i,M as d,S as C}from"./three.module-b0f710bc.js";const g=`#define GLSLIFY 1
uniform float uTime;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

varying vec2 vUv;

float random (vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233)) * 43758.5453123));
}

void main() {
	vec2 st = fract(vUv * 20.0);
	vec2 grid = floor(vUv * 20.0);

    vec2 normalizedGrid = grid / uResolution.xy * 0.001;

    float randomValue = random(normalizedGrid * cos(-uTime * 0.0000001) * mod(-uTime * 0.000001, 10000.0)) * random(normalizedGrid * sin(uTime * 0.00000001) * 1000.0); 

	float yPos = 1.0 - vUv.y;
	float yPos2 = 1.0 - st.y;

	vec3 gradient = mix(uColor1, uColor2, smoothstep(0.0, 0.26, yPos));
	gradient = mix(gradient, uColor3, smoothstep(0.26, 0.445, yPos));
	gradient = mix(gradient, uColor4, smoothstep(0.445, 1.0, yPos));

	vec3 gradient2 = mix(uColor1, uColor2, smoothstep(0.0, 0.26, yPos2));
	gradient2 = mix(gradient2, uColor3, smoothstep(0.26, 0.445, yPos2));
	gradient2 = mix(gradient2, uColor4, smoothstep(0.445, 1.0, yPos2));

    vec3 color = randomValue > 0.5 ? vec3(1.0) : vec3(0.0);

	vec3 finalColor = mix(gradient, gradient2, color);

    gl_FragColor = vec4(finalColor, 1.0);

    #include <colorspace_fragment>
}`;let a={color1:{value:"#C2C3DA",onChange:({value:o})=>{e.uColor1.value.set(o)}},color2:{value:"#FFC165",onChange:({value:o})=>{e.uColor2.value.set(o)}},color3:{value:"#FF3A3A",onChange:({value:o})=>{e.uColor3.value.set(o)}},color4:{value:"#0F144E",onChange:({value:o})=>{e.uColor4.value.set(o)}}},n,e={uResolution:{value:new s},uTime:{value:0},uColor1:{value:new l(a.color1.value)},uColor2:{value:new l(a.color2.value)},uColor3:{value:new l(a.color3.value)},uColor4:{value:new l(a.color4.value)}},p=({scene:o,width:r,height:u})=>{n=new m(1,1,1,1,1,1e3);let t=new c;t.setAttribute("position",new i([-1,3,0,-1,-1,0,3,-1,0],3)),t.setAttribute("uv",new i([0,2,0,0,2,0],2));let v=new d(t,new C({vertexShader:`
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.);
        }
        `,fragmentShader:g,uniforms:e}));o.add(v)},y=({renderer:o,scene:r,time:u,deltaTime:t})=>{e.uTime.value=u,o.render(r,n)},h=({width:o,height:r})=>{e.uResolution.value.x=o,e.uResolution.value.y=r,n.left=-o*.5,n.right=o*.5,n.top=r*.5,n.bottom=-r*.5,n.updateProjectionMatrix()},x="three",w={gui:{output:!0}};export{w as buildConfig,p as init,a as props,x as rendering,h as resize,y as update};
