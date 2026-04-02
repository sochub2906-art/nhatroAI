const Kl=()=>{};var oo={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ia=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++i)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Yl=function(n){const e=[];let t=0,i=0;for(;t<n.length;){const s=n[t++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){const a=n[t++];e[i++]=String.fromCharCode((s&31)<<6|a&63)}else if(s>239&&s<365){const a=n[t++],l=n[t++],u=n[t++],g=((s&7)<<18|(a&63)<<12|(l&63)<<6|u&63)-65536;e[i++]=String.fromCharCode(55296+(g>>10)),e[i++]=String.fromCharCode(56320+(g&1023))}else{const a=n[t++],l=n[t++];e[i++]=String.fromCharCode((s&15)<<12|(a&63)<<6|l&63)}}return e.join("")},ya={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<n.length;s+=3){const a=n[s],l=s+1<n.length,u=l?n[s+1]:0,g=s+2<n.length,_=g?n[s+2]:0,R=a>>2,b=(a&3)<<4|u>>4;let S=(u&15)<<2|_>>6,M=_&63;g||(M=64,l||(S=64)),i.push(t[R],t[b],t[S],t[M])}return i.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Ia(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Yl(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<n.length;){const a=t[n.charAt(s++)],u=s<n.length?t[n.charAt(s)]:0;++s;const _=s<n.length?t[n.charAt(s)]:64;++s;const b=s<n.length?t[n.charAt(s)]:64;if(++s,a==null||u==null||_==null||b==null)throw new Jl;const S=a<<2|u>>4;if(i.push(S),_!==64){const M=u<<4&240|_>>2;if(i.push(M),b!==64){const U=_<<6&192|b;i.push(U)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Jl extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Xl=function(n){const e=Ia(n);return ya.encodeByteArray(e,!0)},wa=function(n){return Xl(n).replace(/\./g,"")},Ea=function(n){try{return ya.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ql(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl=()=>Ql().__FIREBASE_DEFAULTS__,eh=()=>{if(typeof process>"u"||typeof oo>"u")return;const n=oo.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},th=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ea(n[1]);return e&&JSON.parse(e)},Sr=()=>{try{return Kl()||Zl()||eh()||th()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},nh=n=>{var e,t;return(t=(e=Sr())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Ta=()=>{var n;return(n=Sr())==null?void 0:n.config},va=n=>{var e;return(e=Sr())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Aa(n){return(await fetch(n,{credentials:"include"})).ok}const sn={};function rh(){const n={prod:[],emulator:[]};for(const e of Object.keys(sn))sn[e]?n.emulator.push(e):n.prod.push(e);return n}function sh(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let ao=!1;function oh(n,e){if(typeof window>"u"||typeof document>"u"||!wn(window.location.host)||sn[n]===e||sn[n]||ao)return;sn[n]=e;function t(S){return`__firebase__banner__${S}`}const i="__firebase__banner",a=rh().prod.length>0;function l(){const S=document.getElementById(i);S&&S.remove()}function u(S){S.style.display="flex",S.style.background="#7faaf0",S.style.position="fixed",S.style.bottom="5px",S.style.left="5px",S.style.padding=".5em",S.style.borderRadius="5px",S.style.alignItems="center"}function g(S,M){S.setAttribute("width","24"),S.setAttribute("id",M),S.setAttribute("height","24"),S.setAttribute("viewBox","0 0 24 24"),S.setAttribute("fill","none"),S.style.marginLeft="-6px"}function _(){const S=document.createElement("span");return S.style.cursor="pointer",S.style.marginLeft="16px",S.style.fontSize="24px",S.innerHTML=" &times;",S.onclick=()=>{ao=!0,l()},S}function R(S,M){S.setAttribute("id",M),S.innerText="Learn more",S.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",S.setAttribute("target","__blank"),S.style.paddingLeft="5px",S.style.textDecoration="underline"}function b(){const S=sh(i),M=t("text"),U=document.getElementById(M)||document.createElement("span"),W=t("learnmore"),j=document.getElementById(W)||document.createElement("a"),oe=t("preprendIcon"),ae=document.getElementById(oe)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(S.created){const ue=S.element;u(ue),R(j,W);const Be=_();g(ae,oe),ue.append(ae,U,j,Be),document.body.appendChild(ue)}a?(U.innerText="Preview backend disconnected.",ae.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(ae.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,U.innerText="Preview backend running in this workspace."),U.setAttribute("id",M)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",b):b()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ne(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ah(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ne())}function ch(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function br(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function lh(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function hh(){const n=ne();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function si(){try{return typeof indexedDB=="object"}catch{return!1}}function oi(){return new Promise((n,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(i),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var a;e(((a=s.error)==null?void 0:a.message)||"")}}catch(t){e(t)}})}function Rr(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uh="FirebaseError";class ye extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=uh,Object.setPrototypeOf(this,ye.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,nt.prototype.create)}}class nt{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},s=`${this.service}/${e}`,a=this.errors[e],l=a?dh(a,i):"Error",u=`${this.serviceName}: ${l} (${s}).`;return new ye(s,u,i)}}function dh(n,e){return n.replace(fh,(t,i)=>{const s=e[i];return s!=null?String(s):`<${i}?>`})}const fh=/\{\$([^}]+)}/g;function ph(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function et(n,e){if(n===e)return!0;const t=Object.keys(n),i=Object.keys(e);for(const s of t){if(!i.includes(s))return!1;const a=n[s],l=e[s];if(co(a)&&co(l)){if(!et(a,l))return!1}else if(a!==l)return!1}for(const s of i)if(!t.includes(s))return!1;return!0}function co(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ot(n){const e=[];for(const[t,i]of Object.entries(n))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function tn(n){const e={};return n.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[s,a]=i.split("=");e[decodeURIComponent(s)]=decodeURIComponent(a)}}),e}function nn(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function gh(n,e){const t=new mh(n,e);return t.subscribe.bind(t)}class mh{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let s;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");_h(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:i},s.next===void 0&&(s.next=Ki),s.error===void 0&&(s.error=Ki),s.complete===void 0&&(s.complete=Ki);const a=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),a}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function _h(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Ki(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ih=1e3,yh=2,wh=14400*1e3,Eh=.5;function lo(n,e=Ih,t=yh){const i=e*Math.pow(t,n),s=Math.round(Eh*i*(Math.random()-.5)*2);return Math.min(wh,i+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P(n){return n&&n._delegate?n._delegate:n}class he{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ht="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Th{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new ih;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ah(e))try{this.getOrInitializeService({instanceIdentifier:ht})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const a=this.getOrInitializeService({instanceIdentifier:s});i.resolve(a)}catch{}}}}clearInstance(e=ht){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ht){return this.instances.has(e)}getOptions(e=ht){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[a,l]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(a);i===u&&l.resolve(s)}return s}onInit(e,t){const i=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(i)??new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const s of i)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:vh(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=ht){return this.component?this.component.multipleInstances?e:ht:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function vh(n){return n===ht?void 0:n}function Ah(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sh{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Th(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var D;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(D||(D={}));const bh={debug:D.DEBUG,verbose:D.VERBOSE,info:D.INFO,warn:D.WARN,error:D.ERROR,silent:D.SILENT},Rh=D.INFO,Ph={[D.DEBUG]:"log",[D.VERBOSE]:"log",[D.INFO]:"info",[D.WARN]:"warn",[D.ERROR]:"error"},kh=(n,e,...t)=>{if(e<n.logLevel)return;const i=new Date().toISOString(),s=Ph[e];if(s)console[s](`[${i}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ai{constructor(e){this.name=e,this._logLevel=Rh,this._logHandler=kh,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in D))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?bh[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,D.DEBUG,...e),this._logHandler(this,D.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,D.VERBOSE,...e),this._logHandler(this,D.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,D.INFO,...e),this._logHandler(this,D.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,D.WARN,...e),this._logHandler(this,D.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,D.ERROR,...e),this._logHandler(this,D.ERROR,...e)}}const Ch=(n,e)=>e.some(t=>n instanceof t);let ho,uo;function Nh(){return ho||(ho=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Oh(){return uo||(uo=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Sa=new WeakMap,gr=new WeakMap,ba=new WeakMap,Yi=new WeakMap,Pr=new WeakMap;function Dh(n){const e=new Promise((t,i)=>{const s=()=>{n.removeEventListener("success",a),n.removeEventListener("error",l)},a=()=>{t(Me(n.result)),s()},l=()=>{i(n.error),s()};n.addEventListener("success",a),n.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&Sa.set(t,n)}).catch(()=>{}),Pr.set(e,n),e}function Lh(n){if(gr.has(n))return;const e=new Promise((t,i)=>{const s=()=>{n.removeEventListener("complete",a),n.removeEventListener("error",l),n.removeEventListener("abort",l)},a=()=>{t(),s()},l=()=>{i(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",a),n.addEventListener("error",l),n.addEventListener("abort",l)});gr.set(n,e)}let mr={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return gr.get(n);if(e==="objectStoreNames")return n.objectStoreNames||ba.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Me(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Mh(n){mr=n(mr)}function Uh(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=n.call(Ji(this),e,...t);return ba.set(i,e.sort?e.sort():[e]),Me(i)}:Oh().includes(n)?function(...e){return n.apply(Ji(this),e),Me(Sa.get(this))}:function(...e){return Me(n.apply(Ji(this),e))}}function Fh(n){return typeof n=="function"?Uh(n):(n instanceof IDBTransaction&&Lh(n),Ch(n,Nh())?new Proxy(n,mr):n)}function Me(n){if(n instanceof IDBRequest)return Dh(n);if(Yi.has(n))return Yi.get(n);const e=Fh(n);return e!==n&&(Yi.set(n,e),Pr.set(e,n)),e}const Ji=n=>Pr.get(n);function ci(n,e,{blocked:t,upgrade:i,blocking:s,terminated:a}={}){const l=indexedDB.open(n,e),u=Me(l);return i&&l.addEventListener("upgradeneeded",g=>{i(Me(l.result),g.oldVersion,g.newVersion,Me(l.transaction),g)}),t&&l.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),u.then(g=>{a&&g.addEventListener("close",()=>a()),s&&g.addEventListener("versionchange",_=>s(_.oldVersion,_.newVersion,_))}).catch(()=>{}),u}function Xi(n,{blocked:e}={}){const t=indexedDB.deleteDatabase(n);return e&&t.addEventListener("blocked",i=>e(i.oldVersion,i)),Me(t).then(()=>{})}const Vh=["get","getKey","getAll","getAllKeys","count"],xh=["put","add","delete","clear"],Qi=new Map;function fo(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Qi.get(e))return Qi.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,s=xh.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(s||Vh.includes(t)))return;const a=async function(l,...u){const g=this.transaction(l,s?"readwrite":"readonly");let _=g.store;return i&&(_=_.index(u.shift())),(await Promise.all([_[t](...u),s&&g.done]))[0]};return Qi.set(e,a),a}Mh(n=>({...n,get:(e,t,i)=>fo(e,t)||n.get(e,t,i),has:(e,t)=>!!fo(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Hh(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function Hh(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const _r="@firebase/app",po="0.14.8";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fe=new ai("@firebase/app"),Bh="@firebase/app-compat",$h="@firebase/analytics-compat",Wh="@firebase/analytics",qh="@firebase/app-check-compat",zh="@firebase/app-check",Gh="@firebase/auth",Kh="@firebase/auth-compat",Yh="@firebase/database",Jh="@firebase/data-connect",Xh="@firebase/database-compat",Qh="@firebase/functions",Zh="@firebase/functions-compat",eu="@firebase/installations",tu="@firebase/installations-compat",nu="@firebase/messaging",iu="@firebase/messaging-compat",ru="@firebase/performance",su="@firebase/performance-compat",ou="@firebase/remote-config",au="@firebase/remote-config-compat",cu="@firebase/storage",lu="@firebase/storage-compat",hu="@firebase/firestore",uu="@firebase/ai",du="@firebase/firestore-compat",fu="firebase",pu="12.9.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ir="[DEFAULT]",gu={[_r]:"fire-core",[Bh]:"fire-core-compat",[Wh]:"fire-analytics",[$h]:"fire-analytics-compat",[zh]:"fire-app-check",[qh]:"fire-app-check-compat",[Gh]:"fire-auth",[Kh]:"fire-auth-compat",[Yh]:"fire-rtdb",[Jh]:"fire-data-connect",[Xh]:"fire-rtdb-compat",[Qh]:"fire-fn",[Zh]:"fire-fn-compat",[eu]:"fire-iid",[tu]:"fire-iid-compat",[nu]:"fire-fcm",[iu]:"fire-fcm-compat",[ru]:"fire-perf",[su]:"fire-perf-compat",[ou]:"fire-rc",[au]:"fire-rc-compat",[cu]:"fire-gcs",[lu]:"fire-gcs-compat",[hu]:"fire-fst",[du]:"fire-fst-compat",[uu]:"fire-vertex","fire-js":"fire-js",[fu]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gn=new Map,mu=new Map,yr=new Map;function go(n,e){try{n.container.addComponent(e)}catch(t){Fe.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function pe(n){const e=n.name;if(yr.has(e))return Fe.debug(`There were multiple attempts to register component ${e}.`),!1;yr.set(e,n);for(const t of Gn.values())go(t,n);for(const t of mu.values())go(t,n);return!0}function it(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function H(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _u={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Xe=new nt("app","Firebase",_u);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iu{constructor(e,t,i){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new he("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Xe.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt=pu;function yu(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const i={name:Ir,automaticDataCollectionEnabled:!0,...e},s=i.name;if(typeof s!="string"||!s)throw Xe.create("bad-app-name",{appName:String(s)});if(t||(t=Ta()),!t)throw Xe.create("no-options");const a=Gn.get(s);if(a){if(et(t,a.options)&&et(i,a.config))return a;throw Xe.create("duplicate-app",{appName:s})}const l=new Sh(s);for(const g of yr.values())l.addComponent(g);const u=new Iu(t,i,l);return Gn.set(s,u),u}function kr(n=Ir){const e=Gn.get(n);if(!e&&n===Ir&&Ta())return yu();if(!e)throw Xe.create("no-app",{appName:n});return e}function re(n,e,t){let i=gu[n]??n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Fe.warn(l.join(" "));return}pe(new he(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wu="firebase-heartbeat-database",Eu=1,fn="firebase-heartbeat-store";let Zi=null;function Ra(){return Zi||(Zi=ci(wu,Eu,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(fn)}catch(t){console.warn(t)}}}}).catch(n=>{throw Xe.create("idb-open",{originalErrorMessage:n.message})})),Zi}async function Tu(n){try{const t=(await Ra()).transaction(fn),i=await t.objectStore(fn).get(Pa(n));return await t.done,i}catch(e){if(e instanceof ye)Fe.warn(e.message);else{const t=Xe.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Fe.warn(t.message)}}}async function mo(n,e){try{const i=(await Ra()).transaction(fn,"readwrite");await i.objectStore(fn).put(e,Pa(n)),await i.done}catch(t){if(t instanceof ye)Fe.warn(t.message);else{const i=Xe.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Fe.warn(i.message)}}}function Pa(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vu=1024,Au=30;class Su{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Ru(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=_o();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(l=>l.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:s}),this._heartbeatsCache.heartbeats.length>Au){const l=Pu(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){Fe.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=_o(),{heartbeatsToSend:i,unsentEntries:s}=bu(this._heartbeatsCache.heartbeats),a=wa(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(t){return Fe.warn(t),""}}}function _o(){return new Date().toISOString().substring(0,10)}function bu(n,e=vu){const t=[];let i=n.slice();for(const s of n){const a=t.find(l=>l.agent===s.agent);if(a){if(a.dates.push(s.date),Io(t)>e){a.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Io(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class Ru{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return si()?oi().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Tu(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return mo(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return mo(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Io(n){return wa(JSON.stringify({version:2,heartbeats:n})).length}function Pu(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let i=1;i<n.length;i++)n[i].date<t&&(t=n[i].date,e=i);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ku(n){pe(new he("platform-logger",e=>new jh(e),"PRIVATE")),pe(new he("heartbeat",e=>new Su(e),"PRIVATE")),re(_r,po,n),re(_r,po,"esm2020"),re("fire-js","")}ku("");var Cu="firebase",Nu="12.9.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */re(Cu,Nu,"app");/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou={PHONE:"phone",TOTP:"totp"},Du={FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",PHONE:"phone",TWITTER:"twitter.com"},Lu={EMAIL_LINK:"emailLink",EMAIL_PASSWORD:"password",FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PHONE:"phone",TWITTER:"twitter.com"},Mu={LINK:"link",REAUTHENTICATE:"reauthenticate",SIGN_IN:"signIn"},Uu={EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fu(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements.","invalid-hosting-link-domain":"The provided Hosting link domain is not configured in Firebase Hosting or is not owned by the current project. This cannot be a default Hosting domain (`web.app` or `firebaseapp.com`)."}}function ka(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Vu=Fu,Ca=ka,Na=new nt("auth","Firebase",ka()),xu={ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_PASSWORD:"auth/missing-password",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type",INVALID_HOSTING_LINK_DOMAIN:"auth/invalid-hosting-link-domain"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kn=new ai("@firebase/auth");function ju(n,...e){Kn.logLevel<=D.WARN&&Kn.warn(`Auth (${Dt}): ${n}`,...e)}function Bn(n,...e){Kn.logLevel<=D.ERROR&&Kn.error(`Auth (${Dt}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function se(n,...e){throw Nr(n,...e)}function ee(n,...e){return Nr(n,...e)}function Cr(n,e,t){const i={...Ca(),[e]:t};return new nt("auth","Firebase",i).create(e,{appName:n.name})}function Y(n){return Cr(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Lt(n,e,t){const i=t;if(!(e instanceof i))throw i.name!==e.constructor.name&&se(n,"argument-error"),Cr(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Nr(n,...e){if(typeof n!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=n.name),n._errorFactory.create(t,...i)}return Na.create(n,...e)}function v(n,e,...t){if(!n)throw Nr(e,...t)}function Ae(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Bn(e),new Error(e)}function Ve(n,e){n||Ae(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pn(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function Or(){return yo()==="http:"||yo()==="https:"}function yo(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hu(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Or()||br()||"connection"in navigator)?navigator.onLine:!0}function Bu(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ve(t>e,"Short delay should be less than long delay!"),this.isMobile=ah()||lh()}get(){return Hu()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dr(n,e){Ve(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oa{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ae("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ae("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ae("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $u={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wu=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],qu=new En(3e4,6e4);function V(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function x(n,e,t,i,s={}){return Da(n,s,async()=>{let a={},l={};i&&(e==="GET"?l=i:a={body:JSON.stringify(i)});const u=Ot({key:n.config.apiKey,...l}).slice(1),g=await n._getAdditionalHeaders();g["Content-Type"]="application/json",n.languageCode&&(g["X-Firebase-Locale"]=n.languageCode);const _={method:e,headers:g,...a};return ch()||(_.referrerPolicy="no-referrer"),n.emulatorConfig&&wn(n.emulatorConfig.host)&&(_.credentials="include"),Oa.fetch()(await La(n,n.config.apiHost,t,u),_)})}async function Da(n,e,t){n._canInitEmulator=!1;const i={...$u,...e};try{const s=new Gu(n),a=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const l=await a.json();if("needConfirmation"in l)throw rn(n,"account-exists-with-different-credential",l);if(a.ok&&!("errorMessage"in l))return l;{const u=a.ok?l.errorMessage:l.error.message,[g,_]=u.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw rn(n,"credential-already-in-use",l);if(g==="EMAIL_EXISTS")throw rn(n,"email-already-in-use",l);if(g==="USER_DISABLED")throw rn(n,"user-disabled",l);const R=i[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(_)throw Cr(n,R,_);se(n,R)}}catch(s){if(s instanceof ye)throw s;se(n,"network-request-failed",{message:String(s)})}}async function je(n,e,t,i,s={}){const a=await x(n,e,t,i,s);return"mfaPendingCredential"in a&&se(n,"multi-factor-auth-required",{_serverResponse:a}),a}async function La(n,e,t,i){const s=`${e}${t}?${i}`,a=n,l=a.config.emulator?Dr(n.config,s):`${n.config.apiScheme}://${s}`;return Wu.includes(t)&&(await a._persistenceManagerAvailable,a._getPersistenceType()==="COOKIE")?a._getPersistence()._getFinalTarget(l).toString():l}function zu(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Gu{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(ee(this.auth,"network-request-failed")),qu.get())})}}function rn(n,e,t){const i={appName:n.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const s=ee(n,e,i);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(n){return n!==void 0&&n.getResponse!==void 0}function Eo(n){return n!==void 0&&n.enterprise!==void 0}class Ma{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return zu(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ku(n){return(await x(n,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function Ua(n,e){return x(n,"GET","/v2/recaptchaConfig",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yu(n,e){return x(n,"POST","/v1/accounts:delete",e)}async function Ju(n,e){return x(n,"POST","/v1/accounts:update",e)}async function Yn(n,e){return x(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function on(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xu(n,e=!1){return P(n).getIdToken(e)}async function Fa(n,e=!1){const t=P(n),i=await t.getIdToken(e),s=li(i);v(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const a=typeof s.firebase=="object"?s.firebase:void 0,l=a==null?void 0:a.sign_in_provider;return{claims:s,token:i,authTime:on(er(s.auth_time)),issuedAtTime:on(er(s.iat)),expirationTime:on(er(s.exp)),signInProvider:l||null,signInSecondFactor:(a==null?void 0:a.sign_in_second_factor)||null}}function er(n){return Number(n)*1e3}function li(n){const[e,t,i]=n.split(".");if(e===void 0||t===void 0||i===void 0)return Bn("JWT malformed, contained fewer than 3 sections"),null;try{const s=Ea(t);return s?JSON.parse(s):(Bn("Failed to decode base64 JWT payload"),null)}catch(s){return Bn("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function To(n){const e=li(n);return v(e,"internal-error"),v(typeof e.exp<"u","internal-error"),v(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xe(n,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof ye&&Qu(i)&&n.auth.currentUser===n&&await n.auth.signOut(),i}}function Qu({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zu{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const i=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wr{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=on(this.lastLoginAt),this.creationTime=on(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gn(n){var b;const e=n.auth,t=await n.getIdToken(),i=await xe(n,Yn(e,{idToken:t}));v(i==null?void 0:i.users.length,e,"internal-error");const s=i.users[0];n._notifyReloadListener(s);const a=(b=s.providerUserInfo)!=null&&b.length?xa(s.providerUserInfo):[],l=ed(n.providerData,a),u=n.isAnonymous,g=!(n.email&&s.passwordHash)&&!(l!=null&&l.length),_=u?g:!1,R={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new wr(s.createdAt,s.lastLoginAt),isAnonymous:_};Object.assign(n,R)}async function Va(n){const e=P(n);await gn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ed(n,e){return[...n.filter(i=>!e.some(s=>s.providerId===i.providerId)),...e]}function xa(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function td(n,e){const t=await Da(n,{},async()=>{const i=Ot({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:a}=n.config,l=await La(n,s,"/v1/token",`key=${a}`),u=await n._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:u,body:i};return n.emulatorConfig&&wn(n.emulatorConfig.host)&&(g.credentials="include"),Oa.fetch()(l,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function nd(n,e){return x(n,"POST","/v2/accounts:revokeToken",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){v(e.idToken,"internal-error"),v(typeof e.idToken<"u","internal-error"),v(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):To(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){v(e.length!==0,"internal-error");const t=To(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(v(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:s,expiresIn:a}=await td(e,t);this.updateTokensAndExpiration(i,s,Number(a))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:s,expirationTime:a}=t,l=new bt;return i&&(v(typeof i=="string","internal-error",{appName:e}),l.refreshToken=i),s&&(v(typeof s=="string","internal-error",{appName:e}),l.accessToken=s),a&&(v(typeof a=="number","internal-error",{appName:e}),l.expirationTime=a),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new bt,this.toJSON())}_performRefresh(){return Ae("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Je(n,e){v(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class _e{constructor({uid:e,auth:t,stsTokenManager:i,...s}){this.providerId="firebase",this.proactiveRefresh=new Zu(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new wr(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await xe(this,this.stsTokenManager.getToken(this.auth,e));return v(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Fa(this,e)}reload(){return Va(this)}_assign(e){this!==e&&(v(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new _e({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){v(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await gn(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(H(this.auth.app))return Promise.reject(Y(this.auth));const e=await this.getIdToken();return await xe(this,Yu(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const i=t.displayName??void 0,s=t.email??void 0,a=t.phoneNumber??void 0,l=t.photoURL??void 0,u=t.tenantId??void 0,g=t._redirectEventId??void 0,_=t.createdAt??void 0,R=t.lastLoginAt??void 0,{uid:b,emailVerified:S,isAnonymous:M,providerData:U,stsTokenManager:W}=t;v(b&&W,e,"internal-error");const j=bt.fromJSON(this.name,W);v(typeof b=="string",e,"internal-error"),Je(i,e.name),Je(s,e.name),v(typeof S=="boolean",e,"internal-error"),v(typeof M=="boolean",e,"internal-error"),Je(a,e.name),Je(l,e.name),Je(u,e.name),Je(g,e.name),Je(_,e.name),Je(R,e.name);const oe=new _e({uid:b,auth:e,email:s,emailVerified:S,displayName:i,isAnonymous:M,photoURL:l,phoneNumber:a,tenantId:u,stsTokenManager:j,createdAt:_,lastLoginAt:R});return U&&Array.isArray(U)&&(oe.providerData=U.map(ae=>({...ae}))),g&&(oe._redirectEventId=g),oe}static async _fromIdTokenResponse(e,t,i=!1){const s=new bt;s.updateFromServerResponse(t);const a=new _e({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:i});return await gn(a),a}static async _fromGetAccountInfoResponse(e,t,i){const s=t.users[0];v(s.localId!==void 0,"internal-error");const a=s.providerUserInfo!==void 0?xa(s.providerUserInfo):[],l=!(s.email&&s.passwordHash)&&!(a!=null&&a.length),u=new bt;u.updateFromIdToken(i);const g=new _e({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:l}),_={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new wr(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(a!=null&&a.length)};return Object.assign(g,_),g}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vo=new Map;function De(n){Ve(n instanceof Function,"Expected a class definition");let e=vo.get(n);return e?(Ve(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,vo.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ja{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}ja.type="NONE";const Er=ja;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $n(n,e,t){return`firebase:${n}:${e}:${t}`}class Rt{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:s,name:a}=this.auth;this.fullUserKey=$n(this.userKey,s.apiKey,a),this.fullPersistenceKey=$n("persistence",s.apiKey,a),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Yn(this.auth,{idToken:e}).catch(()=>{});return t?_e._fromGetAccountInfoResponse(this.auth,t,e):null}return _e._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new Rt(De(Er),e,i);const s=(await Promise.all(t.map(async _=>{if(await _._isAvailable())return _}))).filter(_=>_);let a=s[0]||De(Er);const l=$n(i,e.config.apiKey,e.name);let u=null;for(const _ of t)try{const R=await _._get(l);if(R){let b;if(typeof R=="string"){const S=await Yn(e,{idToken:R}).catch(()=>{});if(!S)break;b=await _e._fromGetAccountInfoResponse(e,S,R)}else b=_e._fromJSON(e,R);_!==a&&(u=b),a=_;break}}catch{}const g=s.filter(_=>_._shouldAllowMigration);return!a._shouldAllowMigration||!g.length?new Rt(a,e,i):(a=g[0],u&&await a._set(l,u.toJSON()),await Promise.all(t.map(async _=>{if(_!==a)try{await _._remove(l)}catch{}})),new Rt(a,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ao(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Wa(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ha(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(za(e))return"Blackberry";if(Ga(e))return"Webos";if(Ba(e))return"Safari";if((e.includes("chrome/")||$a(e))&&!e.includes("edge/"))return"Chrome";if(qa(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=n.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function Ha(n=ne()){return/firefox\//i.test(n)}function Ba(n=ne()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function $a(n=ne()){return/crios\//i.test(n)}function Wa(n=ne()){return/iemobile/i.test(n)}function qa(n=ne()){return/android/i.test(n)}function za(n=ne()){return/blackberry/i.test(n)}function Ga(n=ne()){return/webos/i.test(n)}function Lr(n=ne()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function id(n=ne()){var e;return Lr(n)&&!!((e=window.navigator)!=null&&e.standalone)}function rd(){return hh()&&document.documentMode===10}function Ka(n=ne()){return Lr(n)||qa(n)||Ga(n)||za(n)||/windows phone/i.test(n)||Wa(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya(n,e=[]){let t;switch(n){case"Browser":t=Ao(ne());break;case"Worker":t=`${Ao(ne())}-${n}`;break;default:t=n}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Dt}/${i}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=a=>new Promise((l,u)=>{try{const g=e(a);l(g)}catch(g){u(g)}});i.onAbort=t,this.queue.push(i);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function od(n,e={}){return x(n,"GET","/v2/passwordPolicy",V(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ad=6;class cd{constructor(e){var i;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??ad,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((i=e.allowedNonAlphanumericCharacters)==null?void 0:i.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let s=0;s<e.length;s++)i=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,s,a){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ld{constructor(e,t,i,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new So(this),this.idTokenSubscription=new So(this),this.beforeStateQueue=new sd(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Na,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(a=>this._resolvePersistenceManagerAvailable=a)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=De(t)),this._initializationPromise=this.queue(async()=>{var i,s,a;if(!this._deleted&&(this.persistenceManager=await Rt.create(this,e),(i=this._resolvePersistenceManagerAvailable)==null||i.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((a=this.currentUser)==null?void 0:a.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Yn(this,{idToken:e}),i=await _e._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var a;if(H(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(u,u))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let i=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(a=this.redirectUser)==null?void 0:a._redirectEventId,u=i==null?void 0:i._redirectEventId,g=await this.tryRedirectSignIn(e);(!l||l===u)&&(g!=null&&g.user)&&(i=g.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(l){i=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return v(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await gn(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Bu()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(H(this.app))return Promise.reject(Y(this));const t=e?P(e):null;return t&&v(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&v(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return H(this.app)?Promise.reject(Y(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return H(this.app)?Promise.reject(Y(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(De(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await od(this),t=new cd(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new nt("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await nd(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&De(e)||this._popupRedirectResolver;v(t,this,"argument-error"),this.redirectPersistenceManager=await Rt.create(this,[De(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)==null?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,s){if(this._deleted)return()=>{};const a=typeof t=="function"?t:t.next.bind(t);let l=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(v(u,this,"internal-error"),u.then(()=>{l||a(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,i,s);return()=>{l=!0,g()}}else{const g=e.addObserver(t);return()=>{l=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return v(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ya(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const i=await this._getAppCheckToken();return i&&(e["X-Firebase-AppCheck"]=i),e}async _getAppCheckToken(){var t;if(H(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&ju(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function B(n){return P(n)}class So{constructor(e){this.auth=e,this.observer=null,this.addObserver=gh(t=>this.observer=t)}get next(){return v(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Tn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function hd(n){Tn=n}function Mr(n){return Tn.loadJS(n)}function ud(){return Tn.recaptchaV2Script}function dd(){return Tn.recaptchaEnterpriseScript}function fd(){return Tn.gapiScript}function Ja(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pd=500,gd=6e4,Vn=1e12;class md{constructor(e){this.auth=e,this.counter=Vn,this._widgets=new Map}render(e,t){const i=this.counter;return this._widgets.set(i,new yd(e,this.auth.name,t||{})),this.counter++,i}reset(e){var i;const t=e||Vn;(i=this._widgets.get(t))==null||i.delete(),this._widgets.delete(t)}getResponse(e){var i;const t=e||Vn;return((i=this._widgets.get(t))==null?void 0:i.getResponse())||""}async execute(e){var i;const t=e||Vn;return(i=this._widgets.get(t))==null||i.execute(),""}}class _d{constructor(){this.enterprise=new Id}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Id{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class yd{constructor(e,t,i){this.params=i,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const s=typeof e=="string"?document.getElementById(e):e;v(s,"argument-error",{appName:t}),this.container=s,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=wd(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},gd)},pd))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function wd(n){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let i=0;i<n;i++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}const Ed="recaptcha-enterprise",an="NO_RECAPTCHA";class Xa{constructor(e){this.type=Ed,this.auth=B(e)}async verify(e="verify",t=!1){async function i(a){if(!t){if(a.tenantId==null&&a._agentRecaptchaConfig!=null)return a._agentRecaptchaConfig.siteKey;if(a.tenantId!=null&&a._tenantRecaptchaConfigs[a.tenantId]!==void 0)return a._tenantRecaptchaConfigs[a.tenantId].siteKey}return new Promise(async(l,u)=>{Ua(a,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{const _=new Ma(g);return a.tenantId==null?a._agentRecaptchaConfig=_:a._tenantRecaptchaConfigs[a.tenantId]=_,l(_.siteKey)}}).catch(g=>{u(g)})})}function s(a,l,u){const g=window.grecaptcha;Eo(g)?g.enterprise.ready(()=>{g.enterprise.execute(a,{action:e}).then(_=>{l(_)}).catch(()=>{l(an)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new _d().execute("siteKey",{action:"verify"}):new Promise((a,l)=>{i(this.auth).then(u=>{if(!t&&Eo(window.grecaptcha))s(u,a,l);else{if(typeof window>"u"){l(new Error("RecaptchaVerifier is only supported in browser"));return}let g=dd();g.length!==0&&(g+=u),Mr(g).then(()=>{s(u,a,l)}).catch(_=>{l(_)})}}).catch(u=>{l(u)})})}}async function en(n,e,t,i=!1,s=!1){const a=new Xa(n);let l;if(s)l=an;else try{l=await a.verify(t)}catch{l=await a.verify(t,!0)}const u={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){const g=u.phoneEnrollmentInfo.phoneNumber,_=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:_,captchaResponse:l,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){const g=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:l,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return i?Object.assign(u,{captchaResp:l}):Object.assign(u,{captchaResponse:l}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function Qe(n,e,t,i,s){var a,l;if(s==="EMAIL_PASSWORD_PROVIDER")if((a=n._getRecaptchaConfig())!=null&&a.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const u=await en(n,e,t,t==="getOobCode");return i(n,u)}else return i(n,e).catch(async u=>{if(u.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const g=await en(n,e,t,t==="getOobCode");return i(n,g)}else return Promise.reject(u)});else if(s==="PHONE_PROVIDER")if((l=n._getRecaptchaConfig())!=null&&l.isProviderEnabled("PHONE_PROVIDER")){const u=await en(n,e,t);return i(n,u).catch(async g=>{var _;if(((_=n._getRecaptchaConfig())==null?void 0:_.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(g.code==="auth/missing-recaptcha-token"||g.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);const R=await en(n,e,t,!1,!0);return i(n,R)}return Promise.reject(g)})}else{const u=await en(n,e,t,!1,!0);return i(n,u)}else return Promise.reject(s+" provider is not supported.")}async function Qa(n){const e=B(n),t=await Ua(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),i=new Ma(t);e.tenantId==null?e._agentRecaptchaConfig=i:e._tenantRecaptchaConfigs[e.tenantId]=i,i.isAnyProviderEnabled()&&new Xa(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Za(n,e){const t=it(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),a=t.getOptions();if(et(a,e??{}))return s;se(s,"already-initialized")}return t.initialize({options:e})}function Td(n,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(De);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function ec(n,e,t){const i=B(n);v(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const s=!!(t!=null&&t.disableWarnings),a=tc(e),{host:l,port:u}=vd(e),g=u===null?"":`:${u}`,_={url:`${a}//${l}${g}/`},R=Object.freeze({host:l,port:u,protocol:a.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!i._canInitEmulator){v(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),v(et(_,i.config.emulator)&&et(R,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=_,i.emulatorConfig=R,i.settings.appVerificationDisabledForTesting=!0,wn(l)?(Aa(`${a}//${l}${g}`),oh("Auth",!0)):s||Ad()}function tc(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function vd(n){const e=tc(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(i);if(s){const a=s[1];return{host:a,port:bo(i.substr(a.length+1))}}else{const[a,l]=i.split(":");return{host:a,port:bo(l)}}}function bo(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Ad(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ae("not implemented")}_getIdTokenResponse(e){return Ae("not implemented")}_linkToIdToken(e,t){return Ae("not implemented")}_getReauthenticationResolver(e){return Ae("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nc(n,e){return x(n,"POST","/v1/accounts:resetPassword",V(n,e))}async function Sd(n,e){return x(n,"POST","/v1/accounts:update",e)}async function bd(n,e){return x(n,"POST","/v1/accounts:signUp",e)}async function Rd(n,e){return x(n,"POST","/v1/accounts:update",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pd(n,e){return je(n,"POST","/v1/accounts:signInWithPassword",V(n,e))}async function hi(n,e){return x(n,"POST","/v1/accounts:sendOobCode",V(n,e))}async function kd(n,e){return hi(n,e)}async function Cd(n,e){return hi(n,e)}async function Nd(n,e){return hi(n,e)}async function Od(n,e){return hi(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dd(n,e){return je(n,"POST","/v1/accounts:signInWithEmailLink",V(n,e))}async function Ld(n,e){return je(n,"POST","/v1/accounts:signInWithEmailLink",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt extends Mt{constructor(e,t,i,s=null){super("password",i),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new Nt(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new Nt(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qe(e,t,"signInWithPassword",Pd,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Dd(e,{email:this._email,oobCode:this._password});default:se(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const i={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qe(e,i,"signUpPassword",bd,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Ld(e,{idToken:t,email:this._email,oobCode:this._password});default:se(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ue(n,e){return je(n,"POST","/v1/accounts:signInWithIdp",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Md="http://localhost";class be extends Mt{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new be(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):se("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:s,...a}=t;if(!i||!s)return null;const l=new be(i,s);return l.idToken=a.idToken||void 0,l.accessToken=a.accessToken||void 0,l.secret=a.secret,l.nonce=a.nonce,l.pendingToken=a.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return Ue(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,Ue(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ue(e,t)}buildRequest(){const e={requestUri:Md,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ot(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ro(n,e){return x(n,"POST","/v1/accounts:sendVerificationCode",V(n,e))}async function Ud(n,e){return je(n,"POST","/v1/accounts:signInWithPhoneNumber",V(n,e))}async function Fd(n,e){const t=await je(n,"POST","/v1/accounts:signInWithPhoneNumber",V(n,e));if(t.temporaryProof)throw rn(n,"account-exists-with-different-credential",t);return t}const Vd={USER_NOT_FOUND:"user-not-found"};async function xd(n,e){const t={...e,operation:"REAUTH"};return je(n,"POST","/v1/accounts:signInWithPhoneNumber",V(n,t),Vd)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze extends Mt{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new Ze({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new Ze({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return Ud(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return Fd(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return xd(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:i,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:i,code:s}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:i,phoneNumber:s,temporaryProof:a}=e;return!i&&!t&&!s&&!a?null:new Ze({verificationId:t,verificationCode:i,phoneNumber:s,temporaryProof:a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jd(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Hd(n){const e=tn(nn(n)).link,t=e?tn(nn(e)).deep_link_id:null,i=tn(nn(n)).deep_link_id;return(i?tn(nn(i)).link:null)||i||t||e||n}class Ut{constructor(e){const t=tn(nn(e)),i=t.apiKey??null,s=t.oobCode??null,a=jd(t.mode??null);v(i&&s&&a,"argument-error"),this.apiKey=i,this.operation=a,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=Hd(e);try{return new Ut(t)}catch{return null}}}function Bd(n){return Ut.parseLink(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(){this.providerId=rt.PROVIDER_ID}static credential(e,t){return Nt._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const i=Ut.parseLink(t);return v(i,"argument-error"),Nt._fromEmailAndCode(e,i.code,i.tenantId)}}rt.PROVIDER_ID="password";rt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";rt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft extends He{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class cn extends Ft{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return v("providerId"in t&&"signInMethod"in t,"argument-error"),be._fromParams(t)}credential(e){return this._credential({...e,nonce:e.rawNonce})}_credential(e){return v(e.idToken||e.accessToken,"argument-error"),be._fromParams({...e,providerId:this.providerId,signInMethod:this.providerId})}static credentialFromResult(e){return cn.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return cn.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i,oauthTokenSecret:s,pendingToken:a,nonce:l,providerId:u}=e;if(!i&&!s&&!t&&!a||!u)return null;try{return new cn(u)._credential({idToken:t,accessToken:i,nonce:l,pendingToken:a})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe extends Ft{constructor(){super("facebook.com")}static credential(e){return be._fromParams({providerId:Pe.PROVIDER_ID,signInMethod:Pe.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Pe.credentialFromTaggedObject(e)}static credentialFromError(e){return Pe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Pe.credential(e.oauthAccessToken)}catch{return null}}}Pe.FACEBOOK_SIGN_IN_METHOD="facebook.com";Pe.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke extends Ft{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return be._fromParams({providerId:ke.PROVIDER_ID,signInMethod:ke.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ke.credentialFromTaggedObject(e)}static credentialFromError(e){return ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return ke.credential(t,i)}catch{return null}}}ke.GOOGLE_SIGN_IN_METHOD="google.com";ke.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce extends Ft{constructor(){super("github.com")}static credential(e){return be._fromParams({providerId:Ce.PROVIDER_ID,signInMethod:Ce.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ce.credentialFromTaggedObject(e)}static credentialFromError(e){return Ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ce.credential(e.oauthAccessToken)}catch{return null}}}Ce.GITHUB_SIGN_IN_METHOD="github.com";Ce.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d="http://localhost";class mn extends Mt{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){const t=this.buildRequest();return Ue(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,Ue(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ue(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:s,pendingToken:a}=t;return!i||!s||!a||i!==s?null:new mn(i,a)}static _create(e,t){return new mn(e,t)}buildRequest(){return{requestUri:$d,returnSecureToken:!0,pendingToken:this.pendingToken}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wd="saml.";class Jn extends He{constructor(e){v(e.startsWith(Wd),"argument-error"),super(e)}static credentialFromResult(e){return Jn.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return Jn.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const t=mn.fromJSON(e);return v(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:t,providerId:i}=e;if(!t||!i)return null;try{return mn._create(i,t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne extends Ft{constructor(){super("twitter.com")}static credential(e,t){return be._fromParams({providerId:Ne.PROVIDER_ID,signInMethod:Ne.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ne.credentialFromTaggedObject(e)}static credentialFromError(e){return Ne.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return Ne.credential(t,i)}catch{return null}}}Ne.TWITTER_SIGN_IN_METHOD="twitter.com";Ne.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ic(n,e){return je(n,"POST","/v1/accounts:signUp",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,s=!1){const a=await _e._fromIdTokenResponse(e,i,s),l=Po(i);return new ge({user:a,providerId:l,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const s=Po(i);return new ge({user:e,providerId:s,_tokenResponse:i,operationType:t})}}function Po(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qd(n){var s;if(H(n.app))return Promise.reject(Y(n));const e=B(n);if(await e._initializationPromise,(s=e.currentUser)!=null&&s.isAnonymous)return new ge({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await ic(e,{returnSecureToken:!0}),i=await ge._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn extends ye{constructor(e,t,i,s){super(t.code,t.message),this.operationType=i,this.user=s,Object.setPrototypeOf(this,Xn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,s){return new Xn(e,t,i,s)}}function rc(n,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(a=>{throw a.code==="auth/multi-factor-auth-required"?Xn._fromErrorAndOperation(n,a,e,i):a})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sc(n){return new Set(n.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zd(n,e){const t=P(n);await ui(!0,t,e);const{providerUserInfo:i}=await Ju(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),s=sc(i||[]);return t.providerData=t.providerData.filter(a=>s.has(a.providerId)),s.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function Ur(n,e,t=!1){const i=await xe(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return ge._forOperation(n,"link",i)}async function ui(n,e,t){await gn(e);const i=sc(e.providerData),s=n===!1?"provider-already-linked":"no-such-provider";v(i.has(t)===n,e.auth,s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oc(n,e,t=!1){const{auth:i}=n;if(H(i.app))return Promise.reject(Y(i));const s="reauthenticate";try{const a=await xe(n,rc(i,s,e,n),t);v(a.idToken,i,"internal-error");const l=li(a.idToken);v(l,i,"internal-error");const{sub:u}=l;return v(n.uid===u,i,"user-mismatch"),ge._forOperation(n,s,a)}catch(a){throw(a==null?void 0:a.code)==="auth/user-not-found"&&se(i,"user-mismatch"),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ac(n,e,t=!1){if(H(n.app))return Promise.reject(Y(n));const i="signIn",s=await rc(n,i,e),a=await ge._fromIdTokenResponse(n,i,s);return t||await n._updateCurrentUser(a.user),a}async function di(n,e){return ac(B(n),e)}async function cc(n,e){const t=P(n);return await ui(!1,t,e.providerId),Ur(t,e)}async function lc(n,e){return oc(P(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gd(n,e){return je(n,"POST","/v1/accounts:signInWithCustomToken",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kd(n,e){if(H(n.app))return Promise.reject(Y(n));const t=B(n),i=await Gd(t,{token:e,returnSecureToken:!0}),s=await ge._fromIdTokenResponse(t,"signIn",i);return await t._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?Fr._fromServerResponse(e,t):"totpInfo"in t?Vr._fromServerResponse(e,t):se(e,"internal-error")}}class Fr extends vn{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new Fr(t)}}class Vr extends vn{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new Vr(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fi(n,e,t){var i;v(((i=t.url)==null?void 0:i.length)>0,n,"invalid-continue-uri"),v(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,n,"invalid-dynamic-link-domain"),v(typeof t.linkDomain>"u"||t.linkDomain.length>0,n,"invalid-hosting-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.linkDomain=t.linkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(v(t.iOS.bundleId.length>0,n,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(v(t.android.packageName.length>0,n,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xr(n){const e=B(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Yd(n,e,t){const i=B(n),s={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&fi(i,s,t),await Qe(i,s,"getOobCode",Cd,"EMAIL_PASSWORD_PROVIDER")}async function Jd(n,e,t){await nc(P(n),{oobCode:e,newPassword:t}).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&xr(n),i})}async function Xd(n,e){await Rd(P(n),{oobCode:e})}async function hc(n,e){const t=P(n),i=await nc(t,{oobCode:e}),s=i.requestType;switch(v(s,t,"internal-error"),s){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":v(i.newEmail,t,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":v(i.mfaInfo,t,"internal-error");default:v(i.email,t,"internal-error")}let a=null;return i.mfaInfo&&(a=vn._fromServerResponse(B(t),i.mfaInfo)),{data:{email:(i.requestType==="VERIFY_AND_CHANGE_EMAIL"?i.newEmail:i.email)||null,previousEmail:(i.requestType==="VERIFY_AND_CHANGE_EMAIL"?i.email:i.newEmail)||null,multiFactorInfo:a},operation:s}}async function Qd(n,e){const{data:t}=await hc(P(n),e);return t.email}async function Zd(n,e,t){if(H(n.app))return Promise.reject(Y(n));const i=B(n),l=await Qe(i,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",ic,"EMAIL_PASSWORD_PROVIDER").catch(g=>{throw g.code==="auth/password-does-not-meet-requirements"&&xr(n),g}),u=await ge._fromIdTokenResponse(i,"signIn",l);return await i._updateCurrentUser(u.user),u}function ef(n,e,t){return H(n.app)?Promise.reject(Y(n)):di(P(n),rt.credential(e,t)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&xr(n),i})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tf(n,e,t){const i=B(n),s={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function a(l,u){v(u.handleCodeInApp,i,"argument-error"),u&&fi(i,l,u)}a(s,t),await Qe(i,s,"getOobCode",Nd,"EMAIL_PASSWORD_PROVIDER")}function nf(n,e){const t=Ut.parseLink(e);return(t==null?void 0:t.operation)==="EMAIL_SIGNIN"}async function rf(n,e,t){if(H(n.app))return Promise.reject(Y(n));const i=P(n),s=rt.credentialWithLink(e,t||pn());return v(s._tenantId===(i.tenantId||null),i,"tenant-id-mismatch"),di(i,s)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sf(n,e){return x(n,"POST","/v1/accounts:createAuthUri",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function of(n,e){const t=Or()?pn():"http://localhost",i={identifier:e,continueUri:t},{signinMethods:s}=await sf(P(n),i);return s||[]}async function af(n,e){const t=P(n),s={requestType:"VERIFY_EMAIL",idToken:await n.getIdToken()};e&&fi(t.auth,s,e);const{email:a}=await kd(t.auth,s);a!==n.email&&await n.reload()}async function cf(n,e,t){const i=P(n),a={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await n.getIdToken(),newEmail:e};t&&fi(i.auth,a,t);const{email:l}=await Od(i.auth,a);l!==n.email&&await n.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lf(n,e){return x(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hf(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const i=P(n),a={idToken:await i.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},l=await xe(i,lf(i.auth,a));i.displayName=l.displayName||null,i.photoURL=l.photoUrl||null;const u=i.providerData.find(({providerId:g})=>g==="password");u&&(u.displayName=i.displayName,u.photoURL=i.photoURL),await i._updateTokensIfNecessary(l)}function uf(n,e){const t=P(n);return H(t.auth.app)?Promise.reject(Y(t.auth)):uc(t,e,null)}function df(n,e){return uc(P(n),null,e)}async function uc(n,e,t){const{auth:i}=n,a={idToken:await n.getIdToken(),returnSecureToken:!0};e&&(a.email=e),t&&(a.password=t);const l=await xe(n,Sd(i,a));await n._updateTokensIfNecessary(l,!0)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ff(n){var s,a;if(!n)return null;const{providerId:e}=n,t=n.rawUserInfo?JSON.parse(n.rawUserInfo):{},i=n.isNewUser||n.kind==="identitytoolkit#SignupNewUserResponse";if(!e&&(n!=null&&n.idToken)){const l=(a=(s=li(n.idToken))==null?void 0:s.firebase)==null?void 0:a.sign_in_provider;if(l){const u=l!=="anonymous"&&l!=="custom"?l:null;return new Pt(i,u)}}if(!e)return null;switch(e){case"facebook.com":return new pf(i,t);case"github.com":return new gf(i,t);case"google.com":return new mf(i,t);case"twitter.com":return new _f(i,t,n.screenName||null);case"custom":case"anonymous":return new Pt(i,null);default:return new Pt(i,e,t)}}class Pt{constructor(e,t,i={}){this.isNewUser=e,this.providerId=t,this.profile=i}}class dc extends Pt{constructor(e,t,i,s){super(e,t,i),this.username=s}}class pf extends Pt{constructor(e,t){super(e,"facebook.com",t)}}class gf extends dc{constructor(e,t){super(e,"github.com",t,typeof(t==null?void 0:t.login)=="string"?t==null?void 0:t.login:null)}}class mf extends Pt{constructor(e,t){super(e,"google.com",t)}}class _f extends dc{constructor(e,t,i){super(e,"twitter.com",t,i)}}function If(n){const{user:e,_tokenResponse:t}=n;return e.isAnonymous&&!t?{providerId:null,isNewUser:!1,profile:null}:ff(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yf(n,e){return P(n).setPersistence(e)}function wf(n){return Qa(n)}async function Ef(n,e){return B(n).validatePassword(e)}function fc(n,e,t,i){return P(n).onIdTokenChanged(e,t,i)}function pc(n,e,t){return P(n).beforeAuthStateChanged(e,t)}function Tf(n,e,t,i){return P(n).onAuthStateChanged(e,t,i)}function vf(n){P(n).useDeviceLanguage()}function Af(n,e){return P(n).updateCurrentUser(e)}function Sf(n){return P(n).signOut()}function bf(n,e){return B(n).revokeAccessToken(e)}async function Rf(n){return P(n).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e,t,i){this.type=e,this.credential=t,this.user=i}static _fromIdtoken(e,t){return new dt("enroll",e,t)}static _fromMfaPendingCredential(e){return new dt("signin",e)}toJSON(){return{multiFactorSession:{[this.type==="enroll"?"idToken":"pendingCredential"]:this.credential}}}static fromJSON(e){var t,i;if(e!=null&&e.multiFactorSession){if((t=e.multiFactorSession)!=null&&t.pendingCredential)return dt._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if((i=e.multiFactorSession)!=null&&i.idToken)return dt._fromIdtoken(e.multiFactorSession.idToken)}return null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr{constructor(e,t,i){this.session=e,this.hints=t,this.signInResolver=i}static _fromError(e,t){const i=B(e),s=t.customData._serverResponse,a=(s.mfaInfo||[]).map(u=>vn._fromServerResponse(i,u));v(s.mfaPendingCredential,i,"internal-error");const l=dt._fromMfaPendingCredential(s.mfaPendingCredential);return new jr(l,a,async u=>{const g=await u._process(i,l);delete s.mfaInfo,delete s.mfaPendingCredential;const _={...s,idToken:g.idToken,refreshToken:g.refreshToken};switch(t.operationType){case"signIn":const R=await ge._fromIdTokenResponse(i,t.operationType,_);return await i._updateCurrentUser(R.user),R;case"reauthenticate":return v(t.user,i,"internal-error"),ge._forOperation(t.user,t.operationType,_);default:se(i,"internal-error")}})}async resolveSignIn(e){const t=e;return this.signInResolver(t)}}function Pf(n,e){var s;const t=P(n),i=e;return v(e.customData.operationType,t,"argument-error"),v((s=i.customData._serverResponse)==null?void 0:s.mfaPendingCredential,t,"argument-error"),jr._fromError(t,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:start",V(n,e))}function kf(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:finalize",V(n,e))}function Cf(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:start",V(n,e))}function Nf(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:finalize",V(n,e))}function Of(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:withdraw",V(n,e))}class Hr{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(i=>vn._fromServerResponse(e.auth,i)))})}static _fromUser(e){return new Hr(e)}async getSession(){return dt._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){const i=e,s=await this.getSession(),a=await xe(this.user,i._process(this.user.auth,s,t));return await this.user._updateTokensIfNecessary(a),this.user.reload()}async unenroll(e){const t=typeof e=="string"?e:e.uid,i=await this.user.getIdToken();try{const s=await xe(this.user,Of(this.user.auth,{idToken:i,mfaEnrollmentId:t}));this.enrolledFactors=this.enrolledFactors.filter(({uid:a})=>a!==t),await this.user._updateTokensIfNecessary(s),await this.user.reload()}catch(s){throw s}}}const tr=new WeakMap;function Df(n){const e=P(n);return tr.has(e)||tr.set(e,Hr._fromUser(e)),tr.get(e)}const Qn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gc{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Qn,"1"),this.storage.removeItem(Qn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lf=1e3,Mf=10;class mc extends gc{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ka(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),s=this.localCache[t];i!==s&&e(t,s,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,u,g)=>{this.notifyListeners(l,g)});return}const i=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const l=this.storage.getItem(i);!t&&this.localCache[i]===l||this.notifyListeners(i,l)},a=this.storage.getItem(i);rd()&&a!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Mf):s()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const s of Array.from(i))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},Lf)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}mc.type="LOCAL";const _c=mc;/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uf=1e3;function nr(n){var i;const e=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return((i=document.cookie.match(t))==null?void 0:i[1])??null}function ir(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}class Ic{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;const t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;const t=ir(e);if(window.cookieStore){const i=await window.cookieStore.get(t);return i==null?void 0:i.value}return nr(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;const i=ir(e);document.cookie=`${i}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;const i=ir(e);if(window.cookieStore){const u=(_=>{const R=_.changed.find(S=>S.name===i);R&&t(R.value),_.deleted.find(S=>S.name===i)&&t(null)}),g=()=>window.cookieStore.removeEventListener("change",u);return this.listenerUnsubscribes.set(t,g),window.cookieStore.addEventListener("change",u)}let s=nr(i);const a=setInterval(()=>{const u=nr(i);u!==s&&(t(u),s=u)},Uf),l=()=>clearInterval(a);this.listenerUnsubscribes.set(t,l)}_removeListener(e,t){const i=this.listenerUnsubscribes.get(t);i&&(i(),this.listenerUnsubscribes.delete(t))}}Ic.type="COOKIE";const Ff=Ic;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yc extends gc{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}yc.type="SESSION";const Br=yc;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vf(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const i=new pi(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:s,data:a}=t.data,l=this.handlersMap[s];if(!(l!=null&&l.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:s});const u=Array.from(l).map(async _=>_(t.origin,a)),g=await Vf(u);t.ports[0].postMessage({status:"done",eventId:i,eventType:s,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}pi.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gi(n="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xf{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let a,l;return new Promise((u,g)=>{const _=gi("",20);s.port1.start();const R=setTimeout(()=>{g(new Error("unsupported_event"))},i);l={messageChannel:s,onMessage(b){const S=b;if(S.data.eventId===_)switch(S.data.status){case"ack":clearTimeout(R),a=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(a),u(S.data.response);break;default:clearTimeout(R),clearTimeout(a),g(new Error("invalid_response"));break}}},this.handlers.add(l),s.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:_,data:t},[s.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(){return window}function jf(n){q().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $r(){return typeof q().WorkerGlobalScope<"u"&&typeof q().importScripts=="function"}async function Hf(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Bf(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function $f(){return $r()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wc="firebaseLocalStorageDb",Wf=1,Zn="firebaseLocalStorage",Ec="fbase_key";class An{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function mi(n,e){return n.transaction([Zn],e?"readwrite":"readonly").objectStore(Zn)}function qf(){const n=indexedDB.deleteDatabase(wc);return new An(n).toPromise()}function Tr(){const n=indexedDB.open(wc,Wf);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const i=n.result;try{i.createObjectStore(Zn,{keyPath:Ec})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const i=n.result;i.objectStoreNames.contains(Zn)?e(i):(i.close(),await qf(),e(await Tr()))})})}async function Co(n,e,t){const i=mi(n,!0).put({[Ec]:e,value:t});return new An(i).toPromise()}async function zf(n,e){const t=mi(n,!1).get(e),i=await new An(t).toPromise();return i===void 0?null:i.value}function No(n,e){const t=mi(n,!0).delete(e);return new An(t).toPromise()}const Gf=800,Kf=3;class Tc{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Tr(),this.db)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>Kf)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return $r()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=pi._getInstance($f()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,i;if(this.activeServiceWorker=await Hf(),!this.activeServiceWorker)return;this.sender=new xf(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(i=e[0])!=null&&i.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Bf()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Tr();return await Co(e,Qn,"1"),await No(e,Qn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>Co(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>zf(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>No(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const a=mi(s,!1).getAll();return new An(a).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:s,value:a}of e)i.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(a)&&(this.notifyListeners(s,a),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!i.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const s of Array.from(i))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Gf)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Tc.type="LOCAL";const vc=Tc;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oo(n,e){return x(n,"POST","/v2/accounts/mfaSignIn:start",V(n,e))}function Yf(n,e){return x(n,"POST","/v2/accounts/mfaSignIn:finalize",V(n,e))}function Jf(n,e){return x(n,"POST","/v2/accounts/mfaSignIn:finalize",V(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rr=Ja("rcb"),Xf=new En(3e4,6e4);class Qf{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!((e=q().grecaptcha)!=null&&e.render)}load(e,t=""){return v(Zf(t),e,"argument-error"),this.shouldResolveImmediately(t)&&wo(q().grecaptcha)?Promise.resolve(q().grecaptcha):new Promise((i,s)=>{const a=q().setTimeout(()=>{s(ee(e,"network-request-failed"))},Xf.get());q()[rr]=()=>{q().clearTimeout(a),delete q()[rr];const u=q().grecaptcha;if(!u||!wo(u)){s(ee(e,"internal-error"));return}const g=u.render;u.render=(_,R)=>{const b=g(_,R);return this.counter++,b},this.hostLanguage=t,i(u)};const l=`${ud()}?${Ot({onload:rr,render:"explicit",hl:t})}`;Mr(l).catch(()=>{clearTimeout(a),s(ee(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!((t=q().grecaptcha)!=null&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function Zf(n){return n.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(n)}class ep{async load(e){return new md(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ln="recaptcha",tp={theme:"light",type:"image"};class np{constructor(e,t,i={...tp}){this.parameters=i,this.type=ln,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=B(e),this.isInvisible=this.parameters.size==="invisible",v(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const s=typeof t=="string"?document.getElementById(t):t;v(s,this.auth,"argument-error"),this.container=s,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new ep:new Qf,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),i=t.getResponse(e);return i||new Promise(s=>{const a=l=>{l&&(this.tokenChangeListeners.delete(a),s(l))};this.tokenChangeListeners.add(a),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){v(!this.parameters.sitekey,this.auth,"argument-error"),v(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),v(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(i=>i(t)),typeof e=="function")e(t);else if(typeof e=="string"){const i=q()[e];typeof i=="function"&&i(t)}}}assertNotDestroyed(){v(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){v(Or()&&!$r(),this.auth,"internal-error"),await ip(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await Ku(this.auth);v(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return v(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function ip(){let n=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}n=()=>e(),window.addEventListener("load",n)}).catch(e=>{throw n&&window.removeEventListener("load",n),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wr{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=Ze._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function rp(n,e,t){if(H(n.app))return Promise.reject(Y(n));const i=B(n),s=await _i(i,e,P(t));return new Wr(s,a=>di(i,a))}async function sp(n,e,t){const i=P(n);await ui(!1,i,"phone");const s=await _i(i.auth,e,P(t));return new Wr(s,a=>cc(i,a))}async function op(n,e,t){const i=P(n);if(H(i.auth.app))return Promise.reject(Y(i.auth));const s=await _i(i.auth,e,P(t));return new Wr(s,a=>lc(i,a))}async function _i(n,e,t){var i;if(!n._getRecaptchaConfig())try{await Qa(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let s;if(typeof e=="string"?s={phoneNumber:e}:s=e,"session"in s){const a=s.session;if("phoneNumber"in s){v(a.type==="enroll",n,"internal-error");const l={idToken:a.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Qe(n,l,"mfaSmsEnrollment",async(R,b)=>{if(b.phoneEnrollmentInfo.captchaResponse===an){v((t==null?void 0:t.type)===ln,R,"argument-error");const S=await sr(R,b,t);return ko(R,S)}return ko(R,b)},"PHONE_PROVIDER").catch(R=>Promise.reject(R))).phoneSessionInfo.sessionInfo}else{v(a.type==="signin",n,"internal-error");const l=((i=s.multiFactorHint)==null?void 0:i.uid)||s.multiFactorUid;v(l,n,"missing-multi-factor-info");const u={mfaPendingCredential:a.credential,mfaEnrollmentId:l,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Qe(n,u,"mfaSmsSignIn",async(b,S)=>{if(S.phoneSignInInfo.captchaResponse===an){v((t==null?void 0:t.type)===ln,b,"argument-error");const M=await sr(b,S,t);return Oo(b,M)}return Oo(b,S)},"PHONE_PROVIDER").catch(b=>Promise.reject(b))).phoneResponseInfo.sessionInfo}}else{const a={phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Qe(n,a,"sendVerificationCode",async(_,R)=>{if(R.captchaResponse===an){v((t==null?void 0:t.type)===ln,_,"argument-error");const b=await sr(_,R,t);return Ro(_,b)}return Ro(_,R)},"PHONE_PROVIDER").catch(_=>Promise.reject(_))).sessionInfo}}finally{t==null||t._reset()}}async function ap(n,e){const t=P(n);if(H(t.auth.app))return Promise.reject(Y(t.auth));await Ur(t,e)}async function sr(n,e,t){v(t.type===ln,n,"argument-error");const i=await t.verify();v(typeof i=="string",n,"argument-error");const s={...e};if("phoneEnrollmentInfo"in s){const a=s.phoneEnrollmentInfo.phoneNumber,l=s.phoneEnrollmentInfo.captchaResponse,u=s.phoneEnrollmentInfo.clientType,g=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:a,recaptchaToken:i,captchaResponse:l,clientType:u,recaptchaVersion:g}}),s}else if("phoneSignInInfo"in s){const a=s.phoneSignInInfo.captchaResponse,l=s.phoneSignInInfo.clientType,u=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:i,captchaResponse:a,clientType:l,recaptchaVersion:u}}),s}else return Object.assign(s,{recaptchaToken:i}),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.providerId=gt.PROVIDER_ID,this.auth=B(e)}verifyPhoneNumber(e,t){return _i(this.auth,e,P(t))}static credential(e,t){return Ze._fromVerification(e,t)}static credentialFromResult(e){const t=e;return gt.credentialFromTaggedObject(t)}static credentialFromError(e){return gt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:i}=e;return t&&i?Ze._fromTokenResponse(t,i):null}}gt.PROVIDER_ID="phone";gt.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Et(n,e){return e?De(e):(v(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr extends Mt{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ue(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ue(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ue(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function cp(n){return ac(n.auth,new qr(n),n.bypassAuthState)}function lp(n){const{auth:e,user:t}=n;return v(t,e,"internal-error"),oc(t,new qr(n),n.bypassAuthState)}async function hp(n){const{auth:e,user:t}=n;return v(t,e,"internal-error"),Ur(t,new qr(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ac{constructor(e,t,i,s,a=!1){this.auth=e,this.resolver=i,this.user=s,this.bypassAuthState=a,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:s,tenantId:a,error:l,type:u}=e;if(l){this.reject(l);return}const g={auth:this.auth,requestUri:t,sessionId:i,tenantId:a||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(g))}catch(_){this.reject(_)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return cp;case"linkViaPopup":case"linkViaRedirect":return hp;case"reauthViaPopup":case"reauthViaRedirect":return lp;default:se(this.auth,"internal-error")}}resolve(e){Ve(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ve(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const up=new En(2e3,1e4);async function dp(n,e,t){if(H(n.app))return Promise.reject(ee(n,"operation-not-supported-in-this-environment"));const i=B(n);Lt(n,e,He);const s=Et(i,t);return new Le(i,"signInViaPopup",e,s).executeNotNull()}async function fp(n,e,t){const i=P(n);if(H(i.auth.app))return Promise.reject(ee(i.auth,"operation-not-supported-in-this-environment"));Lt(i.auth,e,He);const s=Et(i.auth,t);return new Le(i.auth,"reauthViaPopup",e,s,i).executeNotNull()}async function pp(n,e,t){const i=P(n);Lt(i.auth,e,He);const s=Et(i.auth,t);return new Le(i.auth,"linkViaPopup",e,s,i).executeNotNull()}class Le extends Ac{constructor(e,t,i,s,a){super(e,t,s,a),this.provider=i,this.authWindow=null,this.pollId=null,Le.currentPopupAction&&Le.currentPopupAction.cancel(),Le.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return v(e,this.auth,"internal-error"),e}async onExecution(){Ve(this.filter.length===1,"Popup operations only handle one event");const e=gi();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(ee(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(ee(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Le.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if((i=(t=this.authWindow)==null?void 0:t.window)!=null&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ee(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,up.get())};e()}}Le.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gp="pendingRedirect",Wn=new Map;class mp extends Ac{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=Wn.get(this.auth._key());if(!e){try{const i=await _p(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}Wn.set(this.auth._key(),e)}return this.bypassAuthState||Wn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function _p(n,e){const t=bc(e),i=Sc(n);if(!await i._isAvailable())return!1;const s=await i._get(t)==="true";return await i._remove(t),s}async function zr(n,e){return Sc(n)._set(bc(e),"true")}function Ip(n,e){Wn.set(n._key(),e)}function Sc(n){return De(n._redirectPersistence)}function bc(n){return $n(gp,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yp(n,e,t){return wp(n,e,t)}async function wp(n,e,t){if(H(n.app))return Promise.reject(Y(n));const i=B(n);Lt(n,e,He),await i._initializationPromise;const s=Et(i,t);return await zr(s,i),s._openRedirect(i,e,"signInViaRedirect")}function Ep(n,e,t){return Tp(n,e,t)}async function Tp(n,e,t){const i=P(n);if(Lt(i.auth,e,He),H(i.auth.app))return Promise.reject(Y(i.auth));await i.auth._initializationPromise;const s=Et(i.auth,t);await zr(s,i.auth);const a=await Pc(i);return s._openRedirect(i.auth,e,"reauthViaRedirect",a)}function vp(n,e,t){return Ap(n,e,t)}async function Ap(n,e,t){const i=P(n);Lt(i.auth,e,He),await i.auth._initializationPromise;const s=Et(i.auth,t);await ui(!1,i,e.providerId),await zr(s,i.auth);const a=await Pc(i);return s._openRedirect(i.auth,e,"linkViaRedirect",a)}async function Sp(n,e){return await B(n)._initializationPromise,Rc(n,e,!1)}async function Rc(n,e,t=!1){if(H(n.app))return Promise.reject(Y(n));const i=B(n),s=Et(i,e),l=await new mp(i,s,t).execute();return l&&!t&&(delete l.user._redirectEventId,await i._persistUserIfCurrent(l.user),await i._setRedirectUser(null,e)),l}async function Pc(n){const e=gi(`${n.uid}:::`);return n._redirectEventId=e,await n.auth._setRedirectUser(n),await n.auth._persistUserIfCurrent(n),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bp=600*1e3;class Rp{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Pp(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!kc(e)){const s=((i=e.error.code)==null?void 0:i.split("auth/")[1])||"internal-error";t.onError(ee(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=bp&&this.cachedEventUids.clear(),this.cachedEventUids.has(Do(e))}saveEventToCache(e){this.cachedEventUids.add(Do(e)),this.lastProcessedEventTime=Date.now()}}function Do(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function kc({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Pp(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return kc(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kp(n,e={}){return x(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cp=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Np=/^https?/;async function Op(n){if(n.config.emulator)return;const{authorizedDomains:e}=await kp(n);for(const t of e)try{if(Dp(t))return}catch{}se(n,"unauthorized-domain")}function Dp(n){const e=pn(),{protocol:t,hostname:i}=new URL(e);if(n.startsWith("chrome-extension://")){const l=new URL(n);return l.hostname===""&&i===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===i}if(!Np.test(t))return!1;if(Cp.test(n))return i===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(i)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lp=new En(3e4,6e4);function Lo(){const n=q().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Mp(n){return new Promise((e,t)=>{var s,a,l;function i(){Lo(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Lo(),t(ee(n,"network-request-failed"))},timeout:Lp.get()})}if((a=(s=q().gapi)==null?void 0:s.iframes)!=null&&a.Iframe)e(gapi.iframes.getContext());else if((l=q().gapi)!=null&&l.load)i();else{const u=Ja("iframefcb");return q()[u]=()=>{gapi.load?i():t(ee(n,"network-request-failed"))},Mr(`${fd()}?onload=${u}`).catch(g=>t(g))}}).catch(e=>{throw qn=null,e})}let qn=null;function Up(n){return qn=qn||Mp(n),qn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fp=new En(5e3,15e3),Vp="__/auth/iframe",xp="emulator/auth/iframe",jp={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Hp=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Bp(n){const e=n.config;v(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Dr(e,xp):`https://${n.config.authDomain}/${Vp}`,i={apiKey:e.apiKey,appName:n.name,v:Dt},s=Hp.get(n.config.apiHost);s&&(i.eid=s);const a=n._getFrameworks();return a.length&&(i.fw=a.join(",")),`${t}?${Ot(i).slice(1)}`}async function $p(n){const e=await Up(n),t=q().gapi;return v(t,n,"internal-error"),e.open({where:document.body,url:Bp(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:jp,dontclear:!0},i=>new Promise(async(s,a)=>{await i.restyle({setHideOnLeave:!1});const l=ee(n,"network-request-failed"),u=q().setTimeout(()=>{a(l)},Fp.get());function g(){q().clearTimeout(u),s(i)}i.ping(g).then(g,()=>{a(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wp={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},qp=500,zp=600,Gp="_blank",Kp="http://localhost";class Mo{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Yp(n,e,t,i=qp,s=zp){const a=Math.max((window.screen.availHeight-s)/2,0).toString(),l=Math.max((window.screen.availWidth-i)/2,0).toString();let u="";const g={...Wp,width:i.toString(),height:s.toString(),top:a,left:l},_=ne().toLowerCase();t&&(u=$a(_)?Gp:t),Ha(_)&&(e=e||Kp,g.scrollbars="yes");const R=Object.entries(g).reduce((S,[M,U])=>`${S}${M}=${U},`,"");if(id(_)&&u!=="_self")return Jp(e||"",u),new Mo(null);const b=window.open(e||"",u,R);v(b,n,"popup-blocked");try{b.focus()}catch{}return new Mo(b)}function Jp(n,e){const t=document.createElement("a");t.href=n,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xp="__/auth/handler",Qp="emulator/auth/handler",Zp=encodeURIComponent("fac");async function Uo(n,e,t,i,s,a){v(n.config.authDomain,n,"auth-domain-config-required"),v(n.config.apiKey,n,"invalid-api-key");const l={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:i,v:Dt,eventId:s};if(e instanceof He){e.setDefaultLanguage(n.languageCode),l.providerId=e.providerId||"",ph(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[R,b]of Object.entries({}))l[R]=b}if(e instanceof Ft){const R=e.getScopes().filter(b=>b!=="");R.length>0&&(l.scopes=R.join(","))}n.tenantId&&(l.tid=n.tenantId);const u=l;for(const R of Object.keys(u))u[R]===void 0&&delete u[R];const g=await n._getAppCheckToken(),_=g?`#${Zp}=${encodeURIComponent(g)}`:"";return`${eg(n)}?${Ot(u).slice(1)}${_}`}function eg({config:n}){return n.emulator?Dr(n,Qp):`https://${n.authDomain}/${Xp}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const or="webStorageSupport";class tg{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Br,this._completeRedirectFn=Rc,this._overrideRedirectResult=Ip}async _openPopup(e,t,i,s){var l;Ve((l=this.eventManagers[e._key()])==null?void 0:l.manager,"_initialize() not called before _openPopup()");const a=await Uo(e,t,i,pn(),s);return Yp(e,a,gi())}async _openRedirect(e,t,i,s){await this._originValidation(e);const a=await Uo(e,t,i,pn(),s);return jf(a),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:a}=this.eventManagers[t];return s?Promise.resolve(s):(Ve(a,"If manager is not set, promise should be"),a)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await $p(e),i=new Rp(e);return t.register("authEvent",s=>(v(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:i.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(or,{type:or},s=>{var l;const a=(l=s==null?void 0:s[0])==null?void 0:l[or];a!==void 0&&t(!!a),se(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Op(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Ka()||Ba()||Lr()}}const Cc=tg;class Nc{constructor(e){this.factorId=e}_process(e,t,i){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,i);case"signin":return this._finalizeSignIn(e,t.credential);default:return Ae("unexpected MultiFactorSessionType")}}}class Gr extends Nc{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new Gr(e)}_finalizeEnroll(e,t,i){return kf(e,{idToken:t,displayName:i,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return Yf(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class Oc{constructor(){}static assertion(e){return Gr._fromCredential(e)}}Oc.FACTOR_ID="phone";class Dc{static assertionForEnrollment(e,t){return _n._fromSecret(e,t)}static assertionForSignIn(e,t){return _n._fromEnrollmentId(e,t)}static async generateSecret(e){var s;const t=e;v(typeof((s=t.user)==null?void 0:s.auth)<"u","internal-error");const i=await Cf(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return Ii._fromStartTotpMfaEnrollmentResponse(i,t.user.auth)}}Dc.FACTOR_ID="totp";class _n extends Nc{constructor(e,t,i){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=i}static _fromSecret(e,t){return new _n(t,void 0,e)}static _fromEnrollmentId(e,t){return new _n(t,e)}async _finalizeEnroll(e,t,i){return v(typeof this.secret<"u",e,"argument-error"),Nf(e,{idToken:t,displayName:i,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){v(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");const i={verificationCode:this.otp};return Jf(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:i})}}class Ii{constructor(e,t,i,s,a,l,u){this.sessionInfo=l,this.auth=u,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=i,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=a}static _fromStartTotpMfaEnrollmentResponse(e,t){return new Ii(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var s;let i=!1;return(xn(e)||xn(t))&&(i=!0),i&&(xn(e)&&(e=((s=this.auth.currentUser)==null?void 0:s.email)||"unknownuser"),xn(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function xn(n){return typeof n>"u"||(n==null?void 0:n.length)===0}var Fo="@firebase/auth",Vo="1.12.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){v(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ig(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function rg(n){pe(new he("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),a=e.getProvider("app-check-internal"),{apiKey:l,authDomain:u}=i.options;v(l&&!l.includes(":"),"invalid-api-key",{appName:i.name});const g={apiKey:l,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ya(n)},_=new ld(i,s,a,g);return Td(_,t),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),pe(new he("auth-internal",e=>{const t=B(e.getProvider("auth").getImmediate());return(i=>new ng(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),re(Fo,Vo,ig(n)),re(Fo,Vo,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sg=300,og=va("authIdTokenMaxAge")||sg;let xo=null;const ag=n=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>og)return;const s=t==null?void 0:t.token;xo!==s&&(xo=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function cg(n=kr()){const e=it(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Za(n,{popupRedirectResolver:Cc,persistence:[vc,_c,Br]}),i=va("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const a=new URL(i,location.origin);if(location.origin===a.origin){const l=ag(a.toString());pc(t,l,()=>l(t.currentUser)),fc(t,u=>l(u))}}const s=nh("auth");return s&&ec(t,`http://${s}`),t}function lg(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}hd({loadJS(n){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",n),i.onload=e,i.onerror=s=>{const a=ee("internal-error");a.customData=s,t(a)},i.type="text/javascript",i.charset="UTF-8",lg().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});rg("Browser");const G_=Object.freeze(Object.defineProperty({__proto__:null,ActionCodeOperation:Uu,ActionCodeURL:Ut,AuthCredential:Mt,AuthErrorCodes:xu,EmailAuthCredential:Nt,EmailAuthProvider:rt,FacebookAuthProvider:Pe,FactorId:Ou,GithubAuthProvider:Ce,GoogleAuthProvider:ke,OAuthCredential:be,OAuthProvider:cn,OperationType:Mu,PhoneAuthCredential:Ze,PhoneAuthProvider:gt,PhoneMultiFactorGenerator:Oc,ProviderId:Du,RecaptchaVerifier:np,SAMLAuthProvider:Jn,SignInMethod:Lu,TotpMultiFactorGenerator:Dc,TotpSecret:Ii,TwitterAuthProvider:Ne,applyActionCode:Xd,beforeAuthStateChanged:pc,browserCookiePersistence:Ff,browserLocalPersistence:_c,browserPopupRedirectResolver:Cc,browserSessionPersistence:Br,checkActionCode:hc,confirmPasswordReset:Jd,connectAuthEmulator:ec,createUserWithEmailAndPassword:Zd,debugErrorMap:Vu,deleteUser:Rf,fetchSignInMethodsForEmail:of,getAdditionalUserInfo:If,getAuth:cg,getIdToken:Xu,getIdTokenResult:Fa,getMultiFactorResolver:Pf,getRedirectResult:Sp,inMemoryPersistence:Er,indexedDBLocalPersistence:vc,initializeAuth:Za,initializeRecaptchaConfig:wf,isSignInWithEmailLink:nf,linkWithCredential:cc,linkWithPhoneNumber:sp,linkWithPopup:pp,linkWithRedirect:vp,multiFactor:Df,onAuthStateChanged:Tf,onIdTokenChanged:fc,parseActionCodeURL:Bd,prodErrorMap:Ca,reauthenticateWithCredential:lc,reauthenticateWithPhoneNumber:op,reauthenticateWithPopup:fp,reauthenticateWithRedirect:Ep,reload:Va,revokeAccessToken:bf,sendEmailVerification:af,sendPasswordResetEmail:Yd,sendSignInLinkToEmail:tf,setPersistence:yf,signInAnonymously:qd,signInWithCredential:di,signInWithCustomToken:Kd,signInWithEmailAndPassword:ef,signInWithEmailLink:rf,signInWithPhoneNumber:rp,signInWithPopup:dp,signInWithRedirect:yp,signOut:Sf,unlink:zd,updateCurrentUser:Af,updateEmail:uf,updatePassword:df,updatePhoneNumber:ap,updateProfile:hf,useDeviceLanguage:vf,validatePassword:Ef,verifyBeforeUpdateEmail:cf,verifyPasswordResetCode:Qd},Symbol.toStringTag,{value:"Module"}));var jo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Kr;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,d){function p(){}p.prototype=d.prototype,I.F=d.prototype,I.prototype=new p,I.prototype.constructor=I,I.D=function(y,m,E){for(var f=Array(arguments.length-2),ie=2;ie<arguments.length;ie++)f[ie-2]=arguments[ie];return d.prototype[m].apply(y,f)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(i,t),i.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,d,p){p||(p=0);const y=Array(16);if(typeof d=="string")for(var m=0;m<16;++m)y[m]=d.charCodeAt(p++)|d.charCodeAt(p++)<<8|d.charCodeAt(p++)<<16|d.charCodeAt(p++)<<24;else for(m=0;m<16;++m)y[m]=d[p++]|d[p++]<<8|d[p++]<<16|d[p++]<<24;d=I.g[0],p=I.g[1],m=I.g[2];let E=I.g[3],f;f=d+(E^p&(m^E))+y[0]+3614090360&4294967295,d=p+(f<<7&4294967295|f>>>25),f=E+(m^d&(p^m))+y[1]+3905402710&4294967295,E=d+(f<<12&4294967295|f>>>20),f=m+(p^E&(d^p))+y[2]+606105819&4294967295,m=E+(f<<17&4294967295|f>>>15),f=p+(d^m&(E^d))+y[3]+3250441966&4294967295,p=m+(f<<22&4294967295|f>>>10),f=d+(E^p&(m^E))+y[4]+4118548399&4294967295,d=p+(f<<7&4294967295|f>>>25),f=E+(m^d&(p^m))+y[5]+1200080426&4294967295,E=d+(f<<12&4294967295|f>>>20),f=m+(p^E&(d^p))+y[6]+2821735955&4294967295,m=E+(f<<17&4294967295|f>>>15),f=p+(d^m&(E^d))+y[7]+4249261313&4294967295,p=m+(f<<22&4294967295|f>>>10),f=d+(E^p&(m^E))+y[8]+1770035416&4294967295,d=p+(f<<7&4294967295|f>>>25),f=E+(m^d&(p^m))+y[9]+2336552879&4294967295,E=d+(f<<12&4294967295|f>>>20),f=m+(p^E&(d^p))+y[10]+4294925233&4294967295,m=E+(f<<17&4294967295|f>>>15),f=p+(d^m&(E^d))+y[11]+2304563134&4294967295,p=m+(f<<22&4294967295|f>>>10),f=d+(E^p&(m^E))+y[12]+1804603682&4294967295,d=p+(f<<7&4294967295|f>>>25),f=E+(m^d&(p^m))+y[13]+4254626195&4294967295,E=d+(f<<12&4294967295|f>>>20),f=m+(p^E&(d^p))+y[14]+2792965006&4294967295,m=E+(f<<17&4294967295|f>>>15),f=p+(d^m&(E^d))+y[15]+1236535329&4294967295,p=m+(f<<22&4294967295|f>>>10),f=d+(m^E&(p^m))+y[1]+4129170786&4294967295,d=p+(f<<5&4294967295|f>>>27),f=E+(p^m&(d^p))+y[6]+3225465664&4294967295,E=d+(f<<9&4294967295|f>>>23),f=m+(d^p&(E^d))+y[11]+643717713&4294967295,m=E+(f<<14&4294967295|f>>>18),f=p+(E^d&(m^E))+y[0]+3921069994&4294967295,p=m+(f<<20&4294967295|f>>>12),f=d+(m^E&(p^m))+y[5]+3593408605&4294967295,d=p+(f<<5&4294967295|f>>>27),f=E+(p^m&(d^p))+y[10]+38016083&4294967295,E=d+(f<<9&4294967295|f>>>23),f=m+(d^p&(E^d))+y[15]+3634488961&4294967295,m=E+(f<<14&4294967295|f>>>18),f=p+(E^d&(m^E))+y[4]+3889429448&4294967295,p=m+(f<<20&4294967295|f>>>12),f=d+(m^E&(p^m))+y[9]+568446438&4294967295,d=p+(f<<5&4294967295|f>>>27),f=E+(p^m&(d^p))+y[14]+3275163606&4294967295,E=d+(f<<9&4294967295|f>>>23),f=m+(d^p&(E^d))+y[3]+4107603335&4294967295,m=E+(f<<14&4294967295|f>>>18),f=p+(E^d&(m^E))+y[8]+1163531501&4294967295,p=m+(f<<20&4294967295|f>>>12),f=d+(m^E&(p^m))+y[13]+2850285829&4294967295,d=p+(f<<5&4294967295|f>>>27),f=E+(p^m&(d^p))+y[2]+4243563512&4294967295,E=d+(f<<9&4294967295|f>>>23),f=m+(d^p&(E^d))+y[7]+1735328473&4294967295,m=E+(f<<14&4294967295|f>>>18),f=p+(E^d&(m^E))+y[12]+2368359562&4294967295,p=m+(f<<20&4294967295|f>>>12),f=d+(p^m^E)+y[5]+4294588738&4294967295,d=p+(f<<4&4294967295|f>>>28),f=E+(d^p^m)+y[8]+2272392833&4294967295,E=d+(f<<11&4294967295|f>>>21),f=m+(E^d^p)+y[11]+1839030562&4294967295,m=E+(f<<16&4294967295|f>>>16),f=p+(m^E^d)+y[14]+4259657740&4294967295,p=m+(f<<23&4294967295|f>>>9),f=d+(p^m^E)+y[1]+2763975236&4294967295,d=p+(f<<4&4294967295|f>>>28),f=E+(d^p^m)+y[4]+1272893353&4294967295,E=d+(f<<11&4294967295|f>>>21),f=m+(E^d^p)+y[7]+4139469664&4294967295,m=E+(f<<16&4294967295|f>>>16),f=p+(m^E^d)+y[10]+3200236656&4294967295,p=m+(f<<23&4294967295|f>>>9),f=d+(p^m^E)+y[13]+681279174&4294967295,d=p+(f<<4&4294967295|f>>>28),f=E+(d^p^m)+y[0]+3936430074&4294967295,E=d+(f<<11&4294967295|f>>>21),f=m+(E^d^p)+y[3]+3572445317&4294967295,m=E+(f<<16&4294967295|f>>>16),f=p+(m^E^d)+y[6]+76029189&4294967295,p=m+(f<<23&4294967295|f>>>9),f=d+(p^m^E)+y[9]+3654602809&4294967295,d=p+(f<<4&4294967295|f>>>28),f=E+(d^p^m)+y[12]+3873151461&4294967295,E=d+(f<<11&4294967295|f>>>21),f=m+(E^d^p)+y[15]+530742520&4294967295,m=E+(f<<16&4294967295|f>>>16),f=p+(m^E^d)+y[2]+3299628645&4294967295,p=m+(f<<23&4294967295|f>>>9),f=d+(m^(p|~E))+y[0]+4096336452&4294967295,d=p+(f<<6&4294967295|f>>>26),f=E+(p^(d|~m))+y[7]+1126891415&4294967295,E=d+(f<<10&4294967295|f>>>22),f=m+(d^(E|~p))+y[14]+2878612391&4294967295,m=E+(f<<15&4294967295|f>>>17),f=p+(E^(m|~d))+y[5]+4237533241&4294967295,p=m+(f<<21&4294967295|f>>>11),f=d+(m^(p|~E))+y[12]+1700485571&4294967295,d=p+(f<<6&4294967295|f>>>26),f=E+(p^(d|~m))+y[3]+2399980690&4294967295,E=d+(f<<10&4294967295|f>>>22),f=m+(d^(E|~p))+y[10]+4293915773&4294967295,m=E+(f<<15&4294967295|f>>>17),f=p+(E^(m|~d))+y[1]+2240044497&4294967295,p=m+(f<<21&4294967295|f>>>11),f=d+(m^(p|~E))+y[8]+1873313359&4294967295,d=p+(f<<6&4294967295|f>>>26),f=E+(p^(d|~m))+y[15]+4264355552&4294967295,E=d+(f<<10&4294967295|f>>>22),f=m+(d^(E|~p))+y[6]+2734768916&4294967295,m=E+(f<<15&4294967295|f>>>17),f=p+(E^(m|~d))+y[13]+1309151649&4294967295,p=m+(f<<21&4294967295|f>>>11),f=d+(m^(p|~E))+y[4]+4149444226&4294967295,d=p+(f<<6&4294967295|f>>>26),f=E+(p^(d|~m))+y[11]+3174756917&4294967295,E=d+(f<<10&4294967295|f>>>22),f=m+(d^(E|~p))+y[2]+718787259&4294967295,m=E+(f<<15&4294967295|f>>>17),f=p+(E^(m|~d))+y[9]+3951481745&4294967295,I.g[0]=I.g[0]+d&4294967295,I.g[1]=I.g[1]+(m+(f<<21&4294967295|f>>>11))&4294967295,I.g[2]=I.g[2]+m&4294967295,I.g[3]=I.g[3]+E&4294967295}i.prototype.v=function(I,d){d===void 0&&(d=I.length);const p=d-this.blockSize,y=this.C;let m=this.h,E=0;for(;E<d;){if(m==0)for(;E<=p;)s(this,I,E),E+=this.blockSize;if(typeof I=="string"){for(;E<d;)if(y[m++]=I.charCodeAt(E++),m==this.blockSize){s(this,y),m=0;break}}else for(;E<d;)if(y[m++]=I[E++],m==this.blockSize){s(this,y),m=0;break}}this.h=m,this.o+=d},i.prototype.A=function(){var I=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);I[0]=128;for(var d=1;d<I.length-8;++d)I[d]=0;d=this.o*8;for(var p=I.length-8;p<I.length;++p)I[p]=d&255,d/=256;for(this.v(I),I=Array(16),d=0,p=0;p<4;++p)for(let y=0;y<32;y+=8)I[d++]=this.g[p]>>>y&255;return I};function a(I,d){var p=u;return Object.prototype.hasOwnProperty.call(p,I)?p[I]:p[I]=d(I)}function l(I,d){this.h=d;const p=[];let y=!0;for(let m=I.length-1;m>=0;m--){const E=I[m]|0;y&&E==d||(p[m]=E,y=!1)}this.g=p}var u={};function g(I){return-128<=I&&I<128?a(I,function(d){return new l([d|0],d<0?-1:0)}):new l([I|0],I<0?-1:0)}function _(I){if(isNaN(I)||!isFinite(I))return b;if(I<0)return j(_(-I));const d=[];let p=1;for(let y=0;I>=p;y++)d[y]=I/p|0,p*=4294967296;return new l(d,0)}function R(I,d){if(I.length==0)throw Error("number format error: empty string");if(d=d||10,d<2||36<d)throw Error("radix out of range: "+d);if(I.charAt(0)=="-")return j(R(I.substring(1),d));if(I.indexOf("-")>=0)throw Error('number format error: interior "-" character');const p=_(Math.pow(d,8));let y=b;for(let E=0;E<I.length;E+=8){var m=Math.min(8,I.length-E);const f=parseInt(I.substring(E,E+m),d);m<8?(m=_(Math.pow(d,m)),y=y.j(m).add(_(f))):(y=y.j(p),y=y.add(_(f)))}return y}var b=g(0),S=g(1),M=g(16777216);n=l.prototype,n.m=function(){if(W(this))return-j(this).m();let I=0,d=1;for(let p=0;p<this.g.length;p++){const y=this.i(p);I+=(y>=0?y:4294967296+y)*d,d*=4294967296}return I},n.toString=function(I){if(I=I||10,I<2||36<I)throw Error("radix out of range: "+I);if(U(this))return"0";if(W(this))return"-"+j(this).toString(I);const d=_(Math.pow(I,6));var p=this;let y="";for(;;){const m=Be(p,d).g;p=oe(p,m.j(d));let E=((p.g.length>0?p.g[0]:p.h)>>>0).toString(I);if(p=m,U(p))return E+y;for(;E.length<6;)E="0"+E;y=E+y}},n.i=function(I){return I<0?0:I<this.g.length?this.g[I]:this.h};function U(I){if(I.h!=0)return!1;for(let d=0;d<I.g.length;d++)if(I.g[d]!=0)return!1;return!0}function W(I){return I.h==-1}n.l=function(I){return I=oe(this,I),W(I)?-1:U(I)?0:1};function j(I){const d=I.g.length,p=[];for(let y=0;y<d;y++)p[y]=~I.g[y];return new l(p,~I.h).add(S)}n.abs=function(){return W(this)?j(this):this},n.add=function(I){const d=Math.max(this.g.length,I.g.length),p=[];let y=0;for(let m=0;m<=d;m++){let E=y+(this.i(m)&65535)+(I.i(m)&65535),f=(E>>>16)+(this.i(m)>>>16)+(I.i(m)>>>16);y=f>>>16,E&=65535,f&=65535,p[m]=f<<16|E}return new l(p,p[p.length-1]&-2147483648?-1:0)};function oe(I,d){return I.add(j(d))}n.j=function(I){if(U(this)||U(I))return b;if(W(this))return W(I)?j(this).j(j(I)):j(j(this).j(I));if(W(I))return j(this.j(j(I)));if(this.l(M)<0&&I.l(M)<0)return _(this.m()*I.m());const d=this.g.length+I.g.length,p=[];for(var y=0;y<2*d;y++)p[y]=0;for(y=0;y<this.g.length;y++)for(let m=0;m<I.g.length;m++){const E=this.i(y)>>>16,f=this.i(y)&65535,ie=I.i(m)>>>16,st=I.i(m)&65535;p[2*y+2*m]+=f*st,ae(p,2*y+2*m),p[2*y+2*m+1]+=E*st,ae(p,2*y+2*m+1),p[2*y+2*m+1]+=f*ie,ae(p,2*y+2*m+1),p[2*y+2*m+2]+=E*ie,ae(p,2*y+2*m+2)}for(I=0;I<d;I++)p[I]=p[2*I+1]<<16|p[2*I];for(I=d;I<2*d;I++)p[I]=0;return new l(p,0)};function ae(I,d){for(;(I[d]&65535)!=I[d];)I[d+1]+=I[d]>>>16,I[d]&=65535,d++}function ue(I,d){this.g=I,this.h=d}function Be(I,d){if(U(d))throw Error("division by zero");if(U(I))return new ue(b,b);if(W(I))return d=Be(j(I),d),new ue(j(d.g),j(d.h));if(W(d))return d=Be(I,j(d)),new ue(j(d.g),d.h);if(I.g.length>30){if(W(I)||W(d))throw Error("slowDivide_ only works with positive integers.");for(var p=S,y=d;y.l(I)<=0;)p=$e(p),y=$e(y);var m=de(p,1),E=de(y,1);for(y=de(y,2),p=de(p,2);!U(y);){var f=E.add(y);f.l(I)<=0&&(m=m.add(p),E=f),y=de(y,1),p=de(p,1)}return d=oe(I,m.j(d)),new ue(m,d)}for(m=b;I.l(d)>=0;){for(p=Math.max(1,Math.floor(I.m()/d.m())),y=Math.ceil(Math.log(p)/Math.LN2),y=y<=48?1:Math.pow(2,y-48),E=_(p),f=E.j(d);W(f)||f.l(I)>0;)p-=y,E=_(p),f=E.j(d);U(E)&&(E=S),m=m.add(E),I=oe(I,f)}return new ue(m,I)}n.B=function(I){return Be(this,I).h},n.and=function(I){const d=Math.max(this.g.length,I.g.length),p=[];for(let y=0;y<d;y++)p[y]=this.i(y)&I.i(y);return new l(p,this.h&I.h)},n.or=function(I){const d=Math.max(this.g.length,I.g.length),p=[];for(let y=0;y<d;y++)p[y]=this.i(y)|I.i(y);return new l(p,this.h|I.h)},n.xor=function(I){const d=Math.max(this.g.length,I.g.length),p=[];for(let y=0;y<d;y++)p[y]=this.i(y)^I.i(y);return new l(p,this.h^I.h)};function $e(I){const d=I.g.length+1,p=[];for(let y=0;y<d;y++)p[y]=I.i(y)<<1|I.i(y-1)>>>31;return new l(p,I.h)}function de(I,d){const p=d>>5;d%=32;const y=I.g.length-p,m=[];for(let E=0;E<y;E++)m[E]=d>0?I.i(E+p)>>>d|I.i(E+p+1)<<32-d:I.i(E+p);return new l(m,I.h)}i.prototype.digest=i.prototype.A,i.prototype.reset=i.prototype.u,i.prototype.update=i.prototype.v,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.B,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=_,l.fromString=R,Kr=l}).apply(typeof jo<"u"?jo:typeof self<"u"?self:typeof window<"u"?window:{});var jn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var n,e=Object.defineProperty;function t(r){r=[typeof globalThis=="object"&&globalThis,r,typeof window=="object"&&window,typeof self=="object"&&self,typeof jn=="object"&&jn];for(var o=0;o<r.length;++o){var c=r[o];if(c&&c.Math==Math)return c}throw Error("Cannot find global object")}var i=t(this);function s(r,o){if(o)e:{var c=i;r=r.split(".");for(var h=0;h<r.length-1;h++){var w=r[h];if(!(w in c))break e;c=c[w]}r=r[r.length-1],h=c[r],o=o(h),o!=h&&o!=null&&e(c,r,{configurable:!0,writable:!0,value:o})}}s("Symbol.dispose",function(r){return r||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(r){return r||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(r){return r||function(o){var c=[],h;for(h in o)Object.prototype.hasOwnProperty.call(o,h)&&c.push([h,o[h]]);return c}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function u(r){var o=typeof r;return o=="object"&&r!=null||o=="function"}function g(r,o,c){return r.call.apply(r.bind,arguments)}function _(r,o,c){return _=g,_.apply(null,arguments)}function R(r,o){var c=Array.prototype.slice.call(arguments,1);return function(){var h=c.slice();return h.push.apply(h,arguments),r.apply(this,h)}}function b(r,o){function c(){}c.prototype=o.prototype,r.Z=o.prototype,r.prototype=new c,r.prototype.constructor=r,r.Ob=function(h,w,T){for(var A=Array(arguments.length-2),k=2;k<arguments.length;k++)A[k-2]=arguments[k];return o.prototype[w].apply(h,A)}}var S=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?r=>r&&AsyncContext.Snapshot.wrap(r):r=>r;function M(r){const o=r.length;if(o>0){const c=Array(o);for(let h=0;h<o;h++)c[h]=r[h];return c}return[]}function U(r,o){for(let h=1;h<arguments.length;h++){const w=arguments[h];var c=typeof w;if(c=c!="object"?c:w?Array.isArray(w)?"array":c:"null",c=="array"||c=="object"&&typeof w.length=="number"){c=r.length||0;const T=w.length||0;r.length=c+T;for(let A=0;A<T;A++)r[c+A]=w[A]}else r.push(w)}}class W{constructor(o,c){this.i=o,this.j=c,this.h=0,this.g=null}get(){let o;return this.h>0?(this.h--,o=this.g,this.g=o.next,o.next=null):o=this.i(),o}}function j(r){l.setTimeout(()=>{throw r},0)}function oe(){var r=I;let o=null;return r.g&&(o=r.g,r.g=r.g.next,r.g||(r.h=null),o.next=null),o}class ae{constructor(){this.h=this.g=null}add(o,c){const h=ue.get();h.set(o,c),this.h?this.h.next=h:this.g=h,this.h=h}}var ue=new W(()=>new Be,r=>r.reset());class Be{constructor(){this.next=this.g=this.h=null}set(o,c){this.h=o,this.g=c,this.next=null}reset(){this.next=this.g=this.h=null}}let $e,de=!1,I=new ae,d=()=>{const r=Promise.resolve(void 0);$e=()=>{r.then(p)}};function p(){for(var r;r=oe();){try{r.h.call(r.g)}catch(c){j(c)}var o=ue;o.j(r),o.h<100&&(o.h++,r.next=o.g,o.g=r)}de=!1}function y(){this.u=this.u,this.C=this.C}y.prototype.u=!1,y.prototype.dispose=function(){this.u||(this.u=!0,this.N())},y.prototype[Symbol.dispose]=function(){this.dispose()},y.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function m(r,o){this.type=r,this.g=this.target=o,this.defaultPrevented=!1}m.prototype.h=function(){this.defaultPrevented=!0};var E=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var r=!1,o=Object.defineProperty({},"passive",{get:function(){r=!0}});try{const c=()=>{};l.addEventListener("test",c,o),l.removeEventListener("test",c,o)}catch{}return r})();function f(r){return/^[\s\xa0]*$/.test(r)}function ie(r,o){m.call(this,r?r.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,r&&this.init(r,o)}b(ie,m),ie.prototype.init=function(r,o){const c=this.type=r.type,h=r.changedTouches&&r.changedTouches.length?r.changedTouches[0]:null;this.target=r.target||r.srcElement,this.g=o,o=r.relatedTarget,o||(c=="mouseover"?o=r.fromElement:c=="mouseout"&&(o=r.toElement)),this.relatedTarget=o,h?(this.clientX=h.clientX!==void 0?h.clientX:h.pageX,this.clientY=h.clientY!==void 0?h.clientY:h.pageY,this.screenX=h.screenX||0,this.screenY=h.screenY||0):(this.clientX=r.clientX!==void 0?r.clientX:r.pageX,this.clientY=r.clientY!==void 0?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0),this.button=r.button,this.key=r.key||"",this.ctrlKey=r.ctrlKey,this.altKey=r.altKey,this.shiftKey=r.shiftKey,this.metaKey=r.metaKey,this.pointerId=r.pointerId||0,this.pointerType=r.pointerType,this.state=r.state,this.i=r,r.defaultPrevented&&ie.Z.h.call(this)},ie.prototype.h=function(){ie.Z.h.call(this);const r=this.i;r.preventDefault?r.preventDefault():r.returnValue=!1};var st="closure_listenable_"+(Math.random()*1e6|0),pl=0;function gl(r,o,c,h,w){this.listener=r,this.proxy=null,this.src=o,this.type=c,this.capture=!!h,this.ha=w,this.key=++pl,this.da=this.fa=!1}function bn(r){r.da=!0,r.listener=null,r.proxy=null,r.src=null,r.ha=null}function Rn(r,o,c){for(const h in r)o.call(c,r[h],h,r)}function ml(r,o){for(const c in r)o.call(void 0,r[c],c,r)}function as(r){const o={};for(const c in r)o[c]=r[c];return o}const cs="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ls(r,o){let c,h;for(let w=1;w<arguments.length;w++){h=arguments[w];for(c in h)r[c]=h[c];for(let T=0;T<cs.length;T++)c=cs[T],Object.prototype.hasOwnProperty.call(h,c)&&(r[c]=h[c])}}function Pn(r){this.src=r,this.g={},this.h=0}Pn.prototype.add=function(r,o,c,h,w){const T=r.toString();r=this.g[T],r||(r=this.g[T]=[],this.h++);const A=vi(r,o,h,w);return A>-1?(o=r[A],c||(o.fa=!1)):(o=new gl(o,this.src,T,!!h,w),o.fa=c,r.push(o)),o};function Ti(r,o){const c=o.type;if(c in r.g){var h=r.g[c],w=Array.prototype.indexOf.call(h,o,void 0),T;(T=w>=0)&&Array.prototype.splice.call(h,w,1),T&&(bn(o),r.g[c].length==0&&(delete r.g[c],r.h--))}}function vi(r,o,c,h){for(let w=0;w<r.length;++w){const T=r[w];if(!T.da&&T.listener==o&&T.capture==!!c&&T.ha==h)return w}return-1}var Ai="closure_lm_"+(Math.random()*1e6|0),Si={};function hs(r,o,c,h,w){if(Array.isArray(o)){for(let T=0;T<o.length;T++)hs(r,o[T],c,h,w);return null}return c=fs(c),r&&r[st]?r.J(o,c,u(h)?!!h.capture:!1,w):_l(r,o,c,!1,h,w)}function _l(r,o,c,h,w,T){if(!o)throw Error("Invalid event type");const A=u(w)?!!w.capture:!!w;let k=Ri(r);if(k||(r[Ai]=k=new Pn(r)),c=k.add(o,c,h,A,T),c.proxy)return c;if(h=Il(),c.proxy=h,h.src=r,h.listener=c,r.addEventListener)E||(w=A),w===void 0&&(w=!1),r.addEventListener(o.toString(),h,w);else if(r.attachEvent)r.attachEvent(ds(o.toString()),h);else if(r.addListener&&r.removeListener)r.addListener(h);else throw Error("addEventListener and attachEvent are unavailable.");return c}function Il(){function r(c){return o.call(r.src,r.listener,c)}const o=yl;return r}function us(r,o,c,h,w){if(Array.isArray(o))for(var T=0;T<o.length;T++)us(r,o[T],c,h,w);else h=u(h)?!!h.capture:!!h,c=fs(c),r&&r[st]?(r=r.i,T=String(o).toString(),T in r.g&&(o=r.g[T],c=vi(o,c,h,w),c>-1&&(bn(o[c]),Array.prototype.splice.call(o,c,1),o.length==0&&(delete r.g[T],r.h--)))):r&&(r=Ri(r))&&(o=r.g[o.toString()],r=-1,o&&(r=vi(o,c,h,w)),(c=r>-1?o[r]:null)&&bi(c))}function bi(r){if(typeof r!="number"&&r&&!r.da){var o=r.src;if(o&&o[st])Ti(o.i,r);else{var c=r.type,h=r.proxy;o.removeEventListener?o.removeEventListener(c,h,r.capture):o.detachEvent?o.detachEvent(ds(c),h):o.addListener&&o.removeListener&&o.removeListener(h),(c=Ri(o))?(Ti(c,r),c.h==0&&(c.src=null,o[Ai]=null)):bn(r)}}}function ds(r){return r in Si?Si[r]:Si[r]="on"+r}function yl(r,o){if(r.da)r=!0;else{o=new ie(o,this);const c=r.listener,h=r.ha||r.src;r.fa&&bi(r),r=c.call(h,o)}return r}function Ri(r){return r=r[Ai],r instanceof Pn?r:null}var Pi="__closure_events_fn_"+(Math.random()*1e9>>>0);function fs(r){return typeof r=="function"?r:(r[Pi]||(r[Pi]=function(o){return r.handleEvent(o)}),r[Pi])}function J(){y.call(this),this.i=new Pn(this),this.M=this,this.G=null}b(J,y),J.prototype[st]=!0,J.prototype.removeEventListener=function(r,o,c,h){us(this,r,o,c,h)};function Q(r,o){var c,h=r.G;if(h)for(c=[];h;h=h.G)c.push(h);if(r=r.M,h=o.type||o,typeof o=="string")o=new m(o,r);else if(o instanceof m)o.target=o.target||r;else{var w=o;o=new m(h,r),ls(o,w)}w=!0;let T,A;if(c)for(A=c.length-1;A>=0;A--)T=o.g=c[A],w=kn(T,h,!0,o)&&w;if(T=o.g=r,w=kn(T,h,!0,o)&&w,w=kn(T,h,!1,o)&&w,c)for(A=0;A<c.length;A++)T=o.g=c[A],w=kn(T,h,!1,o)&&w}J.prototype.N=function(){if(J.Z.N.call(this),this.i){var r=this.i;for(const o in r.g){const c=r.g[o];for(let h=0;h<c.length;h++)bn(c[h]);delete r.g[o],r.h--}}this.G=null},J.prototype.J=function(r,o,c,h){return this.i.add(String(r),o,!1,c,h)},J.prototype.K=function(r,o,c,h){return this.i.add(String(r),o,!0,c,h)};function kn(r,o,c,h){if(o=r.i.g[String(o)],!o)return!0;o=o.concat();let w=!0;for(let T=0;T<o.length;++T){const A=o[T];if(A&&!A.da&&A.capture==c){const k=A.listener,G=A.ha||A.src;A.fa&&Ti(r.i,A),w=k.call(G,h)!==!1&&w}}return w&&!h.defaultPrevented}function wl(r,o){if(typeof r!="function")if(r&&typeof r.handleEvent=="function")r=_(r.handleEvent,r);else throw Error("Invalid listener argument");return Number(o)>2147483647?-1:l.setTimeout(r,o||0)}function ps(r){r.g=wl(()=>{r.g=null,r.i&&(r.i=!1,ps(r))},r.l);const o=r.h;r.h=null,r.m.apply(null,o)}class El extends y{constructor(o,c){super(),this.m=o,this.l=c,this.h=null,this.i=!1,this.g=null}j(o){this.h=arguments,this.g?this.i=!0:ps(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Vt(r){y.call(this),this.h=r,this.g={}}b(Vt,y);var gs=[];function ms(r){Rn(r.g,function(o,c){this.g.hasOwnProperty(c)&&bi(o)},r),r.g={}}Vt.prototype.N=function(){Vt.Z.N.call(this),ms(this)},Vt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ki=l.JSON.stringify,Tl=l.JSON.parse,vl=class{stringify(r){return l.JSON.stringify(r,void 0)}parse(r){return l.JSON.parse(r,void 0)}};function _s(){}function Al(){}var xt={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Ci(){m.call(this,"d")}b(Ci,m);function Ni(){m.call(this,"c")}b(Ni,m);var Tt={},Is=null;function Oi(){return Is=Is||new J}Tt.Ia="serverreachability";function ys(r){m.call(this,Tt.Ia,r)}b(ys,m);function jt(r){const o=Oi();Q(o,new ys(o))}Tt.STAT_EVENT="statevent";function ws(r,o){m.call(this,Tt.STAT_EVENT,r),this.stat=o}b(ws,m);function Z(r){const o=Oi();Q(o,new ws(o,r))}Tt.Ja="timingevent";function Es(r,o){m.call(this,Tt.Ja,r),this.size=o}b(Es,m);function Ht(r,o){if(typeof r!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){r()},o)}function Bt(){this.g=!0}Bt.prototype.ua=function(){this.g=!1};function Sl(r,o,c,h,w,T){r.info(function(){if(r.g)if(T){var A="",k=T.split("&");for(let L=0;L<k.length;L++){var G=k[L].split("=");if(G.length>1){const K=G[0];G=G[1];const Ee=K.split("_");A=Ee.length>=2&&Ee[1]=="type"?A+(K+"="+G+"&"):A+(K+"=redacted&")}}}else A=null;else A=T;return"XMLHTTP REQ ("+h+") [attempt "+w+"]: "+o+`
`+c+`
`+A})}function bl(r,o,c,h,w,T,A){r.info(function(){return"XMLHTTP RESP ("+h+") [ attempt "+w+"]: "+o+`
`+c+`
`+T+" "+A})}function vt(r,o,c,h){r.info(function(){return"XMLHTTP TEXT ("+o+"): "+Pl(r,c)+(h?" "+h:"")})}function Rl(r,o){r.info(function(){return"TIMEOUT: "+o})}Bt.prototype.info=function(){};function Pl(r,o){if(!r.g)return o;if(!o)return null;try{const T=JSON.parse(o);if(T){for(r=0;r<T.length;r++)if(Array.isArray(T[r])){var c=T[r];if(!(c.length<2)){var h=c[1];if(Array.isArray(h)&&!(h.length<1)){var w=h[0];if(w!="noop"&&w!="stop"&&w!="close")for(let A=1;A<h.length;A++)h[A]=""}}}}return ki(T)}catch{return o}}var Di={NO_ERROR:0,TIMEOUT:8},kl={},Ts;function Li(){}b(Li,_s),Li.prototype.g=function(){return new XMLHttpRequest},Ts=new Li;function $t(r){return encodeURIComponent(String(r))}function Cl(r){var o=1;r=r.split(":");const c=[];for(;o>0&&r.length;)c.push(r.shift()),o--;return r.length&&c.push(r.join(":")),c}function We(r,o,c,h){this.j=r,this.i=o,this.l=c,this.S=h||1,this.V=new Vt(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new vs}function vs(){this.i=null,this.g="",this.h=!1}var As={},Mi={};function Ui(r,o,c){r.M=1,r.A=Nn(we(o)),r.u=c,r.R=!0,Ss(r,null)}function Ss(r,o){r.F=Date.now(),Cn(r),r.B=we(r.A);var c=r.B,h=r.S;Array.isArray(h)||(h=[String(h)]),Vs(c.i,"t",h),r.C=0,c=r.j.L,r.h=new vs,r.g=no(r.j,c?o:null,!r.u),r.P>0&&(r.O=new El(_(r.Y,r,r.g),r.P)),o=r.V,c=r.g,h=r.ba;var w="readystatechange";Array.isArray(w)||(w&&(gs[0]=w.toString()),w=gs);for(let T=0;T<w.length;T++){const A=hs(c,w[T],h||o.handleEvent,!1,o.h||o);if(!A)break;o.g[A.key]=A}o=r.J?as(r.J):{},r.u?(r.v||(r.v="POST"),o["Content-Type"]="application/x-www-form-urlencoded",r.g.ea(r.B,r.v,r.u,o)):(r.v="GET",r.g.ea(r.B,r.v,null,o)),jt(),Sl(r.i,r.v,r.B,r.l,r.S,r.u)}We.prototype.ba=function(r){r=r.target;const o=this.O;o&&Ge(r)==3?o.j():this.Y(r)},We.prototype.Y=function(r){try{if(r==this.g)e:{const k=Ge(this.g),G=this.g.ya(),L=this.g.ca();if(!(k<3)&&(k!=3||this.g&&(this.h.h||this.g.la()||qs(this.g)))){this.K||k!=4||G==7||(G==8||L<=0?jt(3):jt(2)),Fi(this);var o=this.g.ca();this.X=o;var c=Nl(this);if(this.o=o==200,bl(this.i,this.v,this.B,this.l,this.S,k,o),this.o){if(this.U&&!this.L){t:{if(this.g){var h,w=this.g;if((h=w.g?w.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!f(h)){var T=h;break t}}T=null}if(r=T)vt(this.i,this.l,r,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Vi(this,r);else{this.o=!1,this.m=3,Z(12),ot(this),Wt(this);break e}}if(this.R){r=!0;let K;for(;!this.K&&this.C<c.length;)if(K=Ol(this,c),K==Mi){k==4&&(this.m=4,Z(14),r=!1),vt(this.i,this.l,null,"[Incomplete Response]");break}else if(K==As){this.m=4,Z(15),vt(this.i,this.l,c,"[Invalid Chunk]"),r=!1;break}else vt(this.i,this.l,K,null),Vi(this,K);if(bs(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),k!=4||c.length!=0||this.h.h||(this.m=1,Z(16),r=!1),this.o=this.o&&r,!r)vt(this.i,this.l,c,"[Invalid Chunked Response]"),ot(this),Wt(this);else if(c.length>0&&!this.W){this.W=!0;var A=this.j;A.g==this&&A.aa&&!A.P&&(A.j.info("Great, no buffering proxy detected. Bytes received: "+c.length),zi(A),A.P=!0,Z(11))}}else vt(this.i,this.l,c,null),Vi(this,c);k==4&&ot(this),this.o&&!this.K&&(k==4?Qs(this.j,this):(this.o=!1,Cn(this)))}else zl(this.g),o==400&&c.indexOf("Unknown SID")>0?(this.m=3,Z(12)):(this.m=0,Z(13)),ot(this),Wt(this)}}}catch{}finally{}};function Nl(r){if(!bs(r))return r.g.la();const o=qs(r.g);if(o==="")return"";let c="";const h=o.length,w=Ge(r.g)==4;if(!r.h.i){if(typeof TextDecoder>"u")return ot(r),Wt(r),"";r.h.i=new l.TextDecoder}for(let T=0;T<h;T++)r.h.h=!0,c+=r.h.i.decode(o[T],{stream:!(w&&T==h-1)});return o.length=0,r.h.g+=c,r.C=0,r.h.g}function bs(r){return r.g?r.v=="GET"&&r.M!=2&&r.j.Aa:!1}function Ol(r,o){var c=r.C,h=o.indexOf(`
`,c);return h==-1?Mi:(c=Number(o.substring(c,h)),isNaN(c)?As:(h+=1,h+c>o.length?Mi:(o=o.slice(h,h+c),r.C=h+c,o)))}We.prototype.cancel=function(){this.K=!0,ot(this)};function Cn(r){r.T=Date.now()+r.H,Rs(r,r.H)}function Rs(r,o){if(r.D!=null)throw Error("WatchDog timer not null");r.D=Ht(_(r.aa,r),o)}function Fi(r){r.D&&(l.clearTimeout(r.D),r.D=null)}We.prototype.aa=function(){this.D=null;const r=Date.now();r-this.T>=0?(Rl(this.i,this.B),this.M!=2&&(jt(),Z(17)),ot(this),this.m=2,Wt(this)):Rs(this,this.T-r)};function Wt(r){r.j.I==0||r.K||Qs(r.j,r)}function ot(r){Fi(r);var o=r.O;o&&typeof o.dispose=="function"&&o.dispose(),r.O=null,ms(r.V),r.g&&(o=r.g,r.g=null,o.abort(),o.dispose())}function Vi(r,o){try{var c=r.j;if(c.I!=0&&(c.g==r||xi(c.h,r))){if(!r.L&&xi(c.h,r)&&c.I==3){try{var h=c.Ba.g.parse(o)}catch{h=null}if(Array.isArray(h)&&h.length==3){var w=h;if(w[0]==0){e:if(!c.v){if(c.g)if(c.g.F+3e3<r.F)Un(c),Ln(c);else break e;qi(c),Z(18)}}else c.xa=w[1],0<c.xa-c.K&&w[2]<37500&&c.F&&c.A==0&&!c.C&&(c.C=Ht(_(c.Va,c),6e3));Cs(c.h)<=1&&c.ta&&(c.ta=void 0)}else ct(c,11)}else if((r.L||c.g==r)&&Un(c),!f(o))for(w=c.Ba.g.parse(o),o=0;o<w.length;o++){let L=w[o];const K=L[0];if(!(K<=c.K))if(c.K=K,L=L[1],c.I==2)if(L[0]=="c"){c.M=L[1],c.ba=L[2];const Ee=L[3];Ee!=null&&(c.ka=Ee,c.j.info("VER="+c.ka));const lt=L[4];lt!=null&&(c.za=lt,c.j.info("SVER="+c.za));const Ke=L[5];Ke!=null&&typeof Ke=="number"&&Ke>0&&(h=1.5*Ke,c.O=h,c.j.info("backChannelRequestTimeoutMs_="+h)),h=c;const Ye=r.g;if(Ye){const Fn=Ye.g?Ye.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Fn){var T=h.h;T.g||Fn.indexOf("spdy")==-1&&Fn.indexOf("quic")==-1&&Fn.indexOf("h2")==-1||(T.j=T.l,T.g=new Set,T.h&&(ji(T,T.h),T.h=null))}if(h.G){const Gi=Ye.g?Ye.g.getResponseHeader("X-HTTP-Session-Id"):null;Gi&&(h.wa=Gi,F(h.J,h.G,Gi))}}c.I=3,c.l&&c.l.ra(),c.aa&&(c.T=Date.now()-r.F,c.j.info("Handshake RTT: "+c.T+"ms")),h=c;var A=r;if(h.na=to(h,h.L?h.ba:null,h.W),A.L){Ns(h.h,A);var k=A,G=h.O;G&&(k.H=G),k.D&&(Fi(k),Cn(k)),h.g=A}else Js(h);c.i.length>0&&Mn(c)}else L[0]!="stop"&&L[0]!="close"||ct(c,7);else c.I==3&&(L[0]=="stop"||L[0]=="close"?L[0]=="stop"?ct(c,7):Wi(c):L[0]!="noop"&&c.l&&c.l.qa(L),c.A=0)}}jt(4)}catch{}}var Dl=class{constructor(r,o){this.g=r,this.map=o}};function Ps(r){this.l=r||10,l.PerformanceNavigationTiming?(r=l.performance.getEntriesByType("navigation"),r=r.length>0&&(r[0].nextHopProtocol=="hq"||r[0].nextHopProtocol=="h2")):r=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=r?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function ks(r){return r.h?!0:r.g?r.g.size>=r.j:!1}function Cs(r){return r.h?1:r.g?r.g.size:0}function xi(r,o){return r.h?r.h==o:r.g?r.g.has(o):!1}function ji(r,o){r.g?r.g.add(o):r.h=o}function Ns(r,o){r.h&&r.h==o?r.h=null:r.g&&r.g.has(o)&&r.g.delete(o)}Ps.prototype.cancel=function(){if(this.i=Os(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const r of this.g.values())r.cancel();this.g.clear()}};function Os(r){if(r.h!=null)return r.i.concat(r.h.G);if(r.g!=null&&r.g.size!==0){let o=r.i;for(const c of r.g.values())o=o.concat(c.G);return o}return M(r.i)}var Ds=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ll(r,o){if(r){r=r.split("&");for(let c=0;c<r.length;c++){const h=r[c].indexOf("=");let w,T=null;h>=0?(w=r[c].substring(0,h),T=r[c].substring(h+1)):w=r[c],o(w,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function qe(r){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let o;r instanceof qe?(this.l=r.l,qt(this,r.j),this.o=r.o,this.g=r.g,zt(this,r.u),this.h=r.h,Hi(this,xs(r.i)),this.m=r.m):r&&(o=String(r).match(Ds))?(this.l=!1,qt(this,o[1]||"",!0),this.o=Gt(o[2]||""),this.g=Gt(o[3]||"",!0),zt(this,o[4]),this.h=Gt(o[5]||"",!0),Hi(this,o[6]||"",!0),this.m=Gt(o[7]||"")):(this.l=!1,this.i=new Yt(null,this.l))}qe.prototype.toString=function(){const r=[];var o=this.j;o&&r.push(Kt(o,Ls,!0),":");var c=this.g;return(c||o=="file")&&(r.push("//"),(o=this.o)&&r.push(Kt(o,Ls,!0),"@"),r.push($t(c).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.u,c!=null&&r.push(":",String(c))),(c=this.h)&&(this.g&&c.charAt(0)!="/"&&r.push("/"),r.push(Kt(c,c.charAt(0)=="/"?Fl:Ul,!0))),(c=this.i.toString())&&r.push("?",c),(c=this.m)&&r.push("#",Kt(c,xl)),r.join("")},qe.prototype.resolve=function(r){const o=we(this);let c=!!r.j;c?qt(o,r.j):c=!!r.o,c?o.o=r.o:c=!!r.g,c?o.g=r.g:c=r.u!=null;var h=r.h;if(c)zt(o,r.u);else if(c=!!r.h){if(h.charAt(0)!="/")if(this.g&&!this.h)h="/"+h;else{var w=o.h.lastIndexOf("/");w!=-1&&(h=o.h.slice(0,w+1)+h)}if(w=h,w==".."||w==".")h="";else if(w.indexOf("./")!=-1||w.indexOf("/.")!=-1){h=w.lastIndexOf("/",0)==0,w=w.split("/");const T=[];for(let A=0;A<w.length;){const k=w[A++];k=="."?h&&A==w.length&&T.push(""):k==".."?((T.length>1||T.length==1&&T[0]!="")&&T.pop(),h&&A==w.length&&T.push("")):(T.push(k),h=!0)}h=T.join("/")}else h=w}return c?o.h=h:c=r.i.toString()!=="",c?Hi(o,xs(r.i)):c=!!r.m,c&&(o.m=r.m),o};function we(r){return new qe(r)}function qt(r,o,c){r.j=c?Gt(o,!0):o,r.j&&(r.j=r.j.replace(/:$/,""))}function zt(r,o){if(o){if(o=Number(o),isNaN(o)||o<0)throw Error("Bad port number "+o);r.u=o}else r.u=null}function Hi(r,o,c){o instanceof Yt?(r.i=o,jl(r.i,r.l)):(c||(o=Kt(o,Vl)),r.i=new Yt(o,r.l))}function F(r,o,c){r.i.set(o,c)}function Nn(r){return F(r,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),r}function Gt(r,o){return r?o?decodeURI(r.replace(/%25/g,"%2525")):decodeURIComponent(r):""}function Kt(r,o,c){return typeof r=="string"?(r=encodeURI(r).replace(o,Ml),c&&(r=r.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),r):null}function Ml(r){return r=r.charCodeAt(0),"%"+(r>>4&15).toString(16)+(r&15).toString(16)}var Ls=/[#\/\?@]/g,Ul=/[#\?:]/g,Fl=/[#\?]/g,Vl=/[#\?@]/g,xl=/#/g;function Yt(r,o){this.h=this.g=null,this.i=r||null,this.j=!!o}function at(r){r.g||(r.g=new Map,r.h=0,r.i&&Ll(r.i,function(o,c){r.add(decodeURIComponent(o.replace(/\+/g," ")),c)}))}n=Yt.prototype,n.add=function(r,o){at(this),this.i=null,r=At(this,r);let c=this.g.get(r);return c||this.g.set(r,c=[]),c.push(o),this.h+=1,this};function Ms(r,o){at(r),o=At(r,o),r.g.has(o)&&(r.i=null,r.h-=r.g.get(o).length,r.g.delete(o))}function Us(r,o){return at(r),o=At(r,o),r.g.has(o)}n.forEach=function(r,o){at(this),this.g.forEach(function(c,h){c.forEach(function(w){r.call(o,w,h,this)},this)},this)};function Fs(r,o){at(r);let c=[];if(typeof o=="string")Us(r,o)&&(c=c.concat(r.g.get(At(r,o))));else for(r=Array.from(r.g.values()),o=0;o<r.length;o++)c=c.concat(r[o]);return c}n.set=function(r,o){return at(this),this.i=null,r=At(this,r),Us(this,r)&&(this.h-=this.g.get(r).length),this.g.set(r,[o]),this.h+=1,this},n.get=function(r,o){return r?(r=Fs(this,r),r.length>0?String(r[0]):o):o};function Vs(r,o,c){Ms(r,o),c.length>0&&(r.i=null,r.g.set(At(r,o),M(c)),r.h+=c.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const r=[],o=Array.from(this.g.keys());for(let h=0;h<o.length;h++){var c=o[h];const w=$t(c);c=Fs(this,c);for(let T=0;T<c.length;T++){let A=w;c[T]!==""&&(A+="="+$t(c[T])),r.push(A)}}return this.i=r.join("&")};function xs(r){const o=new Yt;return o.i=r.i,r.g&&(o.g=new Map(r.g),o.h=r.h),o}function At(r,o){return o=String(o),r.j&&(o=o.toLowerCase()),o}function jl(r,o){o&&!r.j&&(at(r),r.i=null,r.g.forEach(function(c,h){const w=h.toLowerCase();h!=w&&(Ms(this,h),Vs(this,w,c))},r)),r.j=o}function Hl(r,o){const c=new Bt;if(l.Image){const h=new Image;h.onload=R(ze,c,"TestLoadImage: loaded",!0,o,h),h.onerror=R(ze,c,"TestLoadImage: error",!1,o,h),h.onabort=R(ze,c,"TestLoadImage: abort",!1,o,h),h.ontimeout=R(ze,c,"TestLoadImage: timeout",!1,o,h),l.setTimeout(function(){h.ontimeout&&h.ontimeout()},1e4),h.src=r}else o(!1)}function Bl(r,o){const c=new Bt,h=new AbortController,w=setTimeout(()=>{h.abort(),ze(c,"TestPingServer: timeout",!1,o)},1e4);fetch(r,{signal:h.signal}).then(T=>{clearTimeout(w),T.ok?ze(c,"TestPingServer: ok",!0,o):ze(c,"TestPingServer: server error",!1,o)}).catch(()=>{clearTimeout(w),ze(c,"TestPingServer: error",!1,o)})}function ze(r,o,c,h,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),h(c)}catch{}}function $l(){this.g=new vl}function Bi(r){this.i=r.Sb||null,this.h=r.ab||!1}b(Bi,_s),Bi.prototype.g=function(){return new On(this.i,this.h)};function On(r,o){J.call(this),this.H=r,this.o=o,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}b(On,J),n=On.prototype,n.open=function(r,o){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=r,this.D=o,this.readyState=1,Xt(this)},n.send=function(r){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const o={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};r&&(o.body=r),(this.H||l).fetch(new Request(this.D,o)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Jt(this)),this.readyState=0},n.Pa=function(r){if(this.g&&(this.l=r,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=r.headers,this.readyState=2,Xt(this)),this.g&&(this.readyState=3,Xt(this),this.g)))if(this.responseType==="arraybuffer")r.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in r){if(this.j=r.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;js(this)}else r.text().then(this.Oa.bind(this),this.ga.bind(this))};function js(r){r.j.read().then(r.Ma.bind(r)).catch(r.ga.bind(r))}n.Ma=function(r){if(this.g){if(this.o&&r.value)this.response.push(r.value);else if(!this.o){var o=r.value?r.value:new Uint8Array(0);(o=this.B.decode(o,{stream:!r.done}))&&(this.response=this.responseText+=o)}r.done?Jt(this):Xt(this),this.readyState==3&&js(this)}},n.Oa=function(r){this.g&&(this.response=this.responseText=r,Jt(this))},n.Na=function(r){this.g&&(this.response=r,Jt(this))},n.ga=function(){this.g&&Jt(this)};function Jt(r){r.readyState=4,r.l=null,r.j=null,r.B=null,Xt(r)}n.setRequestHeader=function(r,o){this.A.append(r,o)},n.getResponseHeader=function(r){return this.h&&this.h.get(r.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const r=[],o=this.h.entries();for(var c=o.next();!c.done;)c=c.value,r.push(c[0]+": "+c[1]),c=o.next();return r.join(`\r
`)};function Xt(r){r.onreadystatechange&&r.onreadystatechange.call(r)}Object.defineProperty(On.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(r){this.m=r?"include":"same-origin"}});function Hs(r){let o="";return Rn(r,function(c,h){o+=h,o+=":",o+=c,o+=`\r
`}),o}function $i(r,o,c){e:{for(h in c){var h=!1;break e}h=!0}h||(c=Hs(c),typeof r=="string"?c!=null&&$t(c):F(r,o,c))}function $(r){J.call(this),this.headers=new Map,this.L=r||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}b($,J);var Wl=/^https?$/i,ql=["POST","PUT"];n=$.prototype,n.Fa=function(r){this.H=r},n.ea=function(r,o,c,h){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+r);o=o?o.toUpperCase():"GET",this.D=r,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ts.g(),this.g.onreadystatechange=S(_(this.Ca,this));try{this.B=!0,this.g.open(o,String(r),!0),this.B=!1}catch(T){Bs(this,T);return}if(r=c||"",c=new Map(this.headers),h)if(Object.getPrototypeOf(h)===Object.prototype)for(var w in h)c.set(w,h[w]);else if(typeof h.keys=="function"&&typeof h.get=="function")for(const T of h.keys())c.set(T,h.get(T));else throw Error("Unknown input type for opt_headers: "+String(h));h=Array.from(c.keys()).find(T=>T.toLowerCase()=="content-type"),w=l.FormData&&r instanceof l.FormData,!(Array.prototype.indexOf.call(ql,o,void 0)>=0)||h||w||c.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[T,A]of c)this.g.setRequestHeader(T,A);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(r),this.v=!1}catch(T){Bs(this,T)}};function Bs(r,o){r.h=!1,r.g&&(r.j=!0,r.g.abort(),r.j=!1),r.l=o,r.o=5,$s(r),Dn(r)}function $s(r){r.A||(r.A=!0,Q(r,"complete"),Q(r,"error"))}n.abort=function(r){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=r||7,Q(this,"complete"),Q(this,"abort"),Dn(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Dn(this,!0)),$.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Ws(this):this.Xa())},n.Xa=function(){Ws(this)};function Ws(r){if(r.h&&typeof a<"u"){if(r.v&&Ge(r)==4)setTimeout(r.Ca.bind(r),0);else if(Q(r,"readystatechange"),Ge(r)==4){r.h=!1;try{const T=r.ca();e:switch(T){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var o=!0;break e;default:o=!1}var c;if(!(c=o)){var h;if(h=T===0){let A=String(r.D).match(Ds)[1]||null;!A&&l.self&&l.self.location&&(A=l.self.location.protocol.slice(0,-1)),h=!Wl.test(A?A.toLowerCase():"")}c=h}if(c)Q(r,"complete"),Q(r,"success");else{r.o=6;try{var w=Ge(r)>2?r.g.statusText:""}catch{w=""}r.l=w+" ["+r.ca()+"]",$s(r)}}finally{Dn(r)}}}}function Dn(r,o){if(r.g){r.m&&(clearTimeout(r.m),r.m=null);const c=r.g;r.g=null,o||Q(r,"ready");try{c.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Ge(r){return r.g?r.g.readyState:0}n.ca=function(){try{return Ge(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(r){if(this.g){var o=this.g.responseText;return r&&o.indexOf(r)==0&&(o=o.substring(r.length)),Tl(o)}};function qs(r){try{if(!r.g)return null;if("response"in r.g)return r.g.response;switch(r.F){case"":case"text":return r.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in r.g)return r.g.mozResponseArrayBuffer}return null}catch{return null}}function zl(r){const o={};r=(r.g&&Ge(r)>=2&&r.g.getAllResponseHeaders()||"").split(`\r
`);for(let h=0;h<r.length;h++){if(f(r[h]))continue;var c=Cl(r[h]);const w=c[0];if(c=c[1],typeof c!="string")continue;c=c.trim();const T=o[w]||[];o[w]=T,T.push(c)}ml(o,function(h){return h.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Qt(r,o,c){return c&&c.internalChannelParams&&c.internalChannelParams[r]||o}function zs(r){this.za=0,this.i=[],this.j=new Bt,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Qt("failFast",!1,r),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Qt("baseRetryDelayMs",5e3,r),this.Za=Qt("retryDelaySeedMs",1e4,r),this.Ta=Qt("forwardChannelMaxRetries",2,r),this.va=Qt("forwardChannelRequestTimeoutMs",2e4,r),this.ma=r&&r.xmlHttpFactory||void 0,this.Ua=r&&r.Rb||void 0,this.Aa=r&&r.useFetchStreams||!1,this.O=void 0,this.L=r&&r.supportsCrossDomainXhr||!1,this.M="",this.h=new Ps(r&&r.concurrentRequestLimit),this.Ba=new $l,this.S=r&&r.fastHandshake||!1,this.R=r&&r.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=r&&r.Pb||!1,r&&r.ua&&this.j.ua(),r&&r.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&r&&r.detectBufferingProxy||!1,this.ia=void 0,r&&r.longPollingTimeout&&r.longPollingTimeout>0&&(this.ia=r.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=zs.prototype,n.ka=8,n.I=1,n.connect=function(r,o,c,h){Z(0),this.W=r,this.H=o||{},c&&h!==void 0&&(this.H.OSID=c,this.H.OAID=h),this.F=this.X,this.J=to(this,null,this.W),Mn(this)};function Wi(r){if(Gs(r),r.I==3){var o=r.V++,c=we(r.J);if(F(c,"SID",r.M),F(c,"RID",o),F(c,"TYPE","terminate"),Zt(r,c),o=new We(r,r.j,o),o.M=2,o.A=Nn(we(c)),c=!1,l.navigator&&l.navigator.sendBeacon)try{c=l.navigator.sendBeacon(o.A.toString(),"")}catch{}!c&&l.Image&&(new Image().src=o.A,c=!0),c||(o.g=no(o.j,null),o.g.ea(o.A)),o.F=Date.now(),Cn(o)}eo(r)}function Ln(r){r.g&&(zi(r),r.g.cancel(),r.g=null)}function Gs(r){Ln(r),r.v&&(l.clearTimeout(r.v),r.v=null),Un(r),r.h.cancel(),r.m&&(typeof r.m=="number"&&l.clearTimeout(r.m),r.m=null)}function Mn(r){if(!ks(r.h)&&!r.m){r.m=!0;var o=r.Ea;$e||d(),de||($e(),de=!0),I.add(o,r),r.D=0}}function Gl(r,o){return Cs(r.h)>=r.h.j-(r.m?1:0)?!1:r.m?(r.i=o.G.concat(r.i),!0):r.I==1||r.I==2||r.D>=(r.Sa?0:r.Ta)?!1:(r.m=Ht(_(r.Ea,r,o),Zs(r,r.D)),r.D++,!0)}n.Ea=function(r){if(this.m)if(this.m=null,this.I==1){if(!r){this.V=Math.floor(Math.random()*1e5),r=this.V++;const w=new We(this,this.j,r);let T=this.o;if(this.U&&(T?(T=as(T),ls(T,this.U)):T=this.U),this.u!==null||this.R||(w.J=T,T=null),this.S)e:{for(var o=0,c=0;c<this.i.length;c++){t:{var h=this.i[c];if("__data__"in h.map&&(h=h.map.__data__,typeof h=="string")){h=h.length;break t}h=void 0}if(h===void 0)break;if(o+=h,o>4096){o=c;break e}if(o===4096||c===this.i.length-1){o=c+1;break e}}o=1e3}else o=1e3;o=Ys(this,w,o),c=we(this.J),F(c,"RID",r),F(c,"CVER",22),this.G&&F(c,"X-HTTP-Session-Id",this.G),Zt(this,c),T&&(this.R?o="headers="+$t(Hs(T))+"&"+o:this.u&&$i(c,this.u,T)),ji(this.h,w),this.Ra&&F(c,"TYPE","init"),this.S?(F(c,"$req",o),F(c,"SID","null"),w.U=!0,Ui(w,c,null)):Ui(w,c,o),this.I=2}}else this.I==3&&(r?Ks(this,r):this.i.length==0||ks(this.h)||Ks(this))};function Ks(r,o){var c;o?c=o.l:c=r.V++;const h=we(r.J);F(h,"SID",r.M),F(h,"RID",c),F(h,"AID",r.K),Zt(r,h),r.u&&r.o&&$i(h,r.u,r.o),c=new We(r,r.j,c,r.D+1),r.u===null&&(c.J=r.o),o&&(r.i=o.G.concat(r.i)),o=Ys(r,c,1e3),c.H=Math.round(r.va*.5)+Math.round(r.va*.5*Math.random()),ji(r.h,c),Ui(c,h,o)}function Zt(r,o){r.H&&Rn(r.H,function(c,h){F(o,h,c)}),r.l&&Rn({},function(c,h){F(o,h,c)})}function Ys(r,o,c){c=Math.min(r.i.length,c);const h=r.l?_(r.l.Ka,r.l,r):null;e:{var w=r.i;let k=-1;for(;;){const G=["count="+c];k==-1?c>0?(k=w[0].g,G.push("ofs="+k)):k=0:G.push("ofs="+k);let L=!0;for(let K=0;K<c;K++){var T=w[K].g;const Ee=w[K].map;if(T-=k,T<0)k=Math.max(0,w[K].g-100),L=!1;else try{T="req"+T+"_"||"";try{var A=Ee instanceof Map?Ee:Object.entries(Ee);for(const[lt,Ke]of A){let Ye=Ke;u(Ke)&&(Ye=ki(Ke)),G.push(T+lt+"="+encodeURIComponent(Ye))}}catch(lt){throw G.push(T+"type="+encodeURIComponent("_badmap")),lt}}catch{h&&h(Ee)}}if(L){A=G.join("&");break e}}A=void 0}return r=r.i.splice(0,c),o.G=r,A}function Js(r){if(!r.g&&!r.v){r.Y=1;var o=r.Da;$e||d(),de||($e(),de=!0),I.add(o,r),r.A=0}}function qi(r){return r.g||r.v||r.A>=3?!1:(r.Y++,r.v=Ht(_(r.Da,r),Zs(r,r.A)),r.A++,!0)}n.Da=function(){if(this.v=null,Xs(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var r=4*this.T;this.j.info("BP detection timer enabled: "+r),this.B=Ht(_(this.Wa,this),r)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Z(10),Ln(this),Xs(this))};function zi(r){r.B!=null&&(l.clearTimeout(r.B),r.B=null)}function Xs(r){r.g=new We(r,r.j,"rpc",r.Y),r.u===null&&(r.g.J=r.o),r.g.P=0;var o=we(r.na);F(o,"RID","rpc"),F(o,"SID",r.M),F(o,"AID",r.K),F(o,"CI",r.F?"0":"1"),!r.F&&r.ia&&F(o,"TO",r.ia),F(o,"TYPE","xmlhttp"),Zt(r,o),r.u&&r.o&&$i(o,r.u,r.o),r.O&&(r.g.H=r.O);var c=r.g;r=r.ba,c.M=1,c.A=Nn(we(o)),c.u=null,c.R=!0,Ss(c,r)}n.Va=function(){this.C!=null&&(this.C=null,Ln(this),qi(this),Z(19))};function Un(r){r.C!=null&&(l.clearTimeout(r.C),r.C=null)}function Qs(r,o){var c=null;if(r.g==o){Un(r),zi(r),r.g=null;var h=2}else if(xi(r.h,o))c=o.G,Ns(r.h,o),h=1;else return;if(r.I!=0){if(o.o)if(h==1){c=o.u?o.u.length:0,o=Date.now()-o.F;var w=r.D;h=Oi(),Q(h,new Es(h,c)),Mn(r)}else Js(r);else if(w=o.m,w==3||w==0&&o.X>0||!(h==1&&Gl(r,o)||h==2&&qi(r)))switch(c&&c.length>0&&(o=r.h,o.i=o.i.concat(c)),w){case 1:ct(r,5);break;case 4:ct(r,10);break;case 3:ct(r,6);break;default:ct(r,2)}}}function Zs(r,o){let c=r.Qa+Math.floor(Math.random()*r.Za);return r.isActive()||(c*=2),c*o}function ct(r,o){if(r.j.info("Error code "+o),o==2){var c=_(r.bb,r),h=r.Ua;const w=!h;h=new qe(h||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||qt(h,"https"),Nn(h),w?Hl(h.toString(),c):Bl(h.toString(),c)}else Z(2);r.I=0,r.l&&r.l.pa(o),eo(r),Gs(r)}n.bb=function(r){r?(this.j.info("Successfully pinged google.com"),Z(2)):(this.j.info("Failed to ping google.com"),Z(1))};function eo(r){if(r.I=0,r.ja=[],r.l){const o=Os(r.h);(o.length!=0||r.i.length!=0)&&(U(r.ja,o),U(r.ja,r.i),r.h.i.length=0,M(r.i),r.i.length=0),r.l.oa()}}function to(r,o,c){var h=c instanceof qe?we(c):new qe(c);if(h.g!="")o&&(h.g=o+"."+h.g),zt(h,h.u);else{var w=l.location;h=w.protocol,o=o?o+"."+w.hostname:w.hostname,w=+w.port;const T=new qe(null);h&&qt(T,h),o&&(T.g=o),w&&zt(T,w),c&&(T.h=c),h=T}return c=r.G,o=r.wa,c&&o&&F(h,c,o),F(h,"VER",r.ka),Zt(r,h),h}function no(r,o,c){if(o&&!r.L)throw Error("Can't create secondary domain capable XhrIo object.");return o=r.Aa&&!r.ma?new $(new Bi({ab:c})):new $(r.ma),o.Fa(r.L),o}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function io(){}n=io.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function fe(r,o){J.call(this),this.g=new zs(o),this.l=r,this.h=o&&o.messageUrlParams||null,r=o&&o.messageHeaders||null,o&&o.clientProtocolHeaderRequired&&(r?r["X-Client-Protocol"]="webchannel":r={"X-Client-Protocol":"webchannel"}),this.g.o=r,r=o&&o.initMessageHeaders||null,o&&o.messageContentType&&(r?r["X-WebChannel-Content-Type"]=o.messageContentType:r={"X-WebChannel-Content-Type":o.messageContentType}),o&&o.sa&&(r?r["X-WebChannel-Client-Profile"]=o.sa:r={"X-WebChannel-Client-Profile":o.sa}),this.g.U=r,(r=o&&o.Qb)&&!f(r)&&(this.g.u=r),this.A=o&&o.supportsCrossDomainXhr||!1,this.v=o&&o.sendRawJson||!1,(o=o&&o.httpSessionIdParam)&&!f(o)&&(this.g.G=o,r=this.h,r!==null&&o in r&&(r=this.h,o in r&&delete r[o])),this.j=new St(this)}b(fe,J),fe.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},fe.prototype.close=function(){Wi(this.g)},fe.prototype.o=function(r){var o=this.g;if(typeof r=="string"){var c={};c.__data__=r,r=c}else this.v&&(c={},c.__data__=ki(r),r=c);o.i.push(new Dl(o.Ya++,r)),o.I==3&&Mn(o)},fe.prototype.N=function(){this.g.l=null,delete this.j,Wi(this.g),delete this.g,fe.Z.N.call(this)};function ro(r){Ci.call(this),r.__headers__&&(this.headers=r.__headers__,this.statusCode=r.__status__,delete r.__headers__,delete r.__status__);var o=r.__sm__;if(o){e:{for(const c in o){r=c;break e}r=void 0}(this.i=r)&&(r=this.i,o=o!==null&&r in o?o[r]:void 0),this.data=o}else this.data=r}b(ro,Ci);function so(){Ni.call(this),this.status=1}b(so,Ni);function St(r){this.g=r}b(St,io),St.prototype.ra=function(){Q(this.g,"a")},St.prototype.qa=function(r){Q(this.g,new ro(r))},St.prototype.pa=function(r){Q(this.g,new so)},St.prototype.oa=function(){Q(this.g,"b")},fe.prototype.send=fe.prototype.o,fe.prototype.open=fe.prototype.m,fe.prototype.close=fe.prototype.close,Di.NO_ERROR=0,Di.TIMEOUT=8,Di.HTTP_ERROR=6,kl.COMPLETE="complete",Al.EventType=xt,xt.OPEN="a",xt.CLOSE="b",xt.ERROR="c",xt.MESSAGE="d",J.prototype.listen=J.prototype.J,$.prototype.listenOnce=$.prototype.K,$.prototype.getLastError=$.prototype.Ha,$.prototype.getLastErrorCode=$.prototype.ya,$.prototype.getStatus=$.prototype.ca,$.prototype.getResponseJson=$.prototype.La,$.prototype.getResponseText=$.prototype.la,$.prototype.send=$.prototype.ea,$.prototype.setWithCredentials=$.prototype.Fa}).apply(typeof jn<"u"?jn:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ce.UNAUTHENTICATED=new ce(null),ce.GOOGLE_CREDENTIALS=new ce("google-credentials-uid"),ce.FIRST_PARTY=new ce("first-party-uid"),ce.MOCK_USER=new ce("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yi="12.9.0";function hg(n){yi=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ei=new ai("@firebase/firestore");function Ie(n,...e){if(ei.logLevel<=D.DEBUG){const t=e.map(Mc);ei.debug(`Firestore (${yi}): ${n}`,...t)}}function Lc(n,...e){if(ei.logLevel<=D.ERROR){const t=e.map(Mc);ei.error(`Firestore (${yi}): ${n}`,...t)}}function Mc(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ti(n,e,t){let i="Unexpected state";typeof e=="string"?i=e:t=e,Uc(n,i,t)}function Uc(n,e,t){let i=`FIRESTORE (${yi}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{i+=" CONTEXT: "+JSON.stringify(t)}catch{i+=" CONTEXT: "+t}throw Lc(i),new Error(i)}function hn(n,e,t,i){let s="Unexpected state";typeof t=="string"?s=t:i=t,n||Uc(e,s,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class O extends ye{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ug{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class dg{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(ce.UNAUTHENTICATED)))}shutdown(){}}class fg{constructor(e){this.t=e,this.currentUser=ce.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){hn(this.o===void 0,42304);let i=this.i;const s=g=>this.i!==i?(i=this.i,t(g)):Promise.resolve();let a=new un;this.o=()=>{this.i++,this.currentUser=this.u(),a.resolve(),a=new un,e.enqueueRetryable((()=>s(this.currentUser)))};const l=()=>{const g=a;e.enqueueRetryable((async()=>{await g.promise,await s(this.currentUser)}))},u=g=>{Ie("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit((g=>u(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?u(g):(Ie("FirebaseAuthCredentialsProvider","Auth not yet detected"),a.resolve(),a=new un)}}),0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((i=>this.i!==e?(Ie("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(hn(typeof i.accessToken=="string",31837,{l:i}),new ug(i.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return hn(e===null||typeof e=="string",2055,{h:e}),new ce(e)}}class pg{constructor(e,t,i){this.P=e,this.T=t,this.I=i,this.type="FirstParty",this.user=ce.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class gg{constructor(e,t,i){this.P=e,this.T=t,this.I=i}getToken(){return Promise.resolve(new pg(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(ce.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Ho{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class mg{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,H(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){hn(this.o===void 0,3512);const i=a=>{a.error!=null&&Ie("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${a.error.message}`);const l=a.token!==this.m;return this.m=a.token,Ie("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(a.token):Promise.resolve()};this.o=a=>{e.enqueueRetryable((()=>i(a)))};const s=a=>{Ie("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=a,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((a=>s(a))),setTimeout((()=>{if(!this.appCheck){const a=this.V.getImmediate({optional:!0});a?s(a):Ie("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Ho(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(hn(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Ho(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _g(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<n;i++)t[i]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ig{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let i="";for(;i.length<20;){const s=_g(40);for(let a=0;a<s.length;++a)i.length<20&&s[a]<t&&(i+=e.charAt(s[a]%62))}return i}}function tt(n,e){return n<e?-1:n>e?1:0}function yg(n,e){const t=Math.min(n.length,e.length);for(let i=0;i<t;i++){const s=n.charAt(i),a=e.charAt(i);if(s!==a)return ar(s)===ar(a)?tt(s,a):ar(s)?1:-1}return tt(n.length,e.length)}const wg=55296,Eg=57343;function ar(n){const e=n.charCodeAt(0);return e>=wg&&e<=Eg}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bo="__name__";class Te{constructor(e,t,i){t===void 0?t=0:t>e.length&&ti(637,{offset:t,range:e.length}),i===void 0?i=e.length-t:i>e.length-t&&ti(1746,{length:i,range:e.length-t}),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return Te.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Te?e.forEach((i=>{t.push(i)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let s=0;s<i;s++){const a=Te.compareSegments(e.get(s),t.get(s));if(a!==0)return a}return tt(e.length,t.length)}static compareSegments(e,t){const i=Te.isNumericId(e),s=Te.isNumericId(t);return i&&!s?-1:!i&&s?1:i&&s?Te.extractNumericId(e).compare(Te.extractNumericId(t)):yg(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Kr.fromString(e.substring(4,e.length-2))}}class me extends Te{construct(e,t,i){return new me(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new O(N.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter((s=>s.length>0)))}return new me(t)}static emptyPath(){return new me([])}}const Tg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ut extends Te{construct(e,t,i){return new ut(e,t,i)}static isValidIdentifier(e){return Tg.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ut.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Bo}static keyField(){return new ut([Bo])}static fromServerFormat(e){const t=[];let i="",s=0;const a=()=>{if(i.length===0)throw new O(N.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let l=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new O(N.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[s+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new O(N.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=g,s+=2}else u==="`"?(l=!l,s++):u!=="."||l?(i+=u,s++):(a(),s++)}if(a(),l)throw new O(N.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ut(t)}static emptyPath(){return new ut([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e){this.path=e}static fromPath(e){return new ft(me.fromString(e))}static fromName(e){return new ft(me.fromString(e).popFirst(5))}static empty(){return new ft(me.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&me.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return me.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ft(new me(e.slice()))}}function vg(n,e,t,i){if(e===!0&&i===!0)throw new O(N.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Ag(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(n,e){const t={typeString:n};return e&&(t.value=e),t}function Sn(n,e){if(!Ag(n))throw new O(N.INVALID_ARGUMENT,"JSON must be an object");let t;for(const i in e)if(e[i]){const s=e[i].typeString,a="value"in e[i]?{value:e[i].value}:void 0;if(!(i in n)){t=`JSON missing required field: '${i}'`;break}const l=n[i];if(s&&typeof l!==s){t=`JSON field '${i}' must be a ${s}.`;break}if(a!==void 0&&l!==a.value){t=`Expected '${i}' field to equal '${a.value}'`;break}}if(t)throw new O(N.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $o=-62135596800,Wo=1e6;class ve{static now(){return ve.fromMillis(Date.now())}static fromDate(e){return ve.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor((e-1e3*t)*Wo);return new ve(t,i)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new O(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new O(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<$o)throw new O(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Wo}_compareTo(e){return this.seconds===e.seconds?tt(this.nanoseconds,e.nanoseconds):tt(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ve._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Sn(e,ve._jsonSchema))return new ve(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-$o;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ve._jsonSchemaVersion="firestore/timestamp/1.0",ve._jsonSchema={type:z("string",ve._jsonSchemaVersion),seconds:z("number"),nanoseconds:z("number")};function Sg(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(a){throw typeof DOMException<"u"&&a instanceof DOMException?new bg("Invalid base64 string: "+a):a}})(e);return new It(t)}static fromUint8Array(e){const t=(function(s){let a="";for(let l=0;l<s.length;++l)a+=String.fromCharCode(s[l]);return a})(e);return new It(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const i=new Uint8Array(t.length);for(let s=0;s<t.length;s++)i[s]=t.charCodeAt(s);return i})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return tt(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}It.EMPTY_BYTE_STRING=new It("");const qo="(default)";class ni{constructor(e,t){this.projectId=e,this.database=t||qo}static empty(){return new ni("","")}get isDefaultDatabase(){return this.database===qo}isEqual(e){return e instanceof ni&&e.projectId===this.projectId&&e.database===this.database}}function Rg(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new O(N.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ni(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pg{constructor(e,t=null,i=[],s=[],a=null,l="F",u=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=s,this.limit=a,this.limitType=l,this.startAt=u,this.endAt=g,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function kg(n){return new Pg(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zo,C;(C=zo||(zo={}))[C.OK=0]="OK",C[C.CANCELLED=1]="CANCELLED",C[C.UNKNOWN=2]="UNKNOWN",C[C.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",C[C.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",C[C.NOT_FOUND=5]="NOT_FOUND",C[C.ALREADY_EXISTS=6]="ALREADY_EXISTS",C[C.PERMISSION_DENIED=7]="PERMISSION_DENIED",C[C.UNAUTHENTICATED=16]="UNAUTHENTICATED",C[C.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",C[C.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",C[C.ABORTED=10]="ABORTED",C[C.OUT_OF_RANGE=11]="OUT_OF_RANGE",C[C.UNIMPLEMENTED=12]="UNIMPLEMENTED",C[C.INTERNAL=13]="INTERNAL",C[C.UNAVAILABLE=14]="UNAVAILABLE",C[C.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Kr([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cg=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fc=1048576;function cr(){return typeof document<"u"?document:null}class Ng{constructor(e,t,i=1e3,s=1.5,a=6e4){this.Ci=e,this.timerId=t,this.R_=i,this.A_=s,this.V_=a,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),i=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-i);s>0&&Ie("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(e,t,i,s,a){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=s,this.removalCallback=a,this.deferred=new un,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((l=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,s,a){const l=Date.now()+i,u=new Yr(e,t,l,s,a);return u.start(i),u}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new O(N.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Go,Ko;(Ko=Go||(Go={})).Ma="default",Ko.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Og(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dg="ComponentProvider",Yo=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lg="firestore.googleapis.com",Jo=!0;class Xo{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new O(N.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Lg,this.ssl=Jo}else this.host=e.host,this.ssl=e.ssl??Jo;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Cg;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Fc)throw new O(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}vg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Og(e.experimentalLongPollingOptions??{}),(function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new O(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new O(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new O(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(i,s){return i.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Mg{constructor(e,t,i,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Xo({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new O(N.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new O(N.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Xo(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(i){if(!i)return new dg;switch(i.type){case"firstParty":return new gg(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new O(N.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const i=Yo.get(t);i&&(Ie(Dg,"Removing Datastore"),Yo.delete(t),i.terminate())})(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jr{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Jr(this.firestore,e,this._query)}}class Se{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Xr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Se(this.firestore,e,this._key)}toJSON(){return{type:Se._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,i){if(Sn(t,Se._jsonSchema))return new Se(e,i||null,new ft(me.fromString(t.referencePath)))}}Se._jsonSchemaVersion="firestore/documentReference/1.0",Se._jsonSchema={type:z("string",Se._jsonSchemaVersion),referencePath:z("string")};class Xr extends Jr{constructor(e,t,i){super(e,t,kg(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Se(this.firestore,null,new ft(e))}withConverter(e){return new Xr(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qo="AsyncQueue";class Zo{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Ng(this,"async_queue_retry"),this._c=()=>{const i=cr();i&&Ie(Qo,"Visibility state changed to "+i.visibilityState),this.M_.w_()},this.ac=e;const t=cr();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=cr();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new un;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Sg(e))throw e;Ie(Qo,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((i=>{throw this.nc=i,this.rc=!1,Lc("INTERNAL UNHANDLED ERROR: ",ea(i)),i})).then((i=>(this.rc=!1,i))))));return this.ac=t,t}enqueueAfterDelay(e,t,i){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=Yr.createAndSchedule(this,e,t,i,(a=>this.hc(a)));return this.tc.push(s),s}uc(){this.nc&&ti(47125,{Pc:ea(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((t,i)=>t.targetTimeMs-i.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function ea(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class Ug extends Mg{constructor(e,t,i,s){super(e,t,i,s),this.type="firestore",this._queue=new Zo,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Zo(e),this._firestoreClient=void 0,await e}}}function K_(n,e,t){const i=it(n,"firestore");if(i.isInitialized(t)){const s=i.getImmediate({identifier:t}),a=i.getOptions(t);if(et(a,e))return s;throw new O(N.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new O(N.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Fc)throw new O(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&wn(e.host)&&Aa(e.host),i.initialize({options:e,instanceIdentifier:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Oe(It.fromBase64String(e))}catch(t){throw new O(N.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Oe(It.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Oe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Sn(e,Oe._jsonSchema))return Oe.fromBase64String(e.bytes)}}Oe._jsonSchemaVersion="firestore/bytes/1.0",Oe._jsonSchema={type:z("string",Oe._jsonSchemaVersion),bytes:z("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new O(N.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ut(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new O(N.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new O(N.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return tt(this._lat,e._lat)||tt(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:mt._jsonSchemaVersion}}static fromJSON(e){if(Sn(e,mt._jsonSchema))return new mt(e.latitude,e.longitude)}}mt._jsonSchemaVersion="firestore/geoPoint/1.0",mt._jsonSchema={type:z("string",mt._jsonSchemaVersion),latitude:z("number"),longitude:z("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(i,s){if(i.length!==s.length)return!1;for(let a=0;a<i.length;++a)if(i[a]!==s[a])return!1;return!0})(this._values,e._values)}toJSON(){return{type:_t._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Sn(e,_t._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new _t(e.vectorValues);throw new O(N.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}_t._jsonSchemaVersion="firestore/vectorValue/1.0",_t._jsonSchema={type:z("string",_t._jsonSchemaVersion),vectorValues:z("object")};function xc(n,e,t){if((e=P(e))instanceof Vc)return e._internalPath;if(typeof e=="string")return Vg(n,e);throw vr("Field path arguments must be of type string or ",n)}const Fg=new RegExp("[~\\*/\\[\\]]");function Vg(n,e,t){if(e.search(Fg)>=0)throw vr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n);try{return new Vc(...e.split("."))._internalPath}catch{throw vr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n)}}function vr(n,e,t,i,s){let a=`Function ${e}() called with invalid data`;a+=". ";let l="";return new O(N.INVALID_ARGUMENT,a+n+l)}const ta="@firebase/firestore",na="4.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jc{constructor(e,t,i,s,a){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=s,this._converter=a}get id(){return this._key.path.lastSegment()}get ref(){return new Se(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new xg(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(xc("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class xg extends jc{data(){return super.data()}}class Hn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class kt extends jc{constructor(e,t,i,s,a,l){super(e,t,i,s,l),this._firestore=e,this._firestoreImpl=e,this.metadata=a}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new zn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(xc("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new O(N.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=kt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}kt._jsonSchemaVersion="firestore/documentSnapshot/1.0",kt._jsonSchema={type:z("string",kt._jsonSchemaVersion),bundleSource:z("string","DocumentSnapshot"),bundleName:z("string"),bundle:z("string")};class zn extends kt{data(e={}){return super.data(e)}}class dn{constructor(e,t,i,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Hn(s.hasPendingWrites,s.fromCache),this.query=i}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((i=>{e.call(t,new zn(this._firestore,this._userDataWriter,i.key,i,new Hn(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new O(N.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,a){if(s._snapshot.oldDocs.isEmpty()){let l=0;return s._snapshot.docChanges.map((u=>{const g=new zn(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Hn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:g,oldIndex:-1,newIndex:l++}}))}{let l=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((u=>a||u.type!==3)).map((u=>{const g=new zn(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Hn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let _=-1,R=-1;return u.type!==0&&(_=l.indexOf(u.doc.key),l=l.delete(u.doc.key)),u.type!==1&&(l=l.add(u.doc),R=l.indexOf(u.doc.key)),{type:jg(u.type),doc:g,oldIndex:_,newIndex:R}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new O(N.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=dn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ig.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],i=[],s=[];return this.docs.forEach((a=>{a._document!==null&&(t.push(a._document),i.push(this._userDataWriter.convertObjectMap(a._document.data.value.mapValue.fields,"previous")),s.push(a.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function jg(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return ti(61501,{type:n})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */dn._jsonSchemaVersion="firestore/querySnapshot/1.0",dn._jsonSchema={type:z("string",dn._jsonSchemaVersion),bundleSource:z("string","QuerySnapshot"),bundleName:z("string"),bundle:z("string")};(function(e,t=!0){hg(Dt),pe(new he("firestore",((i,{instanceIdentifier:s,options:a})=>{const l=i.getProvider("app").getImmediate(),u=new Ug(new fg(i.getProvider("auth-internal")),new mg(l,i.getProvider("app-check-internal")),Rg(l,s),l);return a={useFetchStreams:t,...a},u._setSettings(a),u}),"PUBLIC").setMultipleInstances(!0)),re(ta,na,e),re(ta,na,"esm2020")})();const Hc="@firebase/installations",Qr="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bc=1e4,$c=`w:${Qr}`,Wc="FIS_v2",Hg="https://firebaseinstallations.googleapis.com/v1",Bg=3600*1e3,$g="installations",Wg="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qg={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},yt=new nt($g,Wg,qg);function qc(n){return n instanceof ye&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zc({projectId:n}){return`${Hg}/projects/${n}/installations`}function Gc(n){return{token:n.token,requestStatus:2,expiresIn:Gg(n.expiresIn),creationTime:Date.now()}}async function Kc(n,e){const i=(await e.json()).error;return yt.create("request-failed",{requestName:n,serverCode:i.code,serverMessage:i.message,serverStatus:i.status})}function Yc({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function zg(n,{refreshToken:e}){const t=Yc(n);return t.append("Authorization",Kg(e)),t}async function Jc(n){const e=await n();return e.status>=500&&e.status<600?n():e}function Gg(n){return Number(n.replace("s","000"))}function Kg(n){return`${Wc} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yg({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const i=zc(n),s=Yc(n),a=e.getImmediate({optional:!0});if(a){const _=await a.getHeartbeatsHeader();_&&s.append("x-firebase-client",_)}const l={fid:t,authVersion:Wc,appId:n.appId,sdkVersion:$c},u={method:"POST",headers:s,body:JSON.stringify(l)},g=await Jc(()=>fetch(i,u));if(g.ok){const _=await g.json();return{fid:_.fid||t,registrationStatus:2,refreshToken:_.refreshToken,authToken:Gc(_.authToken)}}else throw await Kc("Create Installation",g)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xc(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jg(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xg=/^[cdef][\w-]{21}$/,Ar="";function Qg(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=Zg(n);return Xg.test(t)?t:Ar}catch{return Ar}}function Zg(n){return Jg(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wi(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qc=new Map;function Zc(n,e){const t=wi(n);el(t,e),em(t,e)}function el(n,e){const t=Qc.get(n);if(t)for(const i of t)i(e)}function em(n,e){const t=tm();t&&t.postMessage({key:n,fid:e}),nm()}let pt=null;function tm(){return!pt&&"BroadcastChannel"in self&&(pt=new BroadcastChannel("[Firebase] FID Change"),pt.onmessage=n=>{el(n.data.key,n.data.fid)}),pt}function nm(){Qc.size===0&&pt&&(pt.close(),pt=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const im="firebase-installations-database",rm=1,wt="firebase-installations-store";let lr=null;function Zr(){return lr||(lr=ci(im,rm,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(wt)}}})),lr}async function ii(n,e){const t=wi(n),s=(await Zr()).transaction(wt,"readwrite"),a=s.objectStore(wt),l=await a.get(t);return await a.put(e,t),await s.done,(!l||l.fid!==e.fid)&&Zc(n,e.fid),e}async function tl(n){const e=wi(n),i=(await Zr()).transaction(wt,"readwrite");await i.objectStore(wt).delete(e),await i.done}async function Ei(n,e){const t=wi(n),s=(await Zr()).transaction(wt,"readwrite"),a=s.objectStore(wt),l=await a.get(t),u=e(l);return u===void 0?await a.delete(t):await a.put(u,t),await s.done,u&&(!l||l.fid!==u.fid)&&Zc(n,u.fid),u}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function es(n){let e;const t=await Ei(n.appConfig,i=>{const s=sm(i),a=om(n,s);return e=a.registrationPromise,a.installationEntry});return t.fid===Ar?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function sm(n){const e=n||{fid:Qg(),registrationStatus:0};return nl(e)}function om(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(yt.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},i=am(n,t);return{installationEntry:t,registrationPromise:i}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:cm(n)}:{installationEntry:e}}async function am(n,e){try{const t=await Yg(n,e);return ii(n.appConfig,t)}catch(t){throw qc(t)&&t.customData.serverCode===409?await tl(n.appConfig):await ii(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function cm(n){let e=await ia(n.appConfig);for(;e.registrationStatus===1;)await Xc(100),e=await ia(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:i}=await es(n);return i||t}return e}function ia(n){return Ei(n,e=>{if(!e)throw yt.create("installation-not-found");return nl(e)})}function nl(n){return lm(n)?{fid:n.fid,registrationStatus:0}:n}function lm(n){return n.registrationStatus===1&&n.registrationTime+Bc<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hm({appConfig:n,heartbeatServiceProvider:e},t){const i=um(n,t),s=zg(n,t),a=e.getImmediate({optional:!0});if(a){const _=await a.getHeartbeatsHeader();_&&s.append("x-firebase-client",_)}const l={installation:{sdkVersion:$c,appId:n.appId}},u={method:"POST",headers:s,body:JSON.stringify(l)},g=await Jc(()=>fetch(i,u));if(g.ok){const _=await g.json();return Gc(_)}else throw await Kc("Generate Auth Token",g)}function um(n,{fid:e}){return`${zc(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ts(n,e=!1){let t;const i=await Ei(n.appConfig,a=>{if(!il(a))throw yt.create("not-registered");const l=a.authToken;if(!e&&pm(l))return a;if(l.requestStatus===1)return t=dm(n,e),a;{if(!navigator.onLine)throw yt.create("app-offline");const u=mm(a);return t=fm(n,u),u}});return t?await t:i.authToken}async function dm(n,e){let t=await ra(n.appConfig);for(;t.authToken.requestStatus===1;)await Xc(100),t=await ra(n.appConfig);const i=t.authToken;return i.requestStatus===0?ts(n,e):i}function ra(n){return Ei(n,e=>{if(!il(e))throw yt.create("not-registered");const t=e.authToken;return _m(t)?{...e,authToken:{requestStatus:0}}:e})}async function fm(n,e){try{const t=await hm(n,e),i={...e,authToken:t};return await ii(n.appConfig,i),t}catch(t){if(qc(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await tl(n.appConfig);else{const i={...e,authToken:{requestStatus:0}};await ii(n.appConfig,i)}throw t}}function il(n){return n!==void 0&&n.registrationStatus===2}function pm(n){return n.requestStatus===2&&!gm(n)}function gm(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Bg}function mm(n){const e={requestStatus:1,requestTime:Date.now()};return{...n,authToken:e}}function _m(n){return n.requestStatus===1&&n.requestTime+Bc<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Im(n){const e=n,{installationEntry:t,registrationPromise:i}=await es(e);return i?i.catch(console.error):ts(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ym(n,e=!1){const t=n;return await wm(t),(await ts(t,e)).token}async function wm(n){const{registrationPromise:e}=await es(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Em(n){if(!n||!n.options)throw hr("App Configuration");if(!n.name)throw hr("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw hr(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function hr(n){return yt.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rl="installations",Tm="installations-internal",vm=n=>{const e=n.getProvider("app").getImmediate(),t=Em(e),i=it(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:i,_delete:()=>Promise.resolve()}},Am=n=>{const e=n.getProvider("app").getImmediate(),t=it(e,rl).getImmediate();return{getId:()=>Im(t),getToken:s=>ym(t,s)}};function Sm(){pe(new he(rl,vm,"PUBLIC")),pe(new he(Tm,Am,"PRIVATE"))}Sm();re(Hc,Qr);re(Hc,Qr,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ri="analytics",bm="firebase_id",Rm="origin",Pm=60*1e3,km="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",ns="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const te=new ai("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cm={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},le=new nt("analytics","Analytics",Cm);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nm(n){if(!n.startsWith(ns)){const e=le.create("invalid-gtag-resource",{gtagURL:n});return te.warn(e.message),""}return n}function sl(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function Om(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function Dm(n,e){const t=Om("firebase-js-sdk-policy",{createScriptURL:Nm}),i=document.createElement("script"),s=`${ns}?l=${n}&id=${e}`;i.src=t?t==null?void 0:t.createScriptURL(s):s,i.async=!0,document.head.appendChild(i)}function Lm(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function Mm(n,e,t,i,s,a){const l=i[s];try{if(l)await e[l];else{const g=(await sl(t)).find(_=>_.measurementId===s);g&&await e[g.appId]}}catch(u){te.error(u)}n("config",s,a)}async function Um(n,e,t,i,s){try{let a=[];if(s&&s.send_to){let l=s.send_to;Array.isArray(l)||(l=[l]);const u=await sl(t);for(const g of l){const _=u.find(b=>b.measurementId===g),R=_&&e[_.appId];if(R)a.push(R);else{a=[];break}}}a.length===0&&(a=Object.values(e)),await Promise.all(a),n("event",i,s||{})}catch(a){te.error(a)}}function Fm(n,e,t,i){async function s(a,...l){try{if(a==="event"){const[u,g]=l;await Um(n,e,t,u,g)}else if(a==="config"){const[u,g]=l;await Mm(n,e,t,i,u,g)}else if(a==="consent"){const[u,g]=l;n("consent",u,g)}else if(a==="get"){const[u,g,_]=l;n("get",u,g,_)}else if(a==="set"){const[u]=l;n("set",u)}else n(a,...l)}catch(u){te.error(u)}}return s}function Vm(n,e,t,i,s){let a=function(...l){window[i].push(arguments)};return window[s]&&typeof window[s]=="function"&&(a=window[s]),window[s]=Fm(a,n,e,t),{gtagCore:a,wrappedGtag:window[s]}}function xm(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(ns)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jm=30,Hm=1e3;class Bm{constructor(e={},t=Hm){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const ol=new Bm;function $m(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Wm(n){var l;const{appId:e,apiKey:t}=n,i={method:"GET",headers:$m(t)},s=km.replace("{app-id}",e),a=await fetch(s,i);if(a.status!==200&&a.status!==304){let u="";try{const g=await a.json();(l=g.error)!=null&&l.message&&(u=g.error.message)}catch{}throw le.create("config-fetch-failed",{httpStatus:a.status,responseMessage:u})}return a.json()}async function qm(n,e=ol,t){const{appId:i,apiKey:s,measurementId:a}=n.options;if(!i)throw le.create("no-app-id");if(!s){if(a)return{measurementId:a,appId:i};throw le.create("no-api-key")}const l=e.getThrottleMetadata(i)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new Km;return setTimeout(async()=>{u.abort()},Pm),al({appId:i,apiKey:s,measurementId:a},l,u,e)}async function al(n,{throttleEndTimeMillis:e,backoffCount:t},i,s=ol){var u;const{appId:a,measurementId:l}=n;try{await zm(i,e)}catch(g){if(l)return te.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${g==null?void 0:g.message}]`),{appId:a,measurementId:l};throw g}try{const g=await Wm(n);return s.deleteThrottleMetadata(a),g}catch(g){const _=g;if(!Gm(_)){if(s.deleteThrottleMetadata(a),l)return te.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${_==null?void 0:_.message}]`),{appId:a,measurementId:l};throw g}const R=Number((u=_==null?void 0:_.customData)==null?void 0:u.httpStatus)===503?lo(t,s.intervalMillis,jm):lo(t,s.intervalMillis),b={throttleEndTimeMillis:Date.now()+R,backoffCount:t+1};return s.setThrottleMetadata(a,b),te.debug(`Calling attemptFetch again in ${R} millis`),al(n,b,i,s)}}function zm(n,e){return new Promise((t,i)=>{const s=Math.max(e-Date.now(),0),a=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(a),i(le.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function Gm(n){if(!(n instanceof ye)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class Km{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function Ym(n,e,t,i,s){if(s&&s.global){n("event",t,i);return}else{const a=await e,l={...i,send_to:a};n("event",t,l)}}async function Jm(n,e,t,i){if(i&&i.global){const s={};for(const a of Object.keys(t))s[`user_properties.${a}`]=t[a];return n("set",s),Promise.resolve()}else{const s=await e;n("config",s,{update:!0,user_properties:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xm(){if(si())try{await oi()}catch(n){return te.warn(le.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return te.warn(le.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Qm(n,e,t,i,s,a,l){const u=qm(n);u.then(S=>{t[S.measurementId]=S.appId,n.options.measurementId&&S.measurementId!==n.options.measurementId&&te.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${S.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(S=>te.error(S)),e.push(u);const g=Xm().then(S=>{if(S)return i.getId()}),[_,R]=await Promise.all([u,g]);xm(a)||Dm(a,_.measurementId),s("js",new Date);const b=(l==null?void 0:l.config)??{};return b[Rm]="firebase",b.update=!0,R!=null&&(b[bm]=R),s("config",_.measurementId,b),_.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(e){this.app=e}_delete(){return delete Ct[this.app.options.appId],Promise.resolve()}}let Ct={},sa=[];const oa={};let ur="dataLayer",e_="gtag",aa,is,ca=!1;function t_(){const n=[];if(br()&&n.push("This is a browser extension environment."),Rr()||n.push("Cookies are not available."),n.length>0){const e=n.map((i,s)=>`(${s+1}) ${i}`).join(" "),t=le.create("invalid-analytics-context",{errorInfo:e});te.warn(t.message)}}function n_(n,e,t){t_();const i=n.options.appId;if(!i)throw le.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)te.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw le.create("no-api-key");if(Ct[i]!=null)throw le.create("already-exists",{id:i});if(!ca){Lm(ur);const{wrappedGtag:a,gtagCore:l}=Vm(Ct,sa,oa,ur,e_);is=a,aa=l,ca=!0}return Ct[i]=Qm(n,sa,oa,e,aa,ur,t),new Zm(n)}function Y_(n=kr()){n=P(n);const e=it(n,ri);return e.isInitialized()?e.getImmediate():i_(n)}function i_(n,e={}){const t=it(n,ri);if(t.isInitialized()){const s=t.getImmediate();if(et(e,t.getOptions()))return s;throw le.create("already-initialized")}return t.initialize({options:e})}async function J_(){if(br()||!Rr()||!si())return!1;try{return await oi()}catch{return!1}}function r_(n,e,t){n=P(n),Jm(is,Ct[n.app.options.appId],e,t).catch(i=>te.error(i))}function s_(n,e,t,i){n=P(n),Ym(is,Ct[n.app.options.appId],e,t,i).catch(s=>te.error(s))}const la="@firebase/analytics",ha="0.10.19";function o_(){pe(new he(ri,(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return n_(i,s,t)},"PUBLIC")),pe(new he("analytics-internal",n,"PRIVATE")),re(la,ha),re(la,ha,"esm2020");function n(e){try{const t=e.getProvider(ri).getImmediate();return{logEvent:(i,s,a)=>s_(t,i,s,a),setUserProperties:(i,s)=>r_(t,i,s)}}catch(t){throw le.create("interop-component-reg-failed",{reason:t})}}}o_();/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a_="/firebase-messaging-sw.js",c_="/firebase-cloud-messaging-push-scope",cl="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",l_="https://fcmregistrations.googleapis.com/v1",ll="google.c.a.c_id",h_="google.c.a.c_l",u_="google.c.a.ts",d_="google.c.a.e",ua=1e4;var da;(function(n){n[n.DATA_MESSAGE=1]="DATA_MESSAGE",n[n.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(da||(da={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var In;(function(n){n.PUSH_RECEIVED="push-received",n.NOTIFICATION_CLICKED="notification-clicked"})(In||(In={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Re(n){const e=new Uint8Array(n);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function f_(n){const e="=".repeat((4-n.length%4)%4),t=(n+e).replace(/\-/g,"+").replace(/_/g,"/"),i=atob(t),s=new Uint8Array(i.length);for(let a=0;a<i.length;++a)s[a]=i.charCodeAt(a);return s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dr="fcm_token_details_db",p_=5,fa="fcm_token_object_Store";async function g_(n){if("databases"in indexedDB&&!(await indexedDB.databases()).map(a=>a.name).includes(dr))return null;let e=null;return(await ci(dr,p_,{upgrade:async(i,s,a,l)=>{if(s<2||!i.objectStoreNames.contains(fa))return;const u=l.objectStore(fa),g=await u.index("fcmSenderId").get(n);if(await u.clear(),!!g){if(s===2){const _=g;if(!_.auth||!_.p256dh||!_.endpoint)return;e={token:_.fcmToken,createTime:_.createTime??Date.now(),subscriptionOptions:{auth:_.auth,p256dh:_.p256dh,endpoint:_.endpoint,swScope:_.swScope,vapidKey:typeof _.vapidKey=="string"?_.vapidKey:Re(_.vapidKey)}}}else if(s===3){const _=g;e={token:_.fcmToken,createTime:_.createTime,subscriptionOptions:{auth:Re(_.auth),p256dh:Re(_.p256dh),endpoint:_.endpoint,swScope:_.swScope,vapidKey:Re(_.vapidKey)}}}else if(s===4){const _=g;e={token:_.fcmToken,createTime:_.createTime,subscriptionOptions:{auth:Re(_.auth),p256dh:Re(_.p256dh),endpoint:_.endpoint,swScope:_.swScope,vapidKey:Re(_.vapidKey)}}}}}})).close(),await Xi(dr),await Xi("fcm_vapid_details_db"),await Xi("undefined"),m_(e)?e:null}function m_(n){if(!n||!n.subscriptionOptions)return!1;const{subscriptionOptions:e}=n;return typeof n.createTime=="number"&&n.createTime>0&&typeof n.token=="string"&&n.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const __="firebase-messaging-database",I_=1,yn="firebase-messaging-store";let fr=null;function hl(){return fr||(fr=ci(__,I_,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(yn)}}})),fr}async function y_(n){const e=ul(n),i=await(await hl()).transaction(yn).objectStore(yn).get(e);if(i)return i;{const s=await g_(n.appConfig.senderId);if(s)return await rs(n,s),s}}async function rs(n,e){const t=ul(n),s=(await hl()).transaction(yn,"readwrite");return await s.objectStore(yn).put(e,t),await s.done,e}function ul({appConfig:n}){return n.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w_={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},X=new nt("messaging","Messaging",w_);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function E_(n,e){const t=await os(n),i=dl(e),s={method:"POST",headers:t,body:JSON.stringify(i)};let a;try{a=await(await fetch(ss(n.appConfig),s)).json()}catch(l){throw X.create("token-subscribe-failed",{errorInfo:l==null?void 0:l.toString()})}if(a.error){const l=a.error.message;throw X.create("token-subscribe-failed",{errorInfo:l})}if(!a.token)throw X.create("token-subscribe-no-token");return a.token}async function T_(n,e){const t=await os(n),i=dl(e.subscriptionOptions),s={method:"PATCH",headers:t,body:JSON.stringify(i)};let a;try{a=await(await fetch(`${ss(n.appConfig)}/${e.token}`,s)).json()}catch(l){throw X.create("token-update-failed",{errorInfo:l==null?void 0:l.toString()})}if(a.error){const l=a.error.message;throw X.create("token-update-failed",{errorInfo:l})}if(!a.token)throw X.create("token-update-no-token");return a.token}async function v_(n,e){const i={method:"DELETE",headers:await os(n)};try{const a=await(await fetch(`${ss(n.appConfig)}/${e}`,i)).json();if(a.error){const l=a.error.message;throw X.create("token-unsubscribe-failed",{errorInfo:l})}}catch(s){throw X.create("token-unsubscribe-failed",{errorInfo:s==null?void 0:s.toString()})}}function ss({projectId:n}){return`${l_}/projects/${n}/registrations`}async function os({appConfig:n,installations:e}){const t=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n.apiKey,"x-goog-firebase-installations-auth":`FIS ${t}`})}function dl({p256dh:n,auth:e,endpoint:t,vapidKey:i}){const s={web:{endpoint:t,auth:e,p256dh:n}};return i!==cl&&(s.web.applicationPubKey=i),s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A_=10080*60*1e3;async function S_(n){const e=await R_(n.swRegistration,n.vapidKey),t={vapidKey:n.vapidKey,swScope:n.swRegistration.scope,endpoint:e.endpoint,auth:Re(e.getKey("auth")),p256dh:Re(e.getKey("p256dh"))},i=await y_(n.firebaseDependencies);if(i){if(P_(i.subscriptionOptions,t))return Date.now()>=i.createTime+A_?b_(n,{token:i.token,createTime:Date.now(),subscriptionOptions:t}):i.token;try{await v_(n.firebaseDependencies,i.token)}catch(s){console.warn(s)}return pa(n.firebaseDependencies,t)}else return pa(n.firebaseDependencies,t)}async function b_(n,e){try{const t=await T_(n.firebaseDependencies,e),i={...e,token:t,createTime:Date.now()};return await rs(n.firebaseDependencies,i),t}catch(t){throw t}}async function pa(n,e){const i={token:await E_(n,e),createTime:Date.now(),subscriptionOptions:e};return await rs(n,i),i.token}async function R_(n,e){const t=await n.pushManager.getSubscription();return t||n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:f_(e)})}function P_(n,e){const t=e.vapidKey===n.vapidKey,i=e.endpoint===n.endpoint,s=e.auth===n.auth,a=e.p256dh===n.p256dh;return t&&i&&s&&a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ga(n){const e={from:n.from,collapseKey:n.collapse_key,messageId:n.fcmMessageId};return k_(e,n),C_(e,n),N_(e,n),e}function k_(n,e){if(!e.notification)return;n.notification={};const t=e.notification.title;t&&(n.notification.title=t);const i=e.notification.body;i&&(n.notification.body=i);const s=e.notification.image;s&&(n.notification.image=s);const a=e.notification.icon;a&&(n.notification.icon=a)}function C_(n,e){e.data&&(n.data=e.data)}function N_(n,e){var s,a,l,u;if(!e.fcmOptions&&!((s=e.notification)!=null&&s.click_action))return;n.fcmOptions={};const t=((a=e.fcmOptions)==null?void 0:a.link)??((l=e.notification)==null?void 0:l.click_action);t&&(n.fcmOptions.link=t);const i=(u=e.fcmOptions)==null?void 0:u.analytics_label;i&&(n.fcmOptions.analyticsLabel=i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O_(n){return typeof n=="object"&&!!n&&ll in n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D_(n){if(!n||!n.options)throw pr("App Configuration Object");if(!n.name)throw pr("App Name");const e=["projectId","apiKey","appId","messagingSenderId"],{options:t}=n;for(const i of e)if(!t[i])throw pr(i);return{appName:n.name,projectId:t.projectId,apiKey:t.apiKey,appId:t.appId,senderId:t.messagingSenderId}}function pr(n){return X.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L_{constructor(e,t,i){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const s=D_(e);this.firebaseDependencies={app:e,appConfig:s,installations:t,analyticsProvider:i}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function M_(n){try{n.swRegistration=await navigator.serviceWorker.register(a_,{scope:c_}),n.swRegistration.update().catch(()=>{}),await U_(n.swRegistration)}catch(e){throw X.create("failed-service-worker-registration",{browserErrorMessage:e==null?void 0:e.message})}}async function U_(n){return new Promise((e,t)=>{const i=setTimeout(()=>t(new Error(`Service worker not registered after ${ua} ms`)),ua),s=n.installing||n.waiting;n.active?(clearTimeout(i),e()):s?s.onstatechange=a=>{var l;((l=a.target)==null?void 0:l.state)==="activated"&&(s.onstatechange=null,clearTimeout(i),e())}:(clearTimeout(i),t(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function F_(n,e){if(!e&&!n.swRegistration&&await M_(n),!(!e&&n.swRegistration)){if(!(e instanceof ServiceWorkerRegistration))throw X.create("invalid-sw-registration");n.swRegistration=e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V_(n,e){e?n.vapidKey=e:n.vapidKey||(n.vapidKey=cl)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fl(n,e){if(!navigator)throw X.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw X.create("permission-blocked");return await V_(n,e==null?void 0:e.vapidKey),await F_(n,e==null?void 0:e.serviceWorkerRegistration),S_(n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function x_(n,e,t){const i=j_(e);(await n.firebaseDependencies.analyticsProvider.get()).logEvent(i,{message_id:t[ll],message_name:t[h_],message_time:t[u_],message_device_time:Math.floor(Date.now()/1e3)})}function j_(n){switch(n){case In.NOTIFICATION_CLICKED:return"notification_open";case In.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function H_(n,e){const t=e.data;if(!t.isFirebaseMessaging)return;n.onMessageHandler&&t.messageType===In.PUSH_RECEIVED&&(typeof n.onMessageHandler=="function"?n.onMessageHandler(ga(t)):n.onMessageHandler.next(ga(t)));const i=t.data;O_(i)&&i[d_]==="1"&&await x_(n,t.messageType,i)}const ma="@firebase/messaging",_a="0.12.23";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B_=n=>{const e=new L_(n.getProvider("app").getImmediate(),n.getProvider("installations-internal").getImmediate(),n.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",t=>H_(e,t)),e},$_=n=>{const e=n.getProvider("messaging").getImmediate();return{getToken:i=>fl(e,i)}};function W_(){pe(new he("messaging",B_,"PUBLIC")),pe(new he("messaging-internal",$_,"PRIVATE")),re(ma,_a),re(ma,_a,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function q_(){try{await oi()}catch{return!1}return typeof window<"u"&&si()&&Rr()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z_(n,e){if(!navigator)throw X.create("only-available-in-window");return n.onMessageHandler=e,()=>{n.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X_(n=kr()){return q_().then(e=>{if(!e)throw X.create("unsupported-browser")},e=>{throw X.create("indexed-db-unsupported")}),it(P(n),"messaging").getImmediate()}async function Q_(n,e){return n=P(n),fl(n,e)}function Z_(n,e){return n=P(n),z_(n,e)}W_();export{rt as E,X_ as a,K_ as b,J_ as c,Y_ as d,Q_ as e,Zd as f,cg as g,ef as h,yu as i,Yd as j,G_ as k,Z_ as o,lc as r,Sf as s,df as u};
