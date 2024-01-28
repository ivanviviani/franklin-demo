// https://esm.sh/v135/@nanostores/preact@0.5.0/es2022/preact.mjs
/* esm.sh - esbuild bundle(@nanostores/preact@0.5.0) es2022 production */
import{useState as l,useEffect as m}from"/stable/preact@10.19.3/es2022/hooks.js";import{listenKeys as s}from"/v135/nanostores@0.9.5/es2022/nanostores.mjs";function g(e,t={}){let[,r]=l({}),[c]=l(e.get());return m(()=>{c!==e.get()&&r({})},[]),m(()=>{let i,f,n,u=()=>{i||(i=1,f=setTimeout(()=>{i=void 0,r({})}))};return t.keys?n=s(e,t.keys,u):n=e.listen(u),()=>{n(),clearTimeout(f)}},[e,""+t.keys]),e.get()}export{g as useStore};
