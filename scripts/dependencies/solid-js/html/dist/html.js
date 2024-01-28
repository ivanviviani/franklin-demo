import{effect,style,insert,untrack,spread,createComponent,delegateEvents,classList,mergeProps,dynamicProperty,setAttribute,setAttributeNS,addEventListener,Aliases,getPropAlias,Properties,ChildProperties,DelegatedEvents,SVGElements,SVGNamespace}from"solid-js/web";const tagRE=/(?:<!--[\S\s]*?-->|<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>)/g,attrRE=/(?:\s(?<boolean>[^/\s><=]+?)(?=[\s/>]))|(?:(?<name>\S+?)(?:\s*=\s*(?:(['"])(?<quotedValue>[\s\S]*?)\3|(?<unquotedValue>[^\s>]+))))/g,lookup={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,menuitem:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0};function parseTag(e){const t={type:"tag",name:"",voidElement:!1,attrs:[],children:[]},r=e.match(/<\/?([^\s]+?)[/\s>]/);if(r&&(t.name=r[1],(lookup[r[1].toLowerCase()]||"/"===e.charAt(e.length-2))&&(t.voidElement=!0),t.name.startsWith("!--"))){const t=e.indexOf("--\x3e");return{type:"comment",comment:-1!==t?e.slice(4,t):""}}const n=new RegExp(attrRE);for(const r of e.matchAll(n))(r[1]||r[2]).startsWith("use:")?t.attrs.push({type:"directive",name:r[1]||r[2],value:r[4]||r[5]||""}):t.attrs.push({type:"attr",name:r[1]||r[2],value:r[4]||r[5]||""});return t}function pushTextNode(e,t,r){const n=t.indexOf("<",r),s=t.slice(r,-1===n?void 0:n);/^\s*$/.test(s)||e.push({type:"text",content:s})}function pushCommentNode(e,t){const r=t.replace("\x3c!--","").replace("--\x3e","");/^\s*$/.test(r)||e.push({type:"comment",content:r})}function parse(e){const t=[];let r,n=-1;const s=[],c={};return e.replace(tagRE,((i,a)=>{const o="/"!==i.charAt(1),p="\x3c!--"===i.slice(0,4),l=a+i.length,u=e.charAt(l);let h;o&&!p&&(n++,r=parseTag(i),!r.voidElement&&u&&"<"!==u&&pushTextNode(r.children,e,l),c[r.tagName]=r,0===n&&t.push(r),h=s[n-1],h&&h.children.push(r),s[n]=r),p&&pushCommentNode(n<0?t:s[n].children,i),(p||!o||r.voidElement)&&(p||n--,"<"!==u&&u&&(h=-1===n?t:s[n].children,pushTextNode(h,e,l)))})),t}function attrString(e){const t=[];for(const r of e)t.push(r.name+'="'+r.value.replace(/"/g,"&quot;")+'"');return t.length?" "+t.join(" "):""}function stringifier(e,t){switch(t.type){case"text":return e+t.content;case"tag":return e+="<"+t.name+(t.attrs?attrString(t.attrs):"")+(t.voidElement?"/>":">"),t.voidElement?e:e+t.children.reduce(stringifier,"")+"</"+t.name+">";case"comment":return e+"\x3c!--"+t.content+"--\x3e"}}function stringify(e){return e.reduce((function(e,t){return e+stringifier("",t)}),"")}const cache=new Map,VOID_ELEMENTS=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,spaces=" \\f\\n\\r\\t",almostEverything="[^ \\f\\n\\r\\t\\/>\"'=]+",attrName="[  \\f\\n\\r\\t]+(?:use:\x3c!--#--\x3e|[^ \\f\\n\\r\\t\\/>\"'=]+)",tagName="<([A-Za-z$#]+[A-Za-z0-9:_-]*)((?:",attrPartials="(?:\\s*=\\s*(?:'[^']*?'|\"[^\"]*?\"|\\([^)]*?\\)|<[^>]*?>|[^ \\f\\n\\r\\t\\/>\"'=]+))?)",attrSeeker=new RegExp(tagName+attrName+attrPartials+"+)([ "+spaces+"]*/?>)","g"),findAttributes=new RegExp("("+attrName+"\\s*=\\s*)(\x3c!--#--\x3e|['\"(]([\\w\\s]*\x3c!--#--\x3e[\\w\\s]*)*['\")])","gi"),selfClosing=new RegExp(tagName+attrName+attrPartials+"*)([ "+spaces+"]*/>)","g"),marker="\x3c!--#--\x3e",reservedNameSpaces=new Set(["class","on","oncapture","style","use","prop","attr"]);function attrReplacer(e,t,r,n){return"<"+t+r.replace(findAttributes,replaceAttributes)+n}function replaceAttributes(e,t,r){return t.replace(/<!--#-->/g,"###")+('"'===r[0]||"'"===r[0]?r.replace(/<!--#-->/g,"###"):'"###"')}function fullClosing(e,t,r){return VOID_ELEMENTS.test(t)?e:"<"+t+r+"></"+t+">"}function toPropertyName(e){return e.toLowerCase().replace(/-([a-z])/g,((e,t)=>t.toUpperCase()))}function parseDirective(e,t,r,n){if("use:###"!==e||"###"!==t)throw new Error(`Not support syntax ${e} must be use:{function}`);{const e=n.counter++;n.exprs.push(`typeof exprs[${e}] === "function" ? r.use(exprs[${e}], ${r}, exprs[${n.counter++}]) : (()=>{throw new Error("use:### must be a function")})()`)}}function createHTML(e,{delegateEvents:t=!0,functionBuilder:r=((...e)=>new Function(...e))}={}){let n=1;function s(r,s,c,i,a,o,p){if("on"===c.slice(0,2))if(c.includes(":")){let e=c.startsWith("oncapture:");p.exprs.push(`${s}.addEventListener("${c.slice(e?10:3)}",exprs[${p.counter++}]${e?",true":""})`)}else{const r=c.slice(2).toLowerCase(),n=t&&e.DelegatedEvents.has(r);p.exprs.push(`r.addEventListener(${s},"${r}",exprs[${p.counter++}],${n})`),n&&p.delegatedEvents.add(r)}else if("ref"===c)p.exprs.push(`exprs[${p.counter++}](${s})`);else{const t=Object.assign({},p,{exprs:[]}),l=p.counter;if(function(t,r,s,c,i,a,o){let p,l,u="###"===c?`!doNotWrap ? exprs[${o.counter}]() : exprs[${o.counter++}]`:c.split("###").map(((e,t)=>t?` + (typeof exprs[${o.counter}] === "function" ? exprs[${o.counter}]() : exprs[${o.counter++}]) + "${e}"`:`"${e}"`)).join("");(p=s.split(":"))&&p[1]&&reservedNameSpaces.has(p[0])&&(s=p[1],l=p[0]);const h=e.ChildProperties.has(s),f=e.Properties.has(s);if("style"===s){const e="_$v"+n++;o.decl.push(`${e}={}`),o.exprs.push(`r.style(${r},${u},${e})`)}else if("classList"===s){const e="_$v"+n++;o.decl.push(`${e}={}`),o.exprs.push(`r.classList(${r},${u},${e})`)}else if("attr"!==l&&(h||!i&&(e.getPropAlias(s,t.name.toUpperCase())||f)||a||"prop"===l))!a||h||f||"prop"===l||(s=toPropertyName(s)),o.exprs.push(`${r}.${e.getPropAlias(s,t.name.toUpperCase())||s} = ${u}`);else{const t=i&&s.indexOf(":")>-1&&e.SVGNamespace[s.split(":")[0]];t?o.exprs.push(`r.setAttributeNS(${r},"${t}","${s}",${u})`):o.exprs.push(`r.setAttribute(${r},"${e.Aliases[s]||s}",${u})`)}}(r,s,c,i,a,o,t),p.decl.push(`_fn${l} = (${"###"===i?"doNotWrap":""}) => {\n${t.exprs.join(";\n")};\n}`),"###"===i)p.exprs.push(`typeof exprs[${l}] === "function" ? r.effect(_fn${l}) : _fn${l}(true)`);else{let e="";for(let r=l;r<t.counter;r++)r!==l&&(e+=" || "),e+=`typeof exprs[${r}] === "function"`;p.exprs.push(e+` ? r.effect(_fn${l}) : _fn${l}()`)}p.counter=t.counter,p.wrap=!1}}function c(e){let t=[];for(const r of e)if(Array.isArray(r)){if(!r.length)continue;t.push(`r.wrapProps({${r.join(",")||""}})`)}else t.push(r);return t.length>1?`r.mergeProps(${t.join(",")})`:t[0]}function i(e,t){let r=[];const s=Object.keys(e.attrs),i=[r],o=t.counter++;for(let c=0;c<s.length;c++){const{type:s,name:a,value:o}=e.attrs[c];if("attr"===s)"###"===a?(i.push(`exprs[${t.counter++}]`),i.push(r=[])):"###"===o?r.push(`${a}: exprs[${t.counter++}]`):r.push(`${a}: "${o}"`);else if("directive"===s){const e="_$el"+n++,r=!t.decl.length;t.decl.push(r?"":`${e} = ${t.path}.${t.first?"firstChild":"nextSibling"}`),parseDirective(a,o,e,t)}}if(1===e.children.length&&"comment"===e.children[0].type&&"#"===e.children[0].content)r.push(`children: () => exprs[${t.counter++}]`);else if(e.children.length){const n={type:"fragment",children:e.children},s=Object.assign({},t,{first:!0,decl:[],exprs:[],parent:!1});a(n,s),r.push(`children: () => { ${s.exprs.join(";\n")}}`),t.templateId=s.templateId,t.counter=s.counter}let p;t.multi&&(p="_$el"+n++,t.decl.push(`${p} = ${t.path}.${t.first?"firstChild":"nextSibling"}`)),t.parent?t.exprs.push(`r.insert(${t.parent}, r.createComponent(exprs[${o}],${c(i)})${p?`, ${p}`:""})`):t.exprs.push(`${t.fragment?"":"return "}r.createComponent(exprs[${o}],${c(i)})`),t.path=p,t.first=!1}function a(t,r){if("fragment"===t.type){const e=[];t.children.forEach((t=>{if("tag"===t.type){if("###"===t.name){const n=Object.assign({},r,{first:!0,fragment:!0,decl:[],exprs:[]});return i(t,n),e.push(n.exprs[0]),r.counter=n.counter,void(r.templateId=n.templateId)}r.templateId++;const s=n,c=Object.assign({},r,{first:!0,decl:[],exprs:[]});r.templateNodes.push([t]),a(t,c),e.push(`function() { ${c.decl.join(",\n")+";\n"+c.exprs.join(";\n")+`;\nreturn _$el${s};\n`}}()`),r.counter=c.counter,r.templateId=c.templateId}else if("text"===t.type)e.push(`"${t.content}"`);else if("comment"===t.type)if("#"===t.content)e.push(`exprs[${r.counter++}]`);else if(t.content)for(let n=0;n<t.content.split("###").length-1;n++)e.push(`exprs[${r.counter++}]`)})),r.exprs.push(`return [${e.join(", \n")}]`)}else if("tag"===t.type){const c="_$el"+n++,o=!r.decl.length,p=r.templateId;r.decl.push(o?"":`${c} = ${r.path}.${r.first?"firstChild":"nextSibling"}`);const l=e.SVGElements.has(t.name),u=t.name.includes("-");if(r.hasCustomElement=u,t.attrs.some((e=>"###"===e.name))){const e=[];let n="";const s=[];for(let i=0;i<t.attrs.length;i++){const{type:a,name:o,value:p}=t.attrs[i];if("attr"===a)if(p.includes("###")){let e=r.counter++;n+=`${o}: ${"ref"!==o?`typeof exprs[${e}] === "function" ? exprs[${e}]() : `:""}exprs[${e}],`}else"###"===o?(n.length&&(e.push(`()=>({${n}})`),n=""),e.push(`exprs[${r.counter++}]`)):s.push(t.attrs[i]);else"directive"===a&&parseDirective(o,p,c,r)}t.attrs=s,n.length&&e.push(`()=>({${n}})`),r.exprs.push(`r.spread(${c},${1===e.length?`typeof ${e[0]} === "function" ? r.mergeProps(${e[0]}) : ${e[0]}`:`r.mergeProps(${e.join(",")})`},${l},${!!t.children.length})`)}else for(let e=0;e<t.attrs.length;e++){const{type:n,name:i,value:a}=t.attrs[e];"directive"===n?(parseDirective(i,a,c,r),t.attrs.splice(e,1),e--):"attr"===n&&a.includes("###")&&(t.attrs.splice(e,1),e--,s(t,c,i,a,l,u,r))}r.path=c,r.first=!1,function(e,t){const r=Object.assign({},t,{first:!0,multi:!1,parent:t.path});if(e.children.length>1)for(let t=0;t<e.children.length;t++){const n=e.children[t];if("comment"===n.type&&"#"===n.content||"tag"===n.type&&"###"===n.name){r.multi=!0;break}}let n=0;for(;n<e.children.length;){const t=e.children[n];"###"!==t.name?(a(t,r),r.multi||"comment"!==t.type||"#"!==t.content?n++:e.children.splice(n,1)):(r.multi?(e.children[n]={type:"comment",content:"#"},n++):e.children.splice(n,1),i(t,r))}t.counter=r.counter,t.templateId=r.templateId,t.hasCustomElement=t.hasCustomElement||r.hasCustomElement}(t,r),o&&(r.decl[0]=r.hasCustomElement?`const ${c} = r.untrack(() => document.importNode(tmpls[${p}].content.firstChild, true))`:`const ${c} = tmpls[${p}].content.firstChild.cloneNode(true)`)}else if("text"===t.type){const e="_$el"+n++;r.decl.push(`${e} = ${r.path}.${r.first?"firstChild":"nextSibling"}`),r.path=e,r.first=!1}else if("comment"===t.type){const e="_$el"+n++;r.decl.push(`${e} = ${r.path}.${r.first?"firstChild":"nextSibling"}`),"#"===t.content&&(r.multi?r.exprs.push(`r.insert(${r.parent}, exprs[${r.counter++}], ${e})`):r.exprs.push(`r.insert(${r.parent}, exprs[${r.counter++}])`)),r.path=e,r.first=!1}}return e.wrapProps=t=>{const r=Object.getOwnPropertyDescriptors(t);for(const n in r)"function"!=typeof r[n].value||r[n].value.length||e.dynamicProperty(t,n);return t},function(t,...s){const c=cache.get(t)||function(t,r){let s=0,c="";for(;s<t.length-1;s++)c=c+t[s]+"\x3c!--#--\x3e";c+=t[s],c=[[selfClosing,fullClosing],[/<(<!--#-->)/g,"<###"],[/\.\.\.(<!--#-->)/g,"###"],[attrSeeker,attrReplacer],[/>\n+\s*/g,">"],[/\n+\s*</g,"<"],[/\s+</g," <"],[/>\s+/g,"> "]].reduce(((e,t)=>e.replace(t[0],t[1])),c);const o=parse(c),[p,l]=function(t,r){const s={path:"",decl:[],exprs:[],delegatedEvents:new Set,counter:0,first:!0,multi:!1,templateId:0,templateNodes:[]},c=n,o=t;let p;return t.length>1&&(t=[{type:"fragment",children:t}]),"###"===t[0].name?(p=!0,i(t[0],s)):a(t[0],s),e.delegateEvents(Array.from(s.delegatedEvents)),[[o].concat(s.templateNodes).map((e=>stringify(e))),r("tmpls","exprs","r",s.decl.join(",\n")+";\n"+s.exprs.join(";\n")+(p?"":`;\nreturn _$el${c};\n`))]}(o,r.funcBuilder),u=[];for(let e=0;e<p.length;e++){u.push(document.createElement("template")),u[e].innerHTML=p[e];const t=u[e].content.querySelectorAll("script,style");for(let r=0;r<t.length;r++){const n=t[r].firstChild?.data||"";if(n.indexOf(marker)>-1){const r=n.split(marker).reduce(((e,t,r)=>(r&&e.push(""),e.push(t),e)),[]);t[e].firstChild.replaceWith(...r)}}}return u[0].create=l,cache.set(t,u),u}(t,{funcBuilder:r});return c[0].create(c,s,e)}}const html=createHTML({effect,style,insert,untrack,spread,createComponent,delegateEvents,classList,mergeProps,dynamicProperty,setAttribute,setAttributeNS,addEventListener,Aliases,getPropAlias,Properties,ChildProperties,DelegatedEvents,SVGElements,SVGNamespace});export{html as default};