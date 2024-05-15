import{W as v,a as g}from"./three.module-CknGqdzL.js";import{a4 as w,a5 as S,a6 as m,a7 as x,a8 as U}from"./index-BzBzf5yj.js";let n,i=[],y=`
    precision highp float;
    uniform sampler2D uSampler;
    varying vec2 vUv;

    void main() {
        vec3 mapTexel = texture2D(uSampler, vUv).rgb;
        gl_FragColor = vec4(mapTexel, 1.);
    }
`,D=({canvas:t})=>{n=new v({antialias:!0});const r=n.render;return n.render=(e,a)=>{P(e),r.call(n,e,a)},{renderer:n}},b=({id:t,canvas:r,width:e,height:a,pixelRatio:s})=>{let{gl:l,render:f,resize:o,uniforms:p,destroy:u}=w({canvas:r,shader:y,uniforms:{uSampler:{value:null,type:"sampler2D"}}}),c=new S(l,{image:n.domElement});p.uSampler.value=c;let h=new g;return i.push({id:t,scene:h,texture:c,render:f,resize:o,destroy:u,rendered:!1}),{scene:h,renderer:n}},k=({id:t,canvas:r})=>{const e=i.findIndex(s=>s.id===t),a=i[e];m(n.getContext().__uuid),a&&(a.texture.destroy(),a.destroy(),i.splice(e,1))},E=({id:t})=>{const r=i.find(e=>e.id===t);r&&(r.rendered=!1)},M=({id:t})=>{const r=i.find(e=>e.id===t);r&&(r.texture.needsUpdate=!0,r.render(),r.rendered=!0),i.every(e=>e.rendered)&&d.length>0&&z()},R=({width:t,height:r,pixelRatio:e})=>{n.setPixelRatio(e),n.setSize(t,r);for(let a=0;a<i.length;a++)i[a].resize({width:t,height:r,pixelRatio:e})},d=[];function P(t){d.length>0&&t.traverse(r=>{if(r.material){const{material:e}=r;if(e.isShaderMaterial||e.isRawShaderMaterial){const{vertexShader:a,fragmentShader:s}=e;Object.keys({vertexShader:a,fragmentShader:s}).forEach(l=>{const f=e[l],o=x(f),p=d.find(u=>u.filepath===o);p&&(console.log(`[fragment-plugin-hsr] hsr update ${o.replace("C:\\laragon\\www\\kikk-24-generator","")}`),e[l]=p.source,e.needsUpdate=!0)})}}})}function z(){d=[]}U.on("shader-update",t=>{m(n.getContext().__uuid),d=t});export{D as init,M as onAfterUpdatePreview,E as onBeforeUpdatePreview,k as onDestroyPreview,b as onMountPreview,R as resize};
