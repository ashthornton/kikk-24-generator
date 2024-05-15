import{d as m,S as g}from"./three.module-537d8d5f.js";import{a4 as w,a5 as S,a6 as h,a7 as x,a8 as U}from"./index-2519eb49.js";let n,i=[],P=`
    precision highp float;
    uniform sampler2D uSampler;
    varying vec2 vUv;

    void main() {
        vec3 mapTexel = texture2D(uSampler, vUv).rgb;
        gl_FragColor = vec4(mapTexel, 1.);
    }
`,C=({canvas:t})=>{n=new m({antialias:!0});const r=n.render;return n.render=(e,a)=>{y(e),r.call(n,e,a)},{renderer:n}},I=({id:t,canvas:r,width:e,height:a,pixelRatio:s})=>{let{gl:l,render:u,resize:o,uniforms:p,destroy:c}=w({canvas:r,shader:P,uniforms:{uSampler:{value:null,type:"sampler2D"}}}),f=new S(l,{image:n.domElement});p.uSampler.value=f;let v=new g;return i.push({id:t,scene:v,texture:f,render:u,resize:o,destroy:c,rendered:!1}),{scene:v,renderer:n}},b=({id:t,canvas:r})=>{const e=i.findIndex(s=>s.id===t),a=i[e];h(n.getContext().__uuid),a&&(a.texture.destroy(),a.destroy(),i.splice(e,1))},k=({id:t})=>{const r=i.find(e=>e.id===t);r&&(r.rendered=!1)},E=({id:t})=>{const r=i.find(e=>e.id===t);r&&(r.texture.needsUpdate=!0,r.render(),r.rendered=!0),i.every(e=>e.rendered)&&d.length>0&&D()},K=({width:t,height:r,pixelRatio:e})=>{n.setPixelRatio(e),n.setSize(t,r);for(let a=0;a<i.length;a++)i[a].resize({width:t,height:r,pixelRatio:e})},d=[];function y(t){d.length>0&&t.traverse(r=>{if(r.material){const{material:e}=r;if(e.isShaderMaterial||e.isRawShaderMaterial){const{vertexShader:a,fragmentShader:s}=e;Object.keys({vertexShader:a,fragmentShader:s}).forEach(l=>{const u=e[l],o=x(u),p=d.find(c=>c.filepath===o);p&&(console.log(`[fragment-plugin-hsr] hsr update ${o.replace("/Users/zala/Documents/Client Projects/KIKK-ID-2024-05/kikk-24-generator","")}`),e[l]=p.source,e.needsUpdate=!0)})}}})}function D(){d=[]}U.on("shader-update",t=>{h(n.getContext().__uuid),d=t});export{C as init,E as onAfterUpdatePreview,k as onBeforeUpdatePreview,b as onDestroyPreview,I as onMountPreview,K as resize};
