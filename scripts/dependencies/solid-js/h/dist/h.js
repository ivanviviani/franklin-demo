import{spread,assign,insert,createComponent,dynamicProperty,SVGElements}from"solid-js/web";const $ELEMENT=Symbol("hyper-element");function createHyperScript(e){function t(){let n,r=[].slice.call(arguments),o=!1;for(;Array.isArray(r[0]);)r=r[0];r[0][$ELEMENT]&&r.unshift(t.Fragment),"string"==typeof r[0]&&function e(t){for(let n=1;n<t.length;n++){if("function"==typeof t[n])return void(o=!0);Array.isArray(t[n])&&e(t[n])}}(r);const s=()=>{for(;r.length;)i(r.shift());return n};return s[$ELEMENT]=!0,s;function i(t){const s=typeof t;if(null==t);else if("string"===s)n?n.appendChild(document.createTextNode(t)):function(t){const r=t.split(/([\.#]?[^\s#.]+)/);/^\.|#/.test(r[1])&&(n=document.createElement("div"));for(let t=0;t<r.length;t++){const o=r[t],s=o.substring(1,o.length);o&&(n?"."===o[0]?n.classList.add(s):"#"===o[0]&&n.setAttribute("id",s):n=e.SVGElements.has(o)?document.createElementNS("http://www.w3.org/2000/svg",o):document.createElement(o))}}(t);else if("number"===s||"boolean"===s||t instanceof Date||t instanceof RegExp)n.appendChild(document.createTextNode(t.toString()));else if(Array.isArray(t))for(let e=0;e<t.length;e++)i(t[e]);else if(t instanceof Element)e.insert(n,t,o?null:void 0);else if("object"===s){let o=!1;const s=Object.getOwnPropertyDescriptors(t);for(const n in s)"ref"!==n&&"on"!==n.slice(0,2)&&"function"==typeof s[n].value?(e.dynamicProperty(t,n),o=!0):s[n].get&&(o=!0);o?e.spread(n,t,n instanceof SVGElement,!!r.length):e.assign(n,t,n instanceof SVGElement,!!r.length)}else if("function"===s)if(n){for(;t[$ELEMENT];)t=t();e.insert(n,t,o?null:void 0)}else{let o,s=r[0];null!=s&&("object"!=typeof s||Array.isArray(s)||s instanceof Element)||(o=r.shift()),o||(o={}),r.length&&(o.children=r.length>1?r:r[0]);const i=Object.getOwnPropertyDescriptors(o);for(const t in i)if(Array.isArray(i[t].value)){const n=i[t].value;o[t]=()=>{for(let e=0;e<n.length;e++)for(;n[e][$ELEMENT];)n[e]=n[e]();return n},e.dynamicProperty(o,t)}else"function"!=typeof i[t].value||i[t].value.length||e.dynamicProperty(o,t);n=e.createComponent(t,o),r=[]}}}return t.Fragment=e=>e.children,t}const h=createHyperScript({spread,assign,insert,createComponent,dynamicProperty,SVGElements});export{h as default};