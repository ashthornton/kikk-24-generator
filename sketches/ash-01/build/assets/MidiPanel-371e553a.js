import{S as F,i as N,s as O,a as $,M as y,c,m as g,g as z,b as C,t as _,d as h,e as v,o as P,f,h as M,F as D,j as S,k,l as L}from"./index-b15cd309.js";function A(s){let t,a,o,r,n,u;return t=new D({props:{key:"inputs",value:s[2],params:{options:s[4]}}}),t.$on("change",s[8]),o=new D({props:{key:"outputs",value:s[3],params:{options:s[5]}}}),o.$on("change",s[9]),n=new D({props:{key:"messages",value:s[6],type:"list",disabled:!0}}),{c(){c(t.$$.fragment),a=S(),c(o.$$.fragment),r=S(),c(n.$$.fragment)},m(e,l){g(t,e,l),k(e,a,l),g(o,e,l),k(e,r,l),g(n,e,l),u=!0},p(e,l){const m={};l&4&&(m.value=e[2]),l&16&&(m.params={options:e[4]}),t.$set(m);const d={};l&8&&(d.value=e[3]),l&32&&(d.params={options:e[5]}),o.$set(d);const p={};l&64&&(p.value=e[6]),n.$set(p)},i(e){u||(_(t.$$.fragment,e),_(o.$$.fragment,e),_(n.$$.fragment,e),u=!0)},o(e){h(t.$$.fragment,e),h(o.$$.fragment,e),h(n.$$.fragment,e),u=!1},d(e){e&&(L(a),L(r)),v(t,e),v(o,e),v(n,e)}}}function B(s){let t,a;const o=[{mID:s[0]},{hasHeader:s[1]},{name:"MIDI"},s[7],{slug:"midi"}];let r={$$slots:{default:[A]},$$scope:{ctx:s}};for(let n=0;n<o.length;n+=1)r=$(r,o[n]);return t=new y({props:r}),{c(){c(t.$$.fragment)},m(n,u){g(t,n,u),a=!0},p(n,[u]){const e=u&131?z(o,[u&1&&{mID:n[0]},u&2&&{hasHeader:n[1]},o[2],u&128&&C(n[7]),o[4]]):{};u&2172&&(e.$$scope={dirty:u,ctx:n}),t.$set(e)},i(n){a||(_(t.$$.fragment,n),a=!0)},o(n){h(t.$$.fragment,n),a=!1},d(n){v(t,n)}}}function w(s=new Map){let t=[];s.size!==0&&t.push({value:"none",label:"No device selected."});for(let a of s){let o=a[1];const{id:r,name:n,manufacturer:u}=o;t.push({value:r,label:`${u} ${n} – id: ${r}`})}return t.length===0&&(t=[{value:"none",label:"No device detected."}]),t}function G(s,t,a){let{mID:o}=t,{hasHeader:r}=t,n,u,e=[],l=[],m=[];P(async()=>{await f.request();function i(){a(4,e=w(f.inputs)),a(5,l=w(f.outputs)),a(2,n=e.length===2?e[1].value:e[0].value),a(3,u=l.length===2?l[1].value:l[0].value)}f.addEventListener("connected",i),f.addEventListener("disconnected",()=>{i()}),f.addEventListener("message",E=>{const{type:b,note:H,channel:J,value:K}=E;let I=new Date,j=`${I.getHours()}:${String(I.getMinutes()).padStart(2,"0")}:${String(I.getSeconds()).padStart(2,"0")}`,q=["noteon","noteoff"].includes(b)?` note:${H.name}`:"";a(6,m=[...m,`${j} ${b} number:${H.number}${q}`])}),i()});const d=i=>a(2,n=i.detail),p=i=>a(3,u=i.detail);return s.$$set=i=>{a(7,t=$($({},t),M(i))),"mID"in i&&a(0,o=i.mID),"hasHeader"in i&&a(1,r=i.hasHeader)},s.$$.update=()=>{s.$$.dirty&4&&(f.selectedInputID=n),s.$$.dirty&8&&(f.selectedOutputID=u)},t=M(t),[o,r,n,u,e,l,m,t,d,p]}class R extends F{constructor(t){super(),N(this,t,G,B,O,{mID:0,hasHeader:1})}}export{R as default};
