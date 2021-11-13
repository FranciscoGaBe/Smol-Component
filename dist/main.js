!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.SmolComponent=t():e.SmolComponent=t()}(self,(function(){return(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{default:()=>l});const n=/{{\s*(.*?)\s*}}/gi,o=e=>[...e.matchAll(n)],r=(e,t)=>{const n={$elementData:{...t,children:(t.children||[]).map((t=>r(e,t)))},$element:null};if("textNode"===t.type)n.$element=document.createTextNode(t.content);else if(e.$components[t.type]){const o=e.$components[t.type]();n.$element={component:o,updateProp:o.$updateProp}}else n.$element=document.createElement(t.type),t.attributes.forEach((([e,t])=>{"on"===e.slice(0,2)&&void 0!==n.$element[e.toLowerCase()]||n.$element.setAttribute(e,t)}));return n.$element.getMethod=t=>()=>e[t](),n},a=(e,t,n)=>{e.$elementData.children.forEach((t=>{a(t,e.$element,n)})),e.$element.component?n(e.$element.component):t.appendChild(e.$element)},c=(e,t)=>n=>{const o=e.$state[t];e.$state[t]=n,e.$dependencies[t]&&e.$dependencies[t].forEach((t=>t(e.$state))),e.$watch[t]&&e.$watch[t](n,o)},l=e=>(t=!1)=>{const l=(e=>Object.assign({},{name:"",template:"",components:[],props:[],state:{},watch:{},methods:{},globalState:[],globalWatch:{},onMounted:()=>{}},e))(e),s={$options:l,$components:l.components,$name:l.name,$parent:null,$root:null,$element:null,$dataTree:{$element:null},$dependencies:{},$state:{},$watch:{},$global:{},$mount:()=>{},$forceUpdate:()=>{},$updateProp:()=>{}};return t&&(e=>{e.$root=e,e.$global={$state:{},$watch:{}}})(s),(e=>{return(e=>(Object.entries(e.$options.watch).forEach((([t,n])=>e.$watch[t]=n.bind(e))),e))((e=>(Object.entries(e.$options.methods).forEach((([t,n])=>e[t]=n)),e))(((t=e).$options.props.forEach((e=>{Object.defineProperty(t,e,{get:()=>t.$state[e]})})),Object.entries(t.$options.state).forEach((([e,n])=>{if(t.$options.props.includes(e))return console.error(`State ${e} has already been declared as a prop for component ${t.$name}`);t.$state[e]=n,Object.defineProperty(t,e,{set:c(t,e),get:()=>t.$state[e]})})),t)));var t})(s),s.$dataTree=r(s,(e=>{const t=(e=>[...e.matchAll(/<(.*?)>/gi)])(e),n=[];let o=null;return t.forEach(((e,t,r)=>{const a="/"===e[1][0],c=a?n.pop():(e=>{const[{1:t},...n]=(e=>[...e.matchAll(/([@A-Z0-9]+)(?:="(.*?)")?/gi)])(e);return{type:t,attributes:n.map((({1:e,2:t})=>[e,void 0===t||t])),children:[]}})(e[0]),l="/"===e[1].slice(-1)||(s=c.type,["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(s));var s;const p=n.slice(-1)[0],$=((e,t=null)=>{if(!t)return null;const n=t.index+t[0].length;if(e.index-n<2)return null;const o=e.input.slice(n,e.index);return o.trim()?(e=>({type:"textNode",content:e.replaceAll(/[\t\n]+/g," ").replaceAll(/\s+/g," ")}))(o):null})(e,r[t-1]);if($&&(l?p:c).children.push($),a&&n.length<1)return o=c;a||l?p.children.push(c):n.push(c)})),o})(l.template)),s.$dependencies=(e=>{const t={},r=(e,t)=>e.replaceAll(n,((e,n)=>t[n])),a=({$elementData:e,$element:n})=>{e.attributes&&e.attributes.forEach((([e,a])=>{o(""+a).forEach((({1:o,input:a})=>{"on"!==e.slice(0,2)||void 0===n[e.toLowerCase()]?(t.hasOwnProperty(o)||(t[o]=[]),"style"!==e?t[o].push((t=>n.updateProp?n.updateProp(e,t[o]):n.setAttribute(e,r(a,t)))):t[o].push((t=>{const r=t[o];var a;"object"!=typeof r?n.setAttribute(e,r):n.setAttribute(e,(a=r,Object.entries(a).map((([e,t])=>{return`${n=e,n.replace(/[A-Z]/g,(e=>`-${e.toLowerCase()}`))}:${t}`;var n})).join(";")))}))):n[e.toLowerCase()]=n.getMethod(o)}))})),"textNode"===e.type&&o(e.content).forEach((({1:e,input:o})=>{t.hasOwnProperty(e)||(t[e]=[]),t[e].push((e=>n.textContent=r(o,e)))})),e.children&&e.children.forEach((e=>a(e)))};return a(e),t})(s.$dataTree),s.$element=s.$dataTree.$element,s.$mount=(e=>t=>{a(e.$dataTree,t.$element||t,(t=>t.$mount(e))),t.$element&&((e,t)=>{e.$parent=t,e.$root=t.$root})(e,t),(e=>{(e=>{const t=e.$root.$global;Object.entries(e.$options.globalWatch).forEach((([n,o])=>{t.$watch[n]||(t.$watch[n]=[]),t.$watch[n].push(o.bind(e))}))})((e=>{const t=e.$root.$global;return e.$options.globalState.forEach((n=>{t.$state.hasOwnProperty(n)||(t.$state[n]=void 0,Object.defineProperty(t,n,{set:e=>{const o=t.$state[n];t.$state[n]=e,t.$watch[n]&&t.$watch[n].forEach((t=>t(e,o)))},get:()=>t.$state[n]})),Object.defineProperty(e,n,{set:e=>t[n]=e,get:()=>t[n]}),t.$watch[n]||(t.$watch[n]=[]),t.$watch[n].push((()=>{e.$dependencies[n]&&e.$dependencies[n].forEach((e=>e(t.$state)))}))})),e})(e))})(e),e.$forceUpdate(),e.$element.setAttribute("data-sc-name",e.$name),t.$element?t.$element.appendChild(e.$element):t.appendChild(e.$element),e.$options.onMounted.bind(e)()})(s),s.$forceUpdate=(e=>()=>{Object.values(e.$dependencies).forEach((t=>t.forEach((t=>t(e.$state)))))})(s),s.$updateProp=(e=>(t,n)=>{e.$options.props.includes(t)&&c(e,t)(n)})(s),s};return t})()}));