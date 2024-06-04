import{V as i,C as r,O as f,B as m,F as v,M as g,S as c}from"./three.module-CknGqdzL.js";const d=`#define GLSLIFY 1
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

    #include <colorspace_fragment>
}`;let n={color1:{value:"#FFEEC2",onChange:({value:e})=>{a.uColor1.value.set(e)}},bgColor1:{value:"#0B2858",onChange:({value:e})=>{a.uBgColor1.value.set(e)}},bgColor2:{value:"#F954A3",onChange:({value:e})=>{a.uBgColor2.value.set(e)}},columns:{value:166,params:{min:0,max:1e3,step:1},onChange:({value:e})=>{a.uColumns.value=e}},seed:{value:.001,params:{step:1e-4},onChange:({value:e})=>{a.uSeed.value=e}},speedRange:{value:[-.05,.05],params:{min:-1,max:1,step:.001},onChange:({value:e})=>{a.uSpeedRange.value.set(e[0],e[1])}},sharpness:{value:1.15,params:{min:0,max:10,step:.01},onChange:({value:e})=>{a.uSharpness.value=e}},verticalStretch:{value:.407,params:{min:.001,max:5,step:.001},onChange:({value:e})=>{a.uVerticalStretch.value=e}},intensity:{value:1.067,params:{min:.001,max:5,step:.001},onChange:({value:e})=>{a.uIntensity.value=e}},falloff:{value:2.794,params:{min:.001,max:5,step:.001},onChange:({value:e})=>{a.uFalloff.value=e}},diagonalFalloff:{value:.1,params:{min:.001,max:5,step:.001},onChange:({value:e})=>{a.uDiagonalFalloff.value=e}}},l,a={uResolution:{value:new i},uTime:{value:0},uColor1:{value:new r(n.color1.value)},uBgColor1:{value:new r(n.bgColor1.value)},uBgColor2:{value:new r(n.bgColor2.value)},uSeed:{value:n.seed.value},uColumns:{value:n.columns.value},uSpeedRange:{value:new i(n.speedRange.value[0],n.speedRange.value[1])},uSharpness:{value:n.sharpness.value},uVerticalStretch:{value:n.verticalStretch.value},uIntensity:{value:n.intensity.value},uFalloff:{value:n.falloff.value},uDiagonalFalloff:{value:n.diagonalFalloff.value}},C=({scene:e,width:u,height:t})=>{l=new f(1,1,1,1,1,1e3);let o=new m;o.setAttribute("position",new v([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new v([0,2,0,0,2,0],2));let s=new g(o,new c({vertexShader:`
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.);
        }
        `,fragmentShader:d,uniforms:a}));e.add(s)},h=({renderer:e,scene:u,time:t,deltaTime:o})=>{a.uTime.value=t,e.render(u,l)},S=({width:e,height:u})=>{a.uResolution.value.x=e,a.uResolution.value.y=u,l.left=-e*.5,l.right=e*.5,l.top=u*.5,l.bottom=-u*.5,l.updateProjectionMatrix()},x="three",y="./exports",F={gui:{output:!0,size:.2}};export{F as buildConfig,y as exportDir,C as init,n as props,x as rendering,S as resize,h as update};
