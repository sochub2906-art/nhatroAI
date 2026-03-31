const Ah=()=>{};var zs={};/**
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
 */const Xo=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Sh=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const a=n[t++];e[r++]=String.fromCharCode((s&31)<<6|a&63)}else if(s>239&&s<365){const a=n[t++],h=n[t++],u=n[t++],g=((s&7)<<18|(a&63)<<12|(h&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(g>>10)),e[r++]=String.fromCharCode(56320+(g&1023))}else{const a=n[t++],h=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(a&63)<<6|h&63)}}return e.join("")},Qo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const a=n[s],h=s+1<n.length,u=h?n[s+1]:0,g=s+2<n.length,E=g?n[s+2]:0,R=a>>2,b=(a&3)<<4|u>>4;let S=(u&15)<<2|E>>6,M=E&63;g||(M=64,h||(S=64)),r.push(t[R],t[b],t[S],t[M])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Xo(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Sh(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const a=t[n.charAt(s++)],u=s<n.length?t[n.charAt(s)]:0;++s;const E=s<n.length?t[n.charAt(s)]:64;++s;const b=s<n.length?t[n.charAt(s)]:64;if(++s,a==null||u==null||E==null||b==null)throw new bh;const S=a<<2|u>>4;if(r.push(S),E!==64){const M=u<<4&240|E>>2;if(r.push(M),b!==64){const U=E<<6&192|b;r.push(U)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class bh extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Rh=function(n){const e=Xo(n);return Qo.encodeByteArray(e,!0)},Zo=function(n){return Rh(n).replace(/\./g,"")},ea=function(n){try{return Qo.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Ph(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Ch=()=>Ph().__FIREBASE_DEFAULTS__,kh=()=>{if(typeof process>"u"||typeof zs>"u")return;const n=zs.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Nh=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&ea(n[1]);return e&&JSON.parse(e)},pr=()=>{try{return Ah()||Ch()||kh()||Nh()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Oh=n=>{var e,t;return(t=(e=pr())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},ta=()=>{var n;return(n=pr())==null?void 0:n.config},na=n=>{var e;return(e=pr())==null?void 0:e[`_${n}`]};/**
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
 */class Dh{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function mn(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ia(n){return(await fetch(n,{credentials:"include"})).ok}const nn={};function Lh(){const n={prod:[],emulator:[]};for(const e of Object.keys(nn))nn[e]?n.emulator.push(e):n.prod.push(e);return n}function Mh(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let Gs=!1;function Uh(n,e){if(typeof window>"u"||typeof document>"u"||!mn(window.location.host)||nn[n]===e||nn[n]||Gs)return;nn[n]=e;function t(S){return`__firebase__banner__${S}`}const r="__firebase__banner",a=Lh().prod.length>0;function h(){const S=document.getElementById(r);S&&S.remove()}function u(S){S.style.display="flex",S.style.background="#7faaf0",S.style.position="fixed",S.style.bottom="5px",S.style.left="5px",S.style.padding=".5em",S.style.borderRadius="5px",S.style.alignItems="center"}function g(S,M){S.setAttribute("width","24"),S.setAttribute("id",M),S.setAttribute("height","24"),S.setAttribute("viewBox","0 0 24 24"),S.setAttribute("fill","none"),S.style.marginLeft="-6px"}function E(){const S=document.createElement("span");return S.style.cursor="pointer",S.style.marginLeft="16px",S.style.fontSize="24px",S.innerHTML=" &times;",S.onclick=()=>{Gs=!0,h()},S}function R(S,M){S.setAttribute("id",M),S.innerText="Learn more",S.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",S.setAttribute("target","__blank"),S.style.paddingLeft="5px",S.style.textDecoration="underline"}function b(){const S=Mh(r),M=t("text"),U=document.getElementById(M)||document.createElement("span"),W=t("learnmore"),j=document.getElementById(W)||document.createElement("a"),re=t("preprendIcon"),se=document.getElementById(re)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(S.created){const ce=S.element;u(ce),R(j,W);const xe=E();g(se,re),ce.append(se,U,j,xe),document.body.appendChild(ce)}a?(U.innerText="Preview backend disconnected.",se.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(se.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
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
 */function te(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Fh(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(te())}function Vh(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function gr(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function xh(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function jh(){const n=te();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function mr(){try{return typeof indexedDB=="object"}catch{return!1}}function _r(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var a;e(((a=s.error)==null?void 0:a.message)||"")}}catch(t){e(t)}})}function ra(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const Hh="FirebaseError";class _e extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Hh,Object.setPrototypeOf(this,_e.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,_t.prototype.create)}}class _t{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,a=this.errors[e],h=a?Bh(a,r):"Error",u=`${this.serviceName}: ${h} (${s}).`;return new _e(s,u,r)}}function Bh(n,e){return n.replace($h,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const $h=/\{\$([^}]+)}/g;function Wh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Qe(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const a=n[s],h=e[s];if(Ks(a)&&Ks(h)){if(!Qe(a,h))return!1}else if(a!==h)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function Ks(n){return n!==null&&typeof n=="object"}/**
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
 */function kt(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Zt(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,a]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(a)}}),e}function en(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function qh(n,e){const t=new zh(n,e);return t.subscribe.bind(t)}class zh{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Gh(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Hi),s.error===void 0&&(s.error=Hi),s.complete===void 0&&(s.complete=Hi);const a=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),a}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Gh(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Hi(){}/**
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
 */const Kh=1e3,Yh=2,Jh=14400*1e3,Xh=.5;function Ys(n,e=Kh,t=Yh){const r=e*Math.pow(t,n),s=Math.round(Xh*r*(Math.random()-.5)*2);return Math.min(Jh,r+s)}/**
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
 */function P(n){return n&&n._delegate?n._delegate:n}class me{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const ot="[DEFAULT]";/**
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
 */class Qh{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Dh;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(el(e))try{this.getOrInitializeService({instanceIdentifier:ot})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const a=this.getOrInitializeService({instanceIdentifier:s});r.resolve(a)}catch{}}}}clearInstance(e=ot){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ot){return this.instances.has(e)}getOptions(e=ot){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[a,h]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(a);r===u&&h.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const a=this.instances.get(r);return a&&e(a,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Zh(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=ot){return this.component?this.component.multipleInstances?e:ot:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Zh(n){return n===ot?void 0:n}function el(n){return n.instantiationMode==="EAGER"}/**
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
 */class tl{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Qh(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var D;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(D||(D={}));const nl={debug:D.DEBUG,verbose:D.VERBOSE,info:D.INFO,warn:D.WARN,error:D.ERROR,silent:D.SILENT},il=D.INFO,rl={[D.DEBUG]:"log",[D.VERBOSE]:"log",[D.INFO]:"info",[D.WARN]:"warn",[D.ERROR]:"error"},sl=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=rl[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ti{constructor(e){this.name=e,this._logLevel=il,this._logHandler=sl,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in D))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?nl[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,D.DEBUG,...e),this._logHandler(this,D.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,D.VERBOSE,...e),this._logHandler(this,D.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,D.INFO,...e),this._logHandler(this,D.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,D.WARN,...e),this._logHandler(this,D.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,D.ERROR,...e),this._logHandler(this,D.ERROR,...e)}}const ol=(n,e)=>e.some(t=>n instanceof t);let Js,Xs;function al(){return Js||(Js=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function cl(){return Xs||(Xs=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const sa=new WeakMap,rr=new WeakMap,oa=new WeakMap,Bi=new WeakMap,Ir=new WeakMap;function hl(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",a),n.removeEventListener("error",h)},a=()=>{t(Ke(n.result)),s()},h=()=>{r(n.error),s()};n.addEventListener("success",a),n.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&sa.set(t,n)}).catch(()=>{}),Ir.set(e,n),e}function ll(n){if(rr.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",a),n.removeEventListener("error",h),n.removeEventListener("abort",h)},a=()=>{t(),s()},h=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",a),n.addEventListener("error",h),n.addEventListener("abort",h)});rr.set(n,e)}let sr={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return rr.get(n);if(e==="objectStoreNames")return n.objectStoreNames||oa.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Ke(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ul(n){sr=n(sr)}function dl(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call($i(this),e,...t);return oa.set(r,e.sort?e.sort():[e]),Ke(r)}:cl().includes(n)?function(...e){return n.apply($i(this),e),Ke(sa.get(this))}:function(...e){return Ke(n.apply($i(this),e))}}function fl(n){return typeof n=="function"?dl(n):(n instanceof IDBTransaction&&ll(n),ol(n,al())?new Proxy(n,sr):n)}function Ke(n){if(n instanceof IDBRequest)return hl(n);if(Bi.has(n))return Bi.get(n);const e=fl(n);return e!==n&&(Bi.set(n,e),Ir.set(e,n)),e}const $i=n=>Ir.get(n);function aa(n,e,{blocked:t,upgrade:r,blocking:s,terminated:a}={}){const h=indexedDB.open(n,e),u=Ke(h);return r&&h.addEventListener("upgradeneeded",g=>{r(Ke(h.result),g.oldVersion,g.newVersion,Ke(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),u.then(g=>{a&&g.addEventListener("close",()=>a()),s&&g.addEventListener("versionchange",E=>s(E.oldVersion,E.newVersion,E))}).catch(()=>{}),u}const pl=["get","getKey","getAll","getAllKeys","count"],gl=["put","add","delete","clear"],Wi=new Map;function Qs(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Wi.get(e))return Wi.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=gl.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||pl.includes(t)))return;const a=async function(h,...u){const g=this.transaction(h,s?"readwrite":"readonly");let E=g.store;return r&&(E=E.index(u.shift())),(await Promise.all([E[t](...u),s&&g.done]))[0]};return Wi.set(e,a),a}ul(n=>({...n,get:(e,t,r)=>Qs(e,t)||n.get(e,t,r),has:(e,t)=>!!Qs(e,t)||n.has(e,t)}));/**
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
 */class ml{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(_l(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function _l(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const or="@firebase/app",Zs="0.14.8";/**
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
 */const Le=new ti("@firebase/app"),Il="@firebase/app-compat",yl="@firebase/analytics-compat",wl="@firebase/analytics",El="@firebase/app-check-compat",Tl="@firebase/app-check",vl="@firebase/auth",Al="@firebase/auth-compat",Sl="@firebase/database",bl="@firebase/data-connect",Rl="@firebase/database-compat",Pl="@firebase/functions",Cl="@firebase/functions-compat",kl="@firebase/installations",Nl="@firebase/installations-compat",Ol="@firebase/messaging",Dl="@firebase/messaging-compat",Ll="@firebase/performance",Ml="@firebase/performance-compat",Ul="@firebase/remote-config",Fl="@firebase/remote-config-compat",Vl="@firebase/storage",xl="@firebase/storage-compat",jl="@firebase/firestore",Hl="@firebase/ai",Bl="@firebase/firestore-compat",$l="firebase",Wl="12.9.0";/**
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
 */const ar="[DEFAULT]",ql={[or]:"fire-core",[Il]:"fire-core-compat",[wl]:"fire-analytics",[yl]:"fire-analytics-compat",[Tl]:"fire-app-check",[El]:"fire-app-check-compat",[vl]:"fire-auth",[Al]:"fire-auth-compat",[Sl]:"fire-rtdb",[bl]:"fire-data-connect",[Rl]:"fire-rtdb-compat",[Pl]:"fire-fn",[Cl]:"fire-fn-compat",[kl]:"fire-iid",[Nl]:"fire-iid-compat",[Ol]:"fire-fcm",[Dl]:"fire-fcm-compat",[Ll]:"fire-perf",[Ml]:"fire-perf-compat",[Ul]:"fire-rc",[Fl]:"fire-rc-compat",[Vl]:"fire-gcs",[xl]:"fire-gcs-compat",[jl]:"fire-fst",[Bl]:"fire-fst-compat",[Hl]:"fire-vertex","fire-js":"fire-js",[$l]:"fire-js-all"};/**
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
 */const $n=new Map,zl=new Map,cr=new Map;function eo(n,e){try{n.container.addComponent(e)}catch(t){Le.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ae(n){const e=n.name;if(cr.has(e))return Le.debug(`There were multiple attempts to register component ${e}.`),!1;cr.set(e,n);for(const t of $n.values())eo(t,n);for(const t of zl.values())eo(t,n);return!0}function It(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function H(n){return n==null?!1:n.settings!==void 0}/**
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
 */const Gl={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ye=new _t("app","Firebase",Gl);/**
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
 */class Kl{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new me("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ye.create("app-deleted",{appName:this._name})}}/**
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
 */const Nt=Wl;function Yl(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:ar,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw Ye.create("bad-app-name",{appName:String(s)});if(t||(t=ta()),!t)throw Ye.create("no-options");const a=$n.get(s);if(a){if(Qe(t,a.options)&&Qe(r,a.config))return a;throw Ye.create("duplicate-app",{appName:s})}const h=new tl(s);for(const g of cr.values())h.addComponent(g);const u=new Kl(t,r,h);return $n.set(s,u),u}function ca(n=ar){const e=$n.get(n);if(!e&&n===ar&&ta())return Yl();if(!e)throw Ye.create("no-app",{appName:n});return e}function ue(n,e,t){let r=ql[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const h=[`Unable to register library "${r}" with version "${e}":`];s&&h.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&a&&h.push("and"),a&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Le.warn(h.join(" "));return}Ae(new me(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Jl="firebase-heartbeat-database",Xl=1,un="firebase-heartbeat-store";let qi=null;function ha(){return qi||(qi=aa(Jl,Xl,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(un)}catch(t){console.warn(t)}}}}).catch(n=>{throw Ye.create("idb-open",{originalErrorMessage:n.message})})),qi}async function Ql(n){try{const t=(await ha()).transaction(un),r=await t.objectStore(un).get(la(n));return await t.done,r}catch(e){if(e instanceof _e)Le.warn(e.message);else{const t=Ye.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Le.warn(t.message)}}}async function to(n,e){try{const r=(await ha()).transaction(un,"readwrite");await r.objectStore(un).put(e,la(n)),await r.done}catch(t){if(t instanceof _e)Le.warn(t.message);else{const r=Ye.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Le.warn(r.message)}}}function la(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Zl=1024,eu=30;class tu{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new iu(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=no();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(h=>h.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:s}),this._heartbeatsCache.heartbeats.length>eu){const h=ru(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Le.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=no(),{heartbeatsToSend:r,unsentEntries:s}=nu(this._heartbeatsCache.heartbeats),a=Zo(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(t){return Le.warn(t),""}}}function no(){return new Date().toISOString().substring(0,10)}function nu(n,e=Zl){const t=[];let r=n.slice();for(const s of n){const a=t.find(h=>h.agent===s.agent);if(a){if(a.dates.push(s.date),io(t)>e){a.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),io(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class iu{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return mr()?_r().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Ql(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return to(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return to(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function io(n){return Zo(JSON.stringify({version:2,heartbeats:n})).length}function ru(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
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
 */function su(n){Ae(new me("platform-logger",e=>new ml(e),"PRIVATE")),Ae(new me("heartbeat",e=>new tu(e),"PRIVATE")),ue(or,Zs,n),ue(or,Zs,"esm2020"),ue("fire-js","")}su("");var ou="firebase",au="12.9.0";/**
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
 */ue(ou,au,"app");/**
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
 */const cu={PHONE:"phone",TOTP:"totp"},hu={FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",PHONE:"phone",TWITTER:"twitter.com"},lu={EMAIL_LINK:"emailLink",EMAIL_PASSWORD:"password",FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PHONE:"phone",TWITTER:"twitter.com"},uu={LINK:"link",REAUTHENTICATE:"reauthenticate",SIGN_IN:"signIn"},du={EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"};/**
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
 */function fu(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements.","invalid-hosting-link-domain":"The provided Hosting link domain is not configured in Firebase Hosting or is not owned by the current project. This cannot be a default Hosting domain (`web.app` or `firebaseapp.com`)."}}function ua(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const pu=fu,da=ua,fa=new _t("auth","Firebase",ua()),gu={ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_PASSWORD:"auth/missing-password",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type",INVALID_HOSTING_LINK_DOMAIN:"auth/invalid-hosting-link-domain"};/**
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
 */const Wn=new ti("@firebase/auth");function mu(n,...e){Wn.logLevel<=D.WARN&&Wn.warn(`Auth (${Nt}): ${n}`,...e)}function Vn(n,...e){Wn.logLevel<=D.ERROR&&Wn.error(`Auth (${Nt}): ${n}`,...e)}/**
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
 */function ie(n,...e){throw wr(n,...e)}function Z(n,...e){return wr(n,...e)}function yr(n,e,t){const r={...da(),[e]:t};return new _t("auth","Firebase",r).create(e,{appName:n.name})}function Y(n){return yr(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ot(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&ie(n,"argument-error"),yr(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function wr(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return fa.create(n,...e)}function v(n,e,...t){if(!n)throw wr(e,...t)}function Te(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Vn(e),new Error(e)}function Me(n,e){n||Te(e)}/**
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
 */function dn(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function Er(){return ro()==="http:"||ro()==="https:"}function ro(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
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
 */function _u(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Er()||gr()||"connection"in navigator)?navigator.onLine:!0}function Iu(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class _n{constructor(e,t){this.shortDelay=e,this.longDelay=t,Me(t>e,"Short delay should be less than long delay!"),this.isMobile=Fh()||xh()}get(){return _u()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Tr(n,e){Me(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class pa{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Te("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Te("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Te("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const yu={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const wu=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Eu=new _n(3e4,6e4);function V(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function x(n,e,t,r,s={}){return ga(n,s,async()=>{let a={},h={};r&&(e==="GET"?h=r:a={body:JSON.stringify(r)});const u=kt({key:n.config.apiKey,...h}).slice(1),g=await n._getAdditionalHeaders();g["Content-Type"]="application/json",n.languageCode&&(g["X-Firebase-Locale"]=n.languageCode);const E={method:e,headers:g,...a};return Vh()||(E.referrerPolicy="no-referrer"),n.emulatorConfig&&mn(n.emulatorConfig.host)&&(E.credentials="include"),pa.fetch()(await ma(n,n.config.apiHost,t,u),E)})}async function ga(n,e,t){n._canInitEmulator=!1;const r={...yu,...e};try{const s=new vu(n),a=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const h=await a.json();if("needConfirmation"in h)throw tn(n,"account-exists-with-different-credential",h);if(a.ok&&!("errorMessage"in h))return h;{const u=a.ok?h.errorMessage:h.error.message,[g,E]=u.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw tn(n,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw tn(n,"email-already-in-use",h);if(g==="USER_DISABLED")throw tn(n,"user-disabled",h);const R=r[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(E)throw yr(n,R,E);ie(n,R)}}catch(s){if(s instanceof _e)throw s;ie(n,"network-request-failed",{message:String(s)})}}async function Fe(n,e,t,r,s={}){const a=await x(n,e,t,r,s);return"mfaPendingCredential"in a&&ie(n,"multi-factor-auth-required",{_serverResponse:a}),a}async function ma(n,e,t,r){const s=`${e}${t}?${r}`,a=n,h=a.config.emulator?Tr(n.config,s):`${n.config.apiScheme}://${s}`;return wu.includes(t)&&(await a._persistenceManagerAvailable,a._getPersistenceType()==="COOKIE")?a._getPersistence()._getFinalTarget(h).toString():h}function Tu(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class vu{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Z(this.auth,"network-request-failed")),Eu.get())})}}function tn(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Z(n,e,r);return s.customData._tokenResponse=t,s}/**
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
 */function so(n){return n!==void 0&&n.getResponse!==void 0}function oo(n){return n!==void 0&&n.enterprise!==void 0}class _a{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Tu(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}/**
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
 */async function Au(n){return(await x(n,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function Ia(n,e){return x(n,"GET","/v2/recaptchaConfig",V(n,e))}/**
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
 */async function Su(n,e){return x(n,"POST","/v1/accounts:delete",e)}async function bu(n,e){return x(n,"POST","/v1/accounts:update",e)}async function qn(n,e){return x(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function rn(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
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
 */function Ru(n,e=!1){return P(n).getIdToken(e)}async function ya(n,e=!1){const t=P(n),r=await t.getIdToken(e),s=ni(r);v(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const a=typeof s.firebase=="object"?s.firebase:void 0,h=a==null?void 0:a.sign_in_provider;return{claims:s,token:r,authTime:rn(zi(s.auth_time)),issuedAtTime:rn(zi(s.iat)),expirationTime:rn(zi(s.exp)),signInProvider:h||null,signInSecondFactor:(a==null?void 0:a.sign_in_second_factor)||null}}function zi(n){return Number(n)*1e3}function ni(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Vn("JWT malformed, contained fewer than 3 sections"),null;try{const s=ea(t);return s?JSON.parse(s):(Vn("Failed to decode base64 JWT payload"),null)}catch(s){return Vn("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function ao(n){const e=ni(n);return v(e,"internal-error"),v(typeof e.exp<"u","internal-error"),v(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Ue(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof _e&&Pu(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Pu({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class Cu{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class hr{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=rn(this.lastLoginAt),this.creationTime=rn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function fn(n){var b;const e=n.auth,t=await n.getIdToken(),r=await Ue(n,qn(e,{idToken:t}));v(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const a=(b=s.providerUserInfo)!=null&&b.length?Ea(s.providerUserInfo):[],h=ku(n.providerData,a),u=n.isAnonymous,g=!(n.email&&s.passwordHash)&&!(h!=null&&h.length),E=u?g:!1,R={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:h,metadata:new hr(s.createdAt,s.lastLoginAt),isAnonymous:E};Object.assign(n,R)}async function wa(n){const e=P(n);await fn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ku(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Ea(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
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
 */async function Nu(n,e){const t=await ga(n,{},async()=>{const r=kt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:a}=n.config,h=await ma(n,s,"/v1/token",`key=${a}`),u=await n._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:u,body:r};return n.emulatorConfig&&mn(n.emulatorConfig.host)&&(g.credentials="include"),pa.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Ou(n,e){return x(n,"POST","/v2/accounts:revokeToken",V(n,e))}/**
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
 */class At{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){v(e.idToken,"internal-error"),v(typeof e.idToken<"u","internal-error"),v(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ao(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){v(e.length!==0,"internal-error");const t=ao(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(v(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:a}=await Nu(e,t);this.updateTokensAndExpiration(r,s,Number(a))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:a}=t,h=new At;return r&&(v(typeof r=="string","internal-error",{appName:e}),h.refreshToken=r),s&&(v(typeof s=="string","internal-error",{appName:e}),h.accessToken=s),a&&(v(typeof a=="number","internal-error",{appName:e}),h.expirationTime=a),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new At,this.toJSON())}_performRefresh(){return Te("not implemented")}}/**
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
 */function Ge(n,e){v(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class pe{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new Cu(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new hr(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Ue(this,this.stsTokenManager.getToken(this.auth,e));return v(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return ya(this,e)}reload(){return wa(this)}_assign(e){this!==e&&(v(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new pe({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){v(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await fn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(H(this.auth.app))return Promise.reject(Y(this.auth));const e=await this.getIdToken();return await Ue(this,Su(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,a=t.phoneNumber??void 0,h=t.photoURL??void 0,u=t.tenantId??void 0,g=t._redirectEventId??void 0,E=t.createdAt??void 0,R=t.lastLoginAt??void 0,{uid:b,emailVerified:S,isAnonymous:M,providerData:U,stsTokenManager:W}=t;v(b&&W,e,"internal-error");const j=At.fromJSON(this.name,W);v(typeof b=="string",e,"internal-error"),Ge(r,e.name),Ge(s,e.name),v(typeof S=="boolean",e,"internal-error"),v(typeof M=="boolean",e,"internal-error"),Ge(a,e.name),Ge(h,e.name),Ge(u,e.name),Ge(g,e.name),Ge(E,e.name),Ge(R,e.name);const re=new pe({uid:b,auth:e,email:s,emailVerified:S,displayName:r,isAnonymous:M,photoURL:h,phoneNumber:a,tenantId:u,stsTokenManager:j,createdAt:E,lastLoginAt:R});return U&&Array.isArray(U)&&(re.providerData=U.map(se=>({...se}))),g&&(re._redirectEventId=g),re}static async _fromIdTokenResponse(e,t,r=!1){const s=new At;s.updateFromServerResponse(t);const a=new pe({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await fn(a),a}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];v(s.localId!==void 0,"internal-error");const a=s.providerUserInfo!==void 0?Ea(s.providerUserInfo):[],h=!(s.email&&s.passwordHash)&&!(a!=null&&a.length),u=new At;u.updateFromIdToken(r);const g=new pe({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:h}),E={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new hr(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(a!=null&&a.length)};return Object.assign(g,E),g}}/**
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
 */const co=new Map;function Ne(n){Me(n instanceof Function,"Expected a class definition");let e=co.get(n);return e?(Me(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,co.set(n,e),e)}/**
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
 */class Ta{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Ta.type="NONE";const lr=Ta;/**
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
 */function xn(n,e,t){return`firebase:${n}:${e}:${t}`}class St{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:a}=this.auth;this.fullUserKey=xn(this.userKey,s.apiKey,a),this.fullPersistenceKey=xn("persistence",s.apiKey,a),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await qn(this.auth,{idToken:e}).catch(()=>{});return t?pe._fromGetAccountInfoResponse(this.auth,t,e):null}return pe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new St(Ne(lr),e,r);const s=(await Promise.all(t.map(async E=>{if(await E._isAvailable())return E}))).filter(E=>E);let a=s[0]||Ne(lr);const h=xn(r,e.config.apiKey,e.name);let u=null;for(const E of t)try{const R=await E._get(h);if(R){let b;if(typeof R=="string"){const S=await qn(e,{idToken:R}).catch(()=>{});if(!S)break;b=await pe._fromGetAccountInfoResponse(e,S,R)}else b=pe._fromJSON(e,R);E!==a&&(u=b),a=E;break}}catch{}const g=s.filter(E=>E._shouldAllowMigration);return!a._shouldAllowMigration||!g.length?new St(a,e,r):(a=g[0],u&&await a._set(h,u.toJSON()),await Promise.all(t.map(async E=>{if(E!==a)try{await E._remove(h)}catch{}})),new St(a,e,r))}}/**
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
 */function ho(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ba(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(va(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Pa(e))return"Blackberry";if(Ca(e))return"Webos";if(Aa(e))return"Safari";if((e.includes("chrome/")||Sa(e))&&!e.includes("edge/"))return"Chrome";if(Ra(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function va(n=te()){return/firefox\//i.test(n)}function Aa(n=te()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Sa(n=te()){return/crios\//i.test(n)}function ba(n=te()){return/iemobile/i.test(n)}function Ra(n=te()){return/android/i.test(n)}function Pa(n=te()){return/blackberry/i.test(n)}function Ca(n=te()){return/webos/i.test(n)}function vr(n=te()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Du(n=te()){var e;return vr(n)&&!!((e=window.navigator)!=null&&e.standalone)}function Lu(){return jh()&&document.documentMode===10}function ka(n=te()){return vr(n)||Ra(n)||Ca(n)||Pa(n)||/windows phone/i.test(n)||ba(n)}/**
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
 */function Na(n,e=[]){let t;switch(n){case"Browser":t=ho(te());break;case"Worker":t=`${ho(te())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Nt}/${r}`}/**
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
 */class Mu{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=a=>new Promise((h,u)=>{try{const g=e(a);h(g)}catch(g){u(g)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Uu(n,e={}){return x(n,"GET","/v2/passwordPolicy",V(n,e))}/**
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
 */const Fu=6;class Vu{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Fu,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,a){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=a))}}/**
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
 */class xu{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new lo(this),this.idTokenSubscription=new lo(this),this.beforeStateQueue=new Mu(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=fa,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(a=>this._resolvePersistenceManagerAvailable=a)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ne(t)),this._initializationPromise=this.queue(async()=>{var r,s,a;if(!this._deleted&&(this.persistenceManager=await St.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((a=this.currentUser)==null?void 0:a.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await qn(this,{idToken:e}),r=await pe._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var a;if(H(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(u,u))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(a=this.redirectUser)==null?void 0:a._redirectEventId,u=r==null?void 0:r._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===u)&&(g!=null&&g.user)&&(r=g.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(h){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return v(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await fn(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Iu()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(H(this.app))return Promise.reject(Y(this));const t=e?P(e):null;return t&&v(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&v(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return H(this.app)?Promise.reject(Y(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return H(this.app)?Promise.reject(Y(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ne(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Uu(this),t=new Vu(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new _t("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Ou(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ne(e)||this._popupRedirectResolver;v(t,this,"argument-error"),this.redirectPersistenceManager=await St.create(this,[Ne(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const a=typeof t=="function"?t:t.next.bind(t);let h=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(v(u,this,"internal-error"),u.then(()=>{h||a(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,r,s);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return v(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Na(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(H(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&mu(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function B(n){return P(n)}class lo{constructor(e){this.auth=e,this.observer=null,this.addObserver=qh(t=>this.observer=t)}get next(){return v(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let In={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ju(n){In=n}function Ar(n){return In.loadJS(n)}function Hu(){return In.recaptchaV2Script}function Bu(){return In.recaptchaEnterpriseScript}function $u(){return In.gapiScript}function Oa(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */const Wu=500,qu=6e4,Ln=1e12;class zu{constructor(e){this.auth=e,this.counter=Ln,this._widgets=new Map}render(e,t){const r=this.counter;return this._widgets.set(r,new Yu(e,this.auth.name,t||{})),this.counter++,r}reset(e){var r;const t=e||Ln;(r=this._widgets.get(t))==null||r.delete(),this._widgets.delete(t)}getResponse(e){var r;const t=e||Ln;return((r=this._widgets.get(t))==null?void 0:r.getResponse())||""}async execute(e){var r;const t=e||Ln;return(r=this._widgets.get(t))==null||r.execute(),""}}class Gu{constructor(){this.enterprise=new Ku}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Ku{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Yu{constructor(e,t,r){this.params=r,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const s=typeof e=="string"?document.getElementById(e):e;v(s,"argument-error",{appName:t}),this.container=s,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=Ju(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},qu)},Wu))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function Ju(n){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let r=0;r<n;r++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}const Xu="recaptcha-enterprise",sn="NO_RECAPTCHA";class Da{constructor(e){this.type=Xu,this.auth=B(e)}async verify(e="verify",t=!1){async function r(a){if(!t){if(a.tenantId==null&&a._agentRecaptchaConfig!=null)return a._agentRecaptchaConfig.siteKey;if(a.tenantId!=null&&a._tenantRecaptchaConfigs[a.tenantId]!==void 0)return a._tenantRecaptchaConfigs[a.tenantId].siteKey}return new Promise(async(h,u)=>{Ia(a,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{const E=new _a(g);return a.tenantId==null?a._agentRecaptchaConfig=E:a._tenantRecaptchaConfigs[a.tenantId]=E,h(E.siteKey)}}).catch(g=>{u(g)})})}function s(a,h,u){const g=window.grecaptcha;oo(g)?g.enterprise.ready(()=>{g.enterprise.execute(a,{action:e}).then(E=>{h(E)}).catch(()=>{h(sn)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Gu().execute("siteKey",{action:"verify"}):new Promise((a,h)=>{r(this.auth).then(u=>{if(!t&&oo(window.grecaptcha))s(u,a,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let g=Bu();g.length!==0&&(g+=u),Ar(g).then(()=>{s(u,a,h)}).catch(E=>{h(E)})}}).catch(u=>{h(u)})})}}async function Qt(n,e,t,r=!1,s=!1){const a=new Da(n);let h;if(s)h=sn;else try{h=await a.verify(t)}catch{h=await a.verify(t,!0)}const u={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){const g=u.phoneEnrollmentInfo.phoneNumber,E=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:E,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){const g=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return r?Object.assign(u,{captchaResp:h}):Object.assign(u,{captchaResponse:h}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function Je(n,e,t,r,s){var a,h;if(s==="EMAIL_PASSWORD_PROVIDER")if((a=n._getRecaptchaConfig())!=null&&a.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const u=await Qt(n,e,t,t==="getOobCode");return r(n,u)}else return r(n,e).catch(async u=>{if(u.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const g=await Qt(n,e,t,t==="getOobCode");return r(n,g)}else return Promise.reject(u)});else if(s==="PHONE_PROVIDER")if((h=n._getRecaptchaConfig())!=null&&h.isProviderEnabled("PHONE_PROVIDER")){const u=await Qt(n,e,t);return r(n,u).catch(async g=>{var E;if(((E=n._getRecaptchaConfig())==null?void 0:E.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(g.code==="auth/missing-recaptcha-token"||g.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);const R=await Qt(n,e,t,!1,!0);return r(n,R)}return Promise.reject(g)})}else{const u=await Qt(n,e,t,!1,!0);return r(n,u)}else return Promise.reject(s+" provider is not supported.")}async function La(n){const e=B(n),t=await Ia(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new _a(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new Da(e).verify()}/**
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
 */function Ma(n,e){const t=It(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),a=t.getOptions();if(Qe(a,e??{}))return s;ie(s,"already-initialized")}return t.initialize({options:e})}function Qu(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Ne);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Ua(n,e,t){const r=B(n);v(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!!(t!=null&&t.disableWarnings),a=Fa(e),{host:h,port:u}=Zu(e),g=u===null?"":`:${u}`,E={url:`${a}//${h}${g}/`},R=Object.freeze({host:h,port:u,protocol:a.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){v(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),v(Qe(E,r.config.emulator)&&Qe(R,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=E,r.emulatorConfig=R,r.settings.appVerificationDisabledForTesting=!0,mn(h)?(ia(`${a}//${h}${g}`),Uh("Auth",!0)):s||ed()}function Fa(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Zu(n){const e=Fa(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const a=s[1];return{host:a,port:uo(r.substr(a.length+1))}}else{const[a,h]=r.split(":");return{host:a,port:uo(h)}}}function uo(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function ed(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class Dt{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Te("not implemented")}_getIdTokenResponse(e){return Te("not implemented")}_linkToIdToken(e,t){return Te("not implemented")}_getReauthenticationResolver(e){return Te("not implemented")}}/**
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
 */async function Va(n,e){return x(n,"POST","/v1/accounts:resetPassword",V(n,e))}async function td(n,e){return x(n,"POST","/v1/accounts:update",e)}async function nd(n,e){return x(n,"POST","/v1/accounts:signUp",e)}async function id(n,e){return x(n,"POST","/v1/accounts:update",V(n,e))}/**
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
 */async function rd(n,e){return Fe(n,"POST","/v1/accounts:signInWithPassword",V(n,e))}async function ii(n,e){return x(n,"POST","/v1/accounts:sendOobCode",V(n,e))}async function sd(n,e){return ii(n,e)}async function od(n,e){return ii(n,e)}async function ad(n,e){return ii(n,e)}async function cd(n,e){return ii(n,e)}/**
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
 */async function hd(n,e){return Fe(n,"POST","/v1/accounts:signInWithEmailLink",V(n,e))}async function ld(n,e){return Fe(n,"POST","/v1/accounts:signInWithEmailLink",V(n,e))}/**
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
 */class Ct extends Dt{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new Ct(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new Ct(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Je(e,t,"signInWithPassword",rd,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return hd(e,{email:this._email,oobCode:this._password});default:ie(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Je(e,r,"signUpPassword",nd,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return ld(e,{idToken:t,email:this._email,oobCode:this._password});default:ie(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function De(n,e){return Fe(n,"POST","/v1/accounts:signInWithIdp",V(n,e))}/**
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
 */const ud="http://localhost";class Se extends Dt{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Se(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):ie("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...a}=t;if(!r||!s)return null;const h=new Se(r,s);return h.idToken=a.idToken||void 0,h.accessToken=a.accessToken||void 0,h.secret=a.secret,h.nonce=a.nonce,h.pendingToken=a.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return De(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,De(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,De(e,t)}buildRequest(){const e={requestUri:ud,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=kt(t)}return e}}/**
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
 */async function fo(n,e){return x(n,"POST","/v1/accounts:sendVerificationCode",V(n,e))}async function dd(n,e){return Fe(n,"POST","/v1/accounts:signInWithPhoneNumber",V(n,e))}async function fd(n,e){const t=await Fe(n,"POST","/v1/accounts:signInWithPhoneNumber",V(n,e));if(t.temporaryProof)throw tn(n,"account-exists-with-different-credential",t);return t}const pd={USER_NOT_FOUND:"user-not-found"};async function gd(n,e){const t={...e,operation:"REAUTH"};return Fe(n,"POST","/v1/accounts:signInWithPhoneNumber",V(n,t),pd)}/**
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
 */class Xe extends Dt{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new Xe({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new Xe({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return dd(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return fd(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return gd(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:s}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:a}=e;return!r&&!t&&!s&&!a?null:new Xe({verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:a})}}/**
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
 */function md(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function _d(n){const e=Zt(en(n)).link,t=e?Zt(en(e)).deep_link_id:null,r=Zt(en(n)).deep_link_id;return(r?Zt(en(r)).link:null)||r||t||e||n}class Lt{constructor(e){const t=Zt(en(e)),r=t.apiKey??null,s=t.oobCode??null,a=md(t.mode??null);v(r&&s&&a,"argument-error"),this.apiKey=r,this.operation=a,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=_d(e);try{return new Lt(t)}catch{return null}}}function Id(n){return Lt.parseLink(n)}/**
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
 */class et{constructor(){this.providerId=et.PROVIDER_ID}static credential(e,t){return Ct._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Lt.parseLink(t);return v(r,"argument-error"),Ct._fromEmailAndCode(e,r.code,r.tenantId)}}et.PROVIDER_ID="password";et.EMAIL_PASSWORD_SIGN_IN_METHOD="password";et.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class Ve{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Mt extends Ve{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class on extends Mt{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return v("providerId"in t&&"signInMethod"in t,"argument-error"),Se._fromParams(t)}credential(e){return this._credential({...e,nonce:e.rawNonce})}_credential(e){return v(e.idToken||e.accessToken,"argument-error"),Se._fromParams({...e,providerId:this.providerId,signInMethod:this.providerId})}static credentialFromResult(e){return on.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return on.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r,oauthTokenSecret:s,pendingToken:a,nonce:h,providerId:u}=e;if(!r&&!s&&!t&&!a||!u)return null;try{return new on(u)._credential({idToken:t,accessToken:r,nonce:h,pendingToken:a})}catch{return null}}}/**
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
 */class be extends Mt{constructor(){super("facebook.com")}static credential(e){return Se._fromParams({providerId:be.PROVIDER_ID,signInMethod:be.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return be.credentialFromTaggedObject(e)}static credentialFromError(e){return be.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return be.credential(e.oauthAccessToken)}catch{return null}}}be.FACEBOOK_SIGN_IN_METHOD="facebook.com";be.PROVIDER_ID="facebook.com";/**
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
 */class Re extends Mt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Se._fromParams({providerId:Re.PROVIDER_ID,signInMethod:Re.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Re.credentialFromTaggedObject(e)}static credentialFromError(e){return Re.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Re.credential(t,r)}catch{return null}}}Re.GOOGLE_SIGN_IN_METHOD="google.com";Re.PROVIDER_ID="google.com";/**
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
 */class Pe extends Mt{constructor(){super("github.com")}static credential(e){return Se._fromParams({providerId:Pe.PROVIDER_ID,signInMethod:Pe.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Pe.credentialFromTaggedObject(e)}static credentialFromError(e){return Pe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Pe.credential(e.oauthAccessToken)}catch{return null}}}Pe.GITHUB_SIGN_IN_METHOD="github.com";Pe.PROVIDER_ID="github.com";/**
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
 */const yd="http://localhost";class pn extends Dt{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){const t=this.buildRequest();return De(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,De(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,De(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,pendingToken:a}=t;return!r||!s||!a||r!==s?null:new pn(r,a)}static _create(e,t){return new pn(e,t)}buildRequest(){return{requestUri:yd,returnSecureToken:!0,pendingToken:this.pendingToken}}}/**
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
 */const wd="saml.";class zn extends Ve{constructor(e){v(e.startsWith(wd),"argument-error"),super(e)}static credentialFromResult(e){return zn.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return zn.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const t=pn.fromJSON(e);return v(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:t,providerId:r}=e;if(!t||!r)return null;try{return pn._create(r,t)}catch{return null}}}/**
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
 */class Ce extends Mt{constructor(){super("twitter.com")}static credential(e,t){return Se._fromParams({providerId:Ce.PROVIDER_ID,signInMethod:Ce.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ce.credentialFromTaggedObject(e)}static credentialFromError(e){return Ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Ce.credential(t,r)}catch{return null}}}Ce.TWITTER_SIGN_IN_METHOD="twitter.com";Ce.PROVIDER_ID="twitter.com";/**
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
 */async function xa(n,e){return Fe(n,"POST","/v1/accounts:signUp",V(n,e))}/**
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
 */class de{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const a=await pe._fromIdTokenResponse(e,r,s),h=po(r);return new de({user:a,providerId:h,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=po(r);return new de({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function po(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */async function Ed(n){var s;if(H(n.app))return Promise.reject(Y(n));const e=B(n);if(await e._initializationPromise,(s=e.currentUser)!=null&&s.isAnonymous)return new de({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await xa(e,{returnSecureToken:!0}),r=await de._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(r.user),r}/**
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
 */class Gn extends _e{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Gn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Gn(e,t,r,s)}}function ja(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(a=>{throw a.code==="auth/multi-factor-auth-required"?Gn._fromErrorAndOperation(n,a,e,r):a})}/**
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
 */function Ha(n){return new Set(n.map(({providerId:e})=>e).filter(e=>!!e))}/**
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
 */async function Td(n,e){const t=P(n);await ri(!0,t,e);const{providerUserInfo:r}=await bu(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),s=Ha(r||[]);return t.providerData=t.providerData.filter(a=>s.has(a.providerId)),s.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function Sr(n,e,t=!1){const r=await Ue(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return de._forOperation(n,"link",r)}async function ri(n,e,t){await fn(e);const r=Ha(e.providerData),s=n===!1?"provider-already-linked":"no-such-provider";v(r.has(t)===n,e.auth,s)}/**
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
 */async function Ba(n,e,t=!1){const{auth:r}=n;if(H(r.app))return Promise.reject(Y(r));const s="reauthenticate";try{const a=await Ue(n,ja(r,s,e,n),t);v(a.idToken,r,"internal-error");const h=ni(a.idToken);v(h,r,"internal-error");const{sub:u}=h;return v(n.uid===u,r,"user-mismatch"),de._forOperation(n,s,a)}catch(a){throw(a==null?void 0:a.code)==="auth/user-not-found"&&ie(r,"user-mismatch"),a}}/**
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
 */async function $a(n,e,t=!1){if(H(n.app))return Promise.reject(Y(n));const r="signIn",s=await ja(n,r,e),a=await de._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(a.user),a}async function si(n,e){return $a(B(n),e)}async function Wa(n,e){const t=P(n);return await ri(!1,t,e.providerId),Sr(t,e)}async function qa(n,e){return Ba(P(n),e)}/**
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
 */async function vd(n,e){return Fe(n,"POST","/v1/accounts:signInWithCustomToken",V(n,e))}/**
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
 */async function Ad(n,e){if(H(n.app))return Promise.reject(Y(n));const t=B(n),r=await vd(t,{token:e,returnSecureToken:!0}),s=await de._fromIdTokenResponse(t,"signIn",r);return await t._updateCurrentUser(s.user),s}/**
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
 */class yn{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?br._fromServerResponse(e,t):"totpInfo"in t?Rr._fromServerResponse(e,t):ie(e,"internal-error")}}class br extends yn{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new br(t)}}class Rr extends yn{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new Rr(t)}}/**
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
 */function oi(n,e,t){var r;v(((r=t.url)==null?void 0:r.length)>0,n,"invalid-continue-uri"),v(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,n,"invalid-dynamic-link-domain"),v(typeof t.linkDomain>"u"||t.linkDomain.length>0,n,"invalid-hosting-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.linkDomain=t.linkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(v(t.iOS.bundleId.length>0,n,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(v(t.android.packageName.length>0,n,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
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
 */async function Pr(n){const e=B(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Sd(n,e,t){const r=B(n),s={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&oi(r,s,t),await Je(r,s,"getOobCode",od,"EMAIL_PASSWORD_PROVIDER")}async function bd(n,e,t){await Va(P(n),{oobCode:e,newPassword:t}).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Pr(n),r})}async function Rd(n,e){await id(P(n),{oobCode:e})}async function za(n,e){const t=P(n),r=await Va(t,{oobCode:e}),s=r.requestType;switch(v(s,t,"internal-error"),s){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":v(r.newEmail,t,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":v(r.mfaInfo,t,"internal-error");default:v(r.email,t,"internal-error")}let a=null;return r.mfaInfo&&(a=yn._fromServerResponse(B(t),r.mfaInfo)),{data:{email:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.newEmail:r.email)||null,previousEmail:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.email:r.newEmail)||null,multiFactorInfo:a},operation:s}}async function Pd(n,e){const{data:t}=await za(P(n),e);return t.email}async function Cd(n,e,t){if(H(n.app))return Promise.reject(Y(n));const r=B(n),h=await Je(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",xa,"EMAIL_PASSWORD_PROVIDER").catch(g=>{throw g.code==="auth/password-does-not-meet-requirements"&&Pr(n),g}),u=await de._fromIdTokenResponse(r,"signIn",h);return await r._updateCurrentUser(u.user),u}function kd(n,e,t){return H(n.app)?Promise.reject(Y(n)):si(P(n),et.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Pr(n),r})}/**
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
 */async function Nd(n,e,t){const r=B(n),s={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function a(h,u){v(u.handleCodeInApp,r,"argument-error"),u&&oi(r,h,u)}a(s,t),await Je(r,s,"getOobCode",ad,"EMAIL_PASSWORD_PROVIDER")}function Od(n,e){const t=Lt.parseLink(e);return(t==null?void 0:t.operation)==="EMAIL_SIGNIN"}async function Dd(n,e,t){if(H(n.app))return Promise.reject(Y(n));const r=P(n),s=et.credentialWithLink(e,t||dn());return v(s._tenantId===(r.tenantId||null),r,"tenant-id-mismatch"),si(r,s)}/**
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
 */async function Ld(n,e){return x(n,"POST","/v1/accounts:createAuthUri",V(n,e))}/**
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
 */async function Md(n,e){const t=Er()?dn():"http://localhost",r={identifier:e,continueUri:t},{signinMethods:s}=await Ld(P(n),r);return s||[]}async function Ud(n,e){const t=P(n),s={requestType:"VERIFY_EMAIL",idToken:await n.getIdToken()};e&&oi(t.auth,s,e);const{email:a}=await sd(t.auth,s);a!==n.email&&await n.reload()}async function Fd(n,e,t){const r=P(n),a={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await n.getIdToken(),newEmail:e};t&&oi(r.auth,a,t);const{email:h}=await cd(r.auth,a);h!==n.email&&await n.reload()}/**
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
 */async function Vd(n,e){return x(n,"POST","/v1/accounts:update",e)}/**
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
 */async function xd(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=P(n),a={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},h=await Ue(r,Vd(r.auth,a));r.displayName=h.displayName||null,r.photoURL=h.photoUrl||null;const u=r.providerData.find(({providerId:g})=>g==="password");u&&(u.displayName=r.displayName,u.photoURL=r.photoURL),await r._updateTokensIfNecessary(h)}function jd(n,e){const t=P(n);return H(t.auth.app)?Promise.reject(Y(t.auth)):Ga(t,e,null)}function Hd(n,e){return Ga(P(n),null,e)}async function Ga(n,e,t){const{auth:r}=n,a={idToken:await n.getIdToken(),returnSecureToken:!0};e&&(a.email=e),t&&(a.password=t);const h=await Ue(n,td(r,a));await n._updateTokensIfNecessary(h,!0)}/**
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
 */function Bd(n){var s,a;if(!n)return null;const{providerId:e}=n,t=n.rawUserInfo?JSON.parse(n.rawUserInfo):{},r=n.isNewUser||n.kind==="identitytoolkit#SignupNewUserResponse";if(!e&&(n!=null&&n.idToken)){const h=(a=(s=ni(n.idToken))==null?void 0:s.firebase)==null?void 0:a.sign_in_provider;if(h){const u=h!=="anonymous"&&h!=="custom"?h:null;return new bt(r,u)}}if(!e)return null;switch(e){case"facebook.com":return new $d(r,t);case"github.com":return new Wd(r,t);case"google.com":return new qd(r,t);case"twitter.com":return new zd(r,t,n.screenName||null);case"custom":case"anonymous":return new bt(r,null);default:return new bt(r,e,t)}}class bt{constructor(e,t,r={}){this.isNewUser=e,this.providerId=t,this.profile=r}}class Ka extends bt{constructor(e,t,r,s){super(e,t,r),this.username=s}}class $d extends bt{constructor(e,t){super(e,"facebook.com",t)}}class Wd extends Ka{constructor(e,t){super(e,"github.com",t,typeof(t==null?void 0:t.login)=="string"?t==null?void 0:t.login:null)}}class qd extends bt{constructor(e,t){super(e,"google.com",t)}}class zd extends Ka{constructor(e,t,r){super(e,"twitter.com",t,r)}}function Gd(n){const{user:e,_tokenResponse:t}=n;return e.isAnonymous&&!t?{providerId:null,isNewUser:!1,profile:null}:Bd(t)}/**
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
 */function Kd(n,e){return P(n).setPersistence(e)}function Yd(n){return La(n)}async function Jd(n,e){return B(n).validatePassword(e)}function Ya(n,e,t,r){return P(n).onIdTokenChanged(e,t,r)}function Ja(n,e,t){return P(n).beforeAuthStateChanged(e,t)}function Xd(n,e,t,r){return P(n).onAuthStateChanged(e,t,r)}function Qd(n){P(n).useDeviceLanguage()}function Zd(n,e){return P(n).updateCurrentUser(e)}function ef(n){return P(n).signOut()}function tf(n,e){return B(n).revokeAccessToken(e)}async function nf(n){return P(n).delete()}/**
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
 */class ct{constructor(e,t,r){this.type=e,this.credential=t,this.user=r}static _fromIdtoken(e,t){return new ct("enroll",e,t)}static _fromMfaPendingCredential(e){return new ct("signin",e)}toJSON(){return{multiFactorSession:{[this.type==="enroll"?"idToken":"pendingCredential"]:this.credential}}}static fromJSON(e){var t,r;if(e!=null&&e.multiFactorSession){if((t=e.multiFactorSession)!=null&&t.pendingCredential)return ct._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if((r=e.multiFactorSession)!=null&&r.idToken)return ct._fromIdtoken(e.multiFactorSession.idToken)}return null}}/**
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
 */class Cr{constructor(e,t,r){this.session=e,this.hints=t,this.signInResolver=r}static _fromError(e,t){const r=B(e),s=t.customData._serverResponse,a=(s.mfaInfo||[]).map(u=>yn._fromServerResponse(r,u));v(s.mfaPendingCredential,r,"internal-error");const h=ct._fromMfaPendingCredential(s.mfaPendingCredential);return new Cr(h,a,async u=>{const g=await u._process(r,h);delete s.mfaInfo,delete s.mfaPendingCredential;const E={...s,idToken:g.idToken,refreshToken:g.refreshToken};switch(t.operationType){case"signIn":const R=await de._fromIdTokenResponse(r,t.operationType,E);return await r._updateCurrentUser(R.user),R;case"reauthenticate":return v(t.user,r,"internal-error"),de._forOperation(t.user,t.operationType,E);default:ie(r,"internal-error")}})}async resolveSignIn(e){const t=e;return this.signInResolver(t)}}function rf(n,e){var s;const t=P(n),r=e;return v(e.customData.operationType,t,"argument-error"),v((s=r.customData._serverResponse)==null?void 0:s.mfaPendingCredential,t,"argument-error"),Cr._fromError(t,r)}/**
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
 */function go(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:start",V(n,e))}function sf(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:finalize",V(n,e))}function of(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:start",V(n,e))}function af(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:finalize",V(n,e))}function cf(n,e){return x(n,"POST","/v2/accounts/mfaEnrollment:withdraw",V(n,e))}class kr{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(r=>yn._fromServerResponse(e.auth,r)))})}static _fromUser(e){return new kr(e)}async getSession(){return ct._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){const r=e,s=await this.getSession(),a=await Ue(this.user,r._process(this.user.auth,s,t));return await this.user._updateTokensIfNecessary(a),this.user.reload()}async unenroll(e){const t=typeof e=="string"?e:e.uid,r=await this.user.getIdToken();try{const s=await Ue(this.user,cf(this.user.auth,{idToken:r,mfaEnrollmentId:t}));this.enrolledFactors=this.enrolledFactors.filter(({uid:a})=>a!==t),await this.user._updateTokensIfNecessary(s),await this.user.reload()}catch(s){throw s}}}const Gi=new WeakMap;function hf(n){const e=P(n);return Gi.has(e)||Gi.set(e,kr._fromUser(e)),Gi.get(e)}const Kn="__sak";/**
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
 */class Xa{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Kn,"1"),this.storage.removeItem(Kn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const lf=1e3,uf=10;class Qa extends Xa{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ka(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,u,g)=>{this.notifyListeners(h,g)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const h=this.storage.getItem(r);!t&&this.localCache[r]===h||this.notifyListeners(r,h)},a=this.storage.getItem(r);Lu()&&a!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,uf):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},lf)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Qa.type="LOCAL";const Za=Qa;/**
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
 */const df=1e3;function Ki(n){var r;const e=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return((r=document.cookie.match(t))==null?void 0:r[1])??null}function Yi(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}class ec{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;const t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;const t=Yi(e);if(window.cookieStore){const r=await window.cookieStore.get(t);return r==null?void 0:r.value}return Ki(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;const r=Yi(e);document.cookie=`${r}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;const r=Yi(e);if(window.cookieStore){const u=(E=>{const R=E.changed.find(S=>S.name===r);R&&t(R.value),E.deleted.find(S=>S.name===r)&&t(null)}),g=()=>window.cookieStore.removeEventListener("change",u);return this.listenerUnsubscribes.set(t,g),window.cookieStore.addEventListener("change",u)}let s=Ki(r);const a=setInterval(()=>{const u=Ki(r);u!==s&&(t(u),s=u)},df),h=()=>clearInterval(a);this.listenerUnsubscribes.set(t,h)}_removeListener(e,t){const r=this.listenerUnsubscribes.get(t);r&&(r(),this.listenerUnsubscribes.delete(t))}}ec.type="COOKIE";const ff=ec;/**
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
 */class tc extends Xa{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}tc.type="SESSION";const Nr=tc;/**
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
 */function pf(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class ai{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new ai(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:a}=t.data,h=this.handlersMap[s];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const u=Array.from(h).map(async E=>E(t.origin,a)),g=await pf(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ai.receivers=[];/**
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
 */function ci(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class gf{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let a,h;return new Promise((u,g)=>{const E=ci("",20);s.port1.start();const R=setTimeout(()=>{g(new Error("unsupported_event"))},r);h={messageChannel:s,onMessage(b){const S=b;if(S.data.eventId===E)switch(S.data.status){case"ack":clearTimeout(R),a=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(a),u(S.data.response);break;default:clearTimeout(R),clearTimeout(a),g(new Error("invalid_response"));break}}},this.handlers.add(h),s.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:E,data:t},[s.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
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
 */function q(){return window}function mf(n){q().location.href=n}/**
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
 */function Or(){return typeof q().WorkerGlobalScope<"u"&&typeof q().importScripts=="function"}async function _f(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function If(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function yf(){return Or()?self:null}/**
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
 */const nc="firebaseLocalStorageDb",wf=1,Yn="firebaseLocalStorage",ic="fbase_key";class wn{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function hi(n,e){return n.transaction([Yn],e?"readwrite":"readonly").objectStore(Yn)}function Ef(){const n=indexedDB.deleteDatabase(nc);return new wn(n).toPromise()}function ur(){const n=indexedDB.open(nc,wf);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Yn,{keyPath:ic})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Yn)?e(r):(r.close(),await Ef(),e(await ur()))})})}async function mo(n,e,t){const r=hi(n,!0).put({[ic]:e,value:t});return new wn(r).toPromise()}async function Tf(n,e){const t=hi(n,!1).get(e),r=await new wn(t).toPromise();return r===void 0?null:r.value}function _o(n,e){const t=hi(n,!0).delete(e);return new wn(t).toPromise()}const vf=800,Af=3;class rc{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ur(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>Af)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Or()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ai._getInstance(yf()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await _f(),!this.activeServiceWorker)return;this.sender=new gf(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||If()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ur();return await mo(e,Kn,"1"),await _o(e,Kn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>mo(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Tf(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>_o(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const a=hi(s,!1).getAll();return new wn(a).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:a}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(a)&&(this.notifyListeners(s,a),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),vf)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}rc.type="LOCAL";const sc=rc;/**
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
 */function Io(n,e){return x(n,"POST","/v2/accounts/mfaSignIn:start",V(n,e))}function Sf(n,e){return x(n,"POST","/v2/accounts/mfaSignIn:finalize",V(n,e))}function bf(n,e){return x(n,"POST","/v2/accounts/mfaSignIn:finalize",V(n,e))}/**
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
 */const Ji=Oa("rcb"),Rf=new _n(3e4,6e4);class Pf{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!((e=q().grecaptcha)!=null&&e.render)}load(e,t=""){return v(Cf(t),e,"argument-error"),this.shouldResolveImmediately(t)&&so(q().grecaptcha)?Promise.resolve(q().grecaptcha):new Promise((r,s)=>{const a=q().setTimeout(()=>{s(Z(e,"network-request-failed"))},Rf.get());q()[Ji]=()=>{q().clearTimeout(a),delete q()[Ji];const u=q().grecaptcha;if(!u||!so(u)){s(Z(e,"internal-error"));return}const g=u.render;u.render=(E,R)=>{const b=g(E,R);return this.counter++,b},this.hostLanguage=t,r(u)};const h=`${Hu()}?${kt({onload:Ji,render:"explicit",hl:t})}`;Ar(h).catch(()=>{clearTimeout(a),s(Z(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!((t=q().grecaptcha)!=null&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function Cf(n){return n.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(n)}class kf{async load(e){return new zu(e)}clearedOneInstance(){}}/**
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
 */const an="recaptcha",Nf={theme:"light",type:"image"};class Of{constructor(e,t,r={...Nf}){this.parameters=r,this.type=an,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=B(e),this.isInvisible=this.parameters.size==="invisible",v(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const s=typeof t=="string"?document.getElementById(t):t;v(s,this.auth,"argument-error"),this.container=s,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new kf:new Pf,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),r=t.getResponse(e);return r||new Promise(s=>{const a=h=>{h&&(this.tokenChangeListeners.delete(a),s(h))};this.tokenChangeListeners.add(a),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){v(!this.parameters.sitekey,this.auth,"argument-error"),v(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),v(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(r=>r(t)),typeof e=="function")e(t);else if(typeof e=="string"){const r=q()[e];typeof r=="function"&&r(t)}}}assertNotDestroyed(){v(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){v(Er()&&!Or(),this.auth,"internal-error"),await Df(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await Au(this.auth);v(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return v(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function Df(){let n=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}n=()=>e(),window.addEventListener("load",n)}).catch(e=>{throw n&&window.removeEventListener("load",n),e})}/**
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
 */class Dr{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=Xe._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function Lf(n,e,t){if(H(n.app))return Promise.reject(Y(n));const r=B(n),s=await li(r,e,P(t));return new Dr(s,a=>si(r,a))}async function Mf(n,e,t){const r=P(n);await ri(!1,r,"phone");const s=await li(r.auth,e,P(t));return new Dr(s,a=>Wa(r,a))}async function Uf(n,e,t){const r=P(n);if(H(r.auth.app))return Promise.reject(Y(r.auth));const s=await li(r.auth,e,P(t));return new Dr(s,a=>qa(r,a))}async function li(n,e,t){var r;if(!n._getRecaptchaConfig())try{await La(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let s;if(typeof e=="string"?s={phoneNumber:e}:s=e,"session"in s){const a=s.session;if("phoneNumber"in s){v(a.type==="enroll",n,"internal-error");const h={idToken:a.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Je(n,h,"mfaSmsEnrollment",async(R,b)=>{if(b.phoneEnrollmentInfo.captchaResponse===sn){v((t==null?void 0:t.type)===an,R,"argument-error");const S=await Xi(R,b,t);return go(R,S)}return go(R,b)},"PHONE_PROVIDER").catch(R=>Promise.reject(R))).phoneSessionInfo.sessionInfo}else{v(a.type==="signin",n,"internal-error");const h=((r=s.multiFactorHint)==null?void 0:r.uid)||s.multiFactorUid;v(h,n,"missing-multi-factor-info");const u={mfaPendingCredential:a.credential,mfaEnrollmentId:h,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Je(n,u,"mfaSmsSignIn",async(b,S)=>{if(S.phoneSignInInfo.captchaResponse===sn){v((t==null?void 0:t.type)===an,b,"argument-error");const M=await Xi(b,S,t);return Io(b,M)}return Io(b,S)},"PHONE_PROVIDER").catch(b=>Promise.reject(b))).phoneResponseInfo.sessionInfo}}else{const a={phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Je(n,a,"sendVerificationCode",async(E,R)=>{if(R.captchaResponse===sn){v((t==null?void 0:t.type)===an,E,"argument-error");const b=await Xi(E,R,t);return fo(E,b)}return fo(E,R)},"PHONE_PROVIDER").catch(E=>Promise.reject(E))).sessionInfo}}finally{t==null||t._reset()}}async function Ff(n,e){const t=P(n);if(H(t.auth.app))return Promise.reject(Y(t.auth));await Sr(t,e)}async function Xi(n,e,t){v(t.type===an,n,"argument-error");const r=await t.verify();v(typeof r=="string",n,"argument-error");const s={...e};if("phoneEnrollmentInfo"in s){const a=s.phoneEnrollmentInfo.phoneNumber,h=s.phoneEnrollmentInfo.captchaResponse,u=s.phoneEnrollmentInfo.clientType,g=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:a,recaptchaToken:r,captchaResponse:h,clientType:u,recaptchaVersion:g}}),s}else if("phoneSignInInfo"in s){const a=s.phoneSignInInfo.captchaResponse,h=s.phoneSignInInfo.clientType,u=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:a,clientType:h,recaptchaVersion:u}}),s}else return Object.assign(s,{recaptchaToken:r}),s}/**
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
 */class ut{constructor(e){this.providerId=ut.PROVIDER_ID,this.auth=B(e)}verifyPhoneNumber(e,t){return li(this.auth,e,P(t))}static credential(e,t){return Xe._fromVerification(e,t)}static credentialFromResult(e){const t=e;return ut.credentialFromTaggedObject(t)}static credentialFromError(e){return ut.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:r}=e;return t&&r?Xe._fromTokenResponse(t,r):null}}ut.PROVIDER_ID="phone";ut.PHONE_SIGN_IN_METHOD="phone";/**
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
 */function yt(n,e){return e?Ne(e):(v(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Lr extends Dt{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return De(e,this._buildIdpRequest())}_linkToIdToken(e,t){return De(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return De(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Vf(n){return $a(n.auth,new Lr(n),n.bypassAuthState)}function xf(n){const{auth:e,user:t}=n;return v(t,e,"internal-error"),Ba(t,new Lr(n),n.bypassAuthState)}async function jf(n){const{auth:e,user:t}=n;return v(t,e,"internal-error"),Sr(t,new Lr(n),n.bypassAuthState)}/**
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
 */class oc{constructor(e,t,r,s,a=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=a,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:a,error:h,type:u}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:r,tenantId:a||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(g))}catch(E){this.reject(E)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Vf;case"linkViaPopup":case"linkViaRedirect":return jf;case"reauthViaPopup":case"reauthViaRedirect":return xf;default:ie(this.auth,"internal-error")}}resolve(e){Me(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Me(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Hf=new _n(2e3,1e4);async function Bf(n,e,t){if(H(n.app))return Promise.reject(Z(n,"operation-not-supported-in-this-environment"));const r=B(n);Ot(n,e,Ve);const s=yt(r,t);return new Oe(r,"signInViaPopup",e,s).executeNotNull()}async function $f(n,e,t){const r=P(n);if(H(r.auth.app))return Promise.reject(Z(r.auth,"operation-not-supported-in-this-environment"));Ot(r.auth,e,Ve);const s=yt(r.auth,t);return new Oe(r.auth,"reauthViaPopup",e,s,r).executeNotNull()}async function Wf(n,e,t){const r=P(n);Ot(r.auth,e,Ve);const s=yt(r.auth,t);return new Oe(r.auth,"linkViaPopup",e,s,r).executeNotNull()}class Oe extends oc{constructor(e,t,r,s,a){super(e,t,s,a),this.provider=r,this.authWindow=null,this.pollId=null,Oe.currentPopupAction&&Oe.currentPopupAction.cancel(),Oe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return v(e,this.auth,"internal-error"),e}async onExecution(){Me(this.filter.length===1,"Popup operations only handle one event");const e=ci();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Z(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Z(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Oe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Z(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Hf.get())};e()}}Oe.currentPopupAction=null;/**
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
 */const qf="pendingRedirect",jn=new Map;class zf extends oc{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=jn.get(this.auth._key());if(!e){try{const r=await Gf(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}jn.set(this.auth._key(),e)}return this.bypassAuthState||jn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Gf(n,e){const t=cc(e),r=ac(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}async function Mr(n,e){return ac(n)._set(cc(e),"true")}function Kf(n,e){jn.set(n._key(),e)}function ac(n){return Ne(n._redirectPersistence)}function cc(n){return xn(qf,n.config.apiKey,n.name)}/**
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
 */function Yf(n,e,t){return Jf(n,e,t)}async function Jf(n,e,t){if(H(n.app))return Promise.reject(Y(n));const r=B(n);Ot(n,e,Ve),await r._initializationPromise;const s=yt(r,t);return await Mr(s,r),s._openRedirect(r,e,"signInViaRedirect")}function Xf(n,e,t){return Qf(n,e,t)}async function Qf(n,e,t){const r=P(n);if(Ot(r.auth,e,Ve),H(r.auth.app))return Promise.reject(Y(r.auth));await r.auth._initializationPromise;const s=yt(r.auth,t);await Mr(s,r.auth);const a=await lc(r);return s._openRedirect(r.auth,e,"reauthViaRedirect",a)}function Zf(n,e,t){return ep(n,e,t)}async function ep(n,e,t){const r=P(n);Ot(r.auth,e,Ve),await r.auth._initializationPromise;const s=yt(r.auth,t);await ri(!1,r,e.providerId),await Mr(s,r.auth);const a=await lc(r);return s._openRedirect(r.auth,e,"linkViaRedirect",a)}async function tp(n,e){return await B(n)._initializationPromise,hc(n,e,!1)}async function hc(n,e,t=!1){if(H(n.app))return Promise.reject(Y(n));const r=B(n),s=yt(r,e),h=await new zf(r,s,t).execute();return h&&!t&&(delete h.user._redirectEventId,await r._persistUserIfCurrent(h.user),await r._setRedirectUser(null,e)),h}async function lc(n){const e=ci(`${n.uid}:::`);return n._redirectEventId=e,await n.auth._setRedirectUser(n),await n.auth._persistUserIfCurrent(n),e}/**
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
 */const np=600*1e3;class ip{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!rp(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!uc(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(Z(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=np&&this.cachedEventUids.clear(),this.cachedEventUids.has(yo(e))}saveEventToCache(e){this.cachedEventUids.add(yo(e)),this.lastProcessedEventTime=Date.now()}}function yo(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function uc({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function rp(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return uc(n);default:return!1}}/**
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
 */async function sp(n,e={}){return x(n,"GET","/v1/projects",e)}/**
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
 */const op=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ap=/^https?/;async function cp(n){if(n.config.emulator)return;const{authorizedDomains:e}=await sp(n);for(const t of e)try{if(hp(t))return}catch{}ie(n,"unauthorized-domain")}function hp(n){const e=dn(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const h=new URL(n);return h.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===r}if(!ap.test(t))return!1;if(op.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const lp=new _n(3e4,6e4);function wo(){const n=q().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function up(n){return new Promise((e,t)=>{var s,a,h;function r(){wo(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{wo(),t(Z(n,"network-request-failed"))},timeout:lp.get()})}if((a=(s=q().gapi)==null?void 0:s.iframes)!=null&&a.Iframe)e(gapi.iframes.getContext());else if((h=q().gapi)!=null&&h.load)r();else{const u=Oa("iframefcb");return q()[u]=()=>{gapi.load?r():t(Z(n,"network-request-failed"))},Ar(`${$u()}?onload=${u}`).catch(g=>t(g))}}).catch(e=>{throw Hn=null,e})}let Hn=null;function dp(n){return Hn=Hn||up(n),Hn}/**
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
 */const fp=new _n(5e3,15e3),pp="__/auth/iframe",gp="emulator/auth/iframe",mp={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},_p=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ip(n){const e=n.config;v(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Tr(e,gp):`https://${n.config.authDomain}/${pp}`,r={apiKey:e.apiKey,appName:n.name,v:Nt},s=_p.get(n.config.apiHost);s&&(r.eid=s);const a=n._getFrameworks();return a.length&&(r.fw=a.join(",")),`${t}?${kt(r).slice(1)}`}async function yp(n){const e=await dp(n),t=q().gapi;return v(t,n,"internal-error"),e.open({where:document.body,url:Ip(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:mp,dontclear:!0},r=>new Promise(async(s,a)=>{await r.restyle({setHideOnLeave:!1});const h=Z(n,"network-request-failed"),u=q().setTimeout(()=>{a(h)},fp.get());function g(){q().clearTimeout(u),s(r)}r.ping(g).then(g,()=>{a(h)})}))}/**
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
 */const wp={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ep=500,Tp=600,vp="_blank",Ap="http://localhost";class Eo{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Sp(n,e,t,r=Ep,s=Tp){const a=Math.max((window.screen.availHeight-s)/2,0).toString(),h=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const g={...wp,width:r.toString(),height:s.toString(),top:a,left:h},E=te().toLowerCase();t&&(u=Sa(E)?vp:t),va(E)&&(e=e||Ap,g.scrollbars="yes");const R=Object.entries(g).reduce((S,[M,U])=>`${S}${M}=${U},`,"");if(Du(E)&&u!=="_self")return bp(e||"",u),new Eo(null);const b=window.open(e||"",u,R);v(b,n,"popup-blocked");try{b.focus()}catch{}return new Eo(b)}function bp(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const Rp="__/auth/handler",Pp="emulator/auth/handler",Cp=encodeURIComponent("fac");async function To(n,e,t,r,s,a){v(n.config.authDomain,n,"auth-domain-config-required"),v(n.config.apiKey,n,"invalid-api-key");const h={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Nt,eventId:s};if(e instanceof Ve){e.setDefaultLanguage(n.languageCode),h.providerId=e.providerId||"",Wh(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[R,b]of Object.entries({}))h[R]=b}if(e instanceof Mt){const R=e.getScopes().filter(b=>b!=="");R.length>0&&(h.scopes=R.join(","))}n.tenantId&&(h.tid=n.tenantId);const u=h;for(const R of Object.keys(u))u[R]===void 0&&delete u[R];const g=await n._getAppCheckToken(),E=g?`#${Cp}=${encodeURIComponent(g)}`:"";return`${kp(n)}?${kt(u).slice(1)}${E}`}function kp({config:n}){return n.emulator?Tr(n,Pp):`https://${n.authDomain}/${Rp}`}/**
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
 */const Qi="webStorageSupport";class Np{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Nr,this._completeRedirectFn=hc,this._overrideRedirectResult=Kf}async _openPopup(e,t,r,s){var h;Me((h=this.eventManagers[e._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const a=await To(e,t,r,dn(),s);return Sp(e,a,ci())}async _openRedirect(e,t,r,s){await this._originValidation(e);const a=await To(e,t,r,dn(),s);return mf(a),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:a}=this.eventManagers[t];return s?Promise.resolve(s):(Me(a,"If manager is not set, promise should be"),a)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await yp(e),r=new ip(e);return t.register("authEvent",s=>(v(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Qi,{type:Qi},s=>{var h;const a=(h=s==null?void 0:s[0])==null?void 0:h[Qi];a!==void 0&&t(!!a),ie(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=cp(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ka()||Aa()||vr()}}const dc=Np;class fc{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return Te("unexpected MultiFactorSessionType")}}}class Ur extends fc{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new Ur(e)}_finalizeEnroll(e,t,r){return sf(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return Sf(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class pc{constructor(){}static assertion(e){return Ur._fromCredential(e)}}pc.FACTOR_ID="phone";class gc{static assertionForEnrollment(e,t){return gn._fromSecret(e,t)}static assertionForSignIn(e,t){return gn._fromEnrollmentId(e,t)}static async generateSecret(e){var s;const t=e;v(typeof((s=t.user)==null?void 0:s.auth)<"u","internal-error");const r=await of(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return ui._fromStartTotpMfaEnrollmentResponse(r,t.user.auth)}}gc.FACTOR_ID="totp";class gn extends fc{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new gn(t,void 0,e)}static _fromEnrollmentId(e,t){return new gn(t,e)}async _finalizeEnroll(e,t,r){return v(typeof this.secret<"u",e,"argument-error"),af(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){v(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");const r={verificationCode:this.otp};return bf(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}}class ui{constructor(e,t,r,s,a,h,u){this.sessionInfo=h,this.auth=u,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=a}static _fromStartTotpMfaEnrollmentResponse(e,t){return new ui(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var s;let r=!1;return(Mn(e)||Mn(t))&&(r=!0),r&&(Mn(e)&&(e=((s=this.auth.currentUser)==null?void 0:s.email)||"unknownuser"),Mn(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function Mn(n){return typeof n>"u"||(n==null?void 0:n.length)===0}var vo="@firebase/auth",Ao="1.12.0";/**
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
 */class Op{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){v(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Dp(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Lp(n){Ae(new me("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),a=e.getProvider("app-check-internal"),{apiKey:h,authDomain:u}=r.options;v(h&&!h.includes(":"),"invalid-api-key",{appName:r.name});const g={apiKey:h,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Na(n)},E=new xu(r,s,a,g);return Qu(E,t),E},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Ae(new me("auth-internal",e=>{const t=B(e.getProvider("auth").getImmediate());return(r=>new Op(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ue(vo,Ao,Dp(n)),ue(vo,Ao,"esm2020")}/**
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
 */const Mp=300,Up=na("authIdTokenMaxAge")||Mp;let So=null;const Fp=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Up)return;const s=t==null?void 0:t.token;So!==s&&(So=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Vp(n=ca()){const e=It(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Ma(n,{popupRedirectResolver:dc,persistence:[sc,Za,Nr]}),r=na("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const a=new URL(r,location.origin);if(location.origin===a.origin){const h=Fp(a.toString());Ja(t,h,()=>h(t.currentUser)),Ya(t,u=>h(u))}}const s=Oh("auth");return s&&Ua(t,`http://${s}`),t}function xp(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}ju({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const a=Z("internal-error");a.customData=s,t(a)},r.type="text/javascript",r.charset="UTF-8",xp().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Lp("Browser");const Fm=Object.freeze(Object.defineProperty({__proto__:null,ActionCodeOperation:du,ActionCodeURL:Lt,AuthCredential:Dt,AuthErrorCodes:gu,EmailAuthCredential:Ct,EmailAuthProvider:et,FacebookAuthProvider:be,FactorId:cu,GithubAuthProvider:Pe,GoogleAuthProvider:Re,OAuthCredential:Se,OAuthProvider:on,OperationType:uu,PhoneAuthCredential:Xe,PhoneAuthProvider:ut,PhoneMultiFactorGenerator:pc,ProviderId:hu,RecaptchaVerifier:Of,SAMLAuthProvider:zn,SignInMethod:lu,TotpMultiFactorGenerator:gc,TotpSecret:ui,TwitterAuthProvider:Ce,applyActionCode:Rd,beforeAuthStateChanged:Ja,browserCookiePersistence:ff,browserLocalPersistence:Za,browserPopupRedirectResolver:dc,browserSessionPersistence:Nr,checkActionCode:za,confirmPasswordReset:bd,connectAuthEmulator:Ua,createUserWithEmailAndPassword:Cd,debugErrorMap:pu,deleteUser:nf,fetchSignInMethodsForEmail:Md,getAdditionalUserInfo:Gd,getAuth:Vp,getIdToken:Ru,getIdTokenResult:ya,getMultiFactorResolver:rf,getRedirectResult:tp,inMemoryPersistence:lr,indexedDBLocalPersistence:sc,initializeAuth:Ma,initializeRecaptchaConfig:Yd,isSignInWithEmailLink:Od,linkWithCredential:Wa,linkWithPhoneNumber:Mf,linkWithPopup:Wf,linkWithRedirect:Zf,multiFactor:hf,onAuthStateChanged:Xd,onIdTokenChanged:Ya,parseActionCodeURL:Id,prodErrorMap:da,reauthenticateWithCredential:qa,reauthenticateWithPhoneNumber:Uf,reauthenticateWithPopup:$f,reauthenticateWithRedirect:Xf,reload:wa,revokeAccessToken:tf,sendEmailVerification:Ud,sendPasswordResetEmail:Sd,sendSignInLinkToEmail:Nd,setPersistence:Kd,signInAnonymously:Ed,signInWithCredential:si,signInWithCustomToken:Ad,signInWithEmailAndPassword:kd,signInWithEmailLink:Dd,signInWithPhoneNumber:Lf,signInWithPopup:Bf,signInWithRedirect:Yf,signOut:ef,unlink:Td,updateCurrentUser:Zd,updateEmail:jd,updatePassword:Hd,updatePhoneNumber:Ff,updateProfile:xd,useDeviceLanguage:Qd,validatePassword:Jd,verifyBeforeUpdateEmail:Fd,verifyPasswordResetCode:Pd},Symbol.toStringTag,{value:"Module"}));var bo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Fr;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(_,d){function p(){}p.prototype=d.prototype,_.F=d.prototype,_.prototype=new p,_.prototype.constructor=_,_.D=function(I,m,w){for(var f=Array(arguments.length-2),ne=2;ne<arguments.length;ne++)f[ne-2]=arguments[ne];return d.prototype[m].apply(I,f)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(_,d,p){p||(p=0);const I=Array(16);if(typeof d=="string")for(var m=0;m<16;++m)I[m]=d.charCodeAt(p++)|d.charCodeAt(p++)<<8|d.charCodeAt(p++)<<16|d.charCodeAt(p++)<<24;else for(m=0;m<16;++m)I[m]=d[p++]|d[p++]<<8|d[p++]<<16|d[p++]<<24;d=_.g[0],p=_.g[1],m=_.g[2];let w=_.g[3],f;f=d+(w^p&(m^w))+I[0]+3614090360&4294967295,d=p+(f<<7&4294967295|f>>>25),f=w+(m^d&(p^m))+I[1]+3905402710&4294967295,w=d+(f<<12&4294967295|f>>>20),f=m+(p^w&(d^p))+I[2]+606105819&4294967295,m=w+(f<<17&4294967295|f>>>15),f=p+(d^m&(w^d))+I[3]+3250441966&4294967295,p=m+(f<<22&4294967295|f>>>10),f=d+(w^p&(m^w))+I[4]+4118548399&4294967295,d=p+(f<<7&4294967295|f>>>25),f=w+(m^d&(p^m))+I[5]+1200080426&4294967295,w=d+(f<<12&4294967295|f>>>20),f=m+(p^w&(d^p))+I[6]+2821735955&4294967295,m=w+(f<<17&4294967295|f>>>15),f=p+(d^m&(w^d))+I[7]+4249261313&4294967295,p=m+(f<<22&4294967295|f>>>10),f=d+(w^p&(m^w))+I[8]+1770035416&4294967295,d=p+(f<<7&4294967295|f>>>25),f=w+(m^d&(p^m))+I[9]+2336552879&4294967295,w=d+(f<<12&4294967295|f>>>20),f=m+(p^w&(d^p))+I[10]+4294925233&4294967295,m=w+(f<<17&4294967295|f>>>15),f=p+(d^m&(w^d))+I[11]+2304563134&4294967295,p=m+(f<<22&4294967295|f>>>10),f=d+(w^p&(m^w))+I[12]+1804603682&4294967295,d=p+(f<<7&4294967295|f>>>25),f=w+(m^d&(p^m))+I[13]+4254626195&4294967295,w=d+(f<<12&4294967295|f>>>20),f=m+(p^w&(d^p))+I[14]+2792965006&4294967295,m=w+(f<<17&4294967295|f>>>15),f=p+(d^m&(w^d))+I[15]+1236535329&4294967295,p=m+(f<<22&4294967295|f>>>10),f=d+(m^w&(p^m))+I[1]+4129170786&4294967295,d=p+(f<<5&4294967295|f>>>27),f=w+(p^m&(d^p))+I[6]+3225465664&4294967295,w=d+(f<<9&4294967295|f>>>23),f=m+(d^p&(w^d))+I[11]+643717713&4294967295,m=w+(f<<14&4294967295|f>>>18),f=p+(w^d&(m^w))+I[0]+3921069994&4294967295,p=m+(f<<20&4294967295|f>>>12),f=d+(m^w&(p^m))+I[5]+3593408605&4294967295,d=p+(f<<5&4294967295|f>>>27),f=w+(p^m&(d^p))+I[10]+38016083&4294967295,w=d+(f<<9&4294967295|f>>>23),f=m+(d^p&(w^d))+I[15]+3634488961&4294967295,m=w+(f<<14&4294967295|f>>>18),f=p+(w^d&(m^w))+I[4]+3889429448&4294967295,p=m+(f<<20&4294967295|f>>>12),f=d+(m^w&(p^m))+I[9]+568446438&4294967295,d=p+(f<<5&4294967295|f>>>27),f=w+(p^m&(d^p))+I[14]+3275163606&4294967295,w=d+(f<<9&4294967295|f>>>23),f=m+(d^p&(w^d))+I[3]+4107603335&4294967295,m=w+(f<<14&4294967295|f>>>18),f=p+(w^d&(m^w))+I[8]+1163531501&4294967295,p=m+(f<<20&4294967295|f>>>12),f=d+(m^w&(p^m))+I[13]+2850285829&4294967295,d=p+(f<<5&4294967295|f>>>27),f=w+(p^m&(d^p))+I[2]+4243563512&4294967295,w=d+(f<<9&4294967295|f>>>23),f=m+(d^p&(w^d))+I[7]+1735328473&4294967295,m=w+(f<<14&4294967295|f>>>18),f=p+(w^d&(m^w))+I[12]+2368359562&4294967295,p=m+(f<<20&4294967295|f>>>12),f=d+(p^m^w)+I[5]+4294588738&4294967295,d=p+(f<<4&4294967295|f>>>28),f=w+(d^p^m)+I[8]+2272392833&4294967295,w=d+(f<<11&4294967295|f>>>21),f=m+(w^d^p)+I[11]+1839030562&4294967295,m=w+(f<<16&4294967295|f>>>16),f=p+(m^w^d)+I[14]+4259657740&4294967295,p=m+(f<<23&4294967295|f>>>9),f=d+(p^m^w)+I[1]+2763975236&4294967295,d=p+(f<<4&4294967295|f>>>28),f=w+(d^p^m)+I[4]+1272893353&4294967295,w=d+(f<<11&4294967295|f>>>21),f=m+(w^d^p)+I[7]+4139469664&4294967295,m=w+(f<<16&4294967295|f>>>16),f=p+(m^w^d)+I[10]+3200236656&4294967295,p=m+(f<<23&4294967295|f>>>9),f=d+(p^m^w)+I[13]+681279174&4294967295,d=p+(f<<4&4294967295|f>>>28),f=w+(d^p^m)+I[0]+3936430074&4294967295,w=d+(f<<11&4294967295|f>>>21),f=m+(w^d^p)+I[3]+3572445317&4294967295,m=w+(f<<16&4294967295|f>>>16),f=p+(m^w^d)+I[6]+76029189&4294967295,p=m+(f<<23&4294967295|f>>>9),f=d+(p^m^w)+I[9]+3654602809&4294967295,d=p+(f<<4&4294967295|f>>>28),f=w+(d^p^m)+I[12]+3873151461&4294967295,w=d+(f<<11&4294967295|f>>>21),f=m+(w^d^p)+I[15]+530742520&4294967295,m=w+(f<<16&4294967295|f>>>16),f=p+(m^w^d)+I[2]+3299628645&4294967295,p=m+(f<<23&4294967295|f>>>9),f=d+(m^(p|~w))+I[0]+4096336452&4294967295,d=p+(f<<6&4294967295|f>>>26),f=w+(p^(d|~m))+I[7]+1126891415&4294967295,w=d+(f<<10&4294967295|f>>>22),f=m+(d^(w|~p))+I[14]+2878612391&4294967295,m=w+(f<<15&4294967295|f>>>17),f=p+(w^(m|~d))+I[5]+4237533241&4294967295,p=m+(f<<21&4294967295|f>>>11),f=d+(m^(p|~w))+I[12]+1700485571&4294967295,d=p+(f<<6&4294967295|f>>>26),f=w+(p^(d|~m))+I[3]+2399980690&4294967295,w=d+(f<<10&4294967295|f>>>22),f=m+(d^(w|~p))+I[10]+4293915773&4294967295,m=w+(f<<15&4294967295|f>>>17),f=p+(w^(m|~d))+I[1]+2240044497&4294967295,p=m+(f<<21&4294967295|f>>>11),f=d+(m^(p|~w))+I[8]+1873313359&4294967295,d=p+(f<<6&4294967295|f>>>26),f=w+(p^(d|~m))+I[15]+4264355552&4294967295,w=d+(f<<10&4294967295|f>>>22),f=m+(d^(w|~p))+I[6]+2734768916&4294967295,m=w+(f<<15&4294967295|f>>>17),f=p+(w^(m|~d))+I[13]+1309151649&4294967295,p=m+(f<<21&4294967295|f>>>11),f=d+(m^(p|~w))+I[4]+4149444226&4294967295,d=p+(f<<6&4294967295|f>>>26),f=w+(p^(d|~m))+I[11]+3174756917&4294967295,w=d+(f<<10&4294967295|f>>>22),f=m+(d^(w|~p))+I[2]+718787259&4294967295,m=w+(f<<15&4294967295|f>>>17),f=p+(w^(m|~d))+I[9]+3951481745&4294967295,_.g[0]=_.g[0]+d&4294967295,_.g[1]=_.g[1]+(m+(f<<21&4294967295|f>>>11))&4294967295,_.g[2]=_.g[2]+m&4294967295,_.g[3]=_.g[3]+w&4294967295}r.prototype.v=function(_,d){d===void 0&&(d=_.length);const p=d-this.blockSize,I=this.C;let m=this.h,w=0;for(;w<d;){if(m==0)for(;w<=p;)s(this,_,w),w+=this.blockSize;if(typeof _=="string"){for(;w<d;)if(I[m++]=_.charCodeAt(w++),m==this.blockSize){s(this,I),m=0;break}}else for(;w<d;)if(I[m++]=_[w++],m==this.blockSize){s(this,I),m=0;break}}this.h=m,this.o+=d},r.prototype.A=function(){var _=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);_[0]=128;for(var d=1;d<_.length-8;++d)_[d]=0;d=this.o*8;for(var p=_.length-8;p<_.length;++p)_[p]=d&255,d/=256;for(this.v(_),_=Array(16),d=0,p=0;p<4;++p)for(let I=0;I<32;I+=8)_[d++]=this.g[p]>>>I&255;return _};function a(_,d){var p=u;return Object.prototype.hasOwnProperty.call(p,_)?p[_]:p[_]=d(_)}function h(_,d){this.h=d;const p=[];let I=!0;for(let m=_.length-1;m>=0;m--){const w=_[m]|0;I&&w==d||(p[m]=w,I=!1)}this.g=p}var u={};function g(_){return-128<=_&&_<128?a(_,function(d){return new h([d|0],d<0?-1:0)}):new h([_|0],_<0?-1:0)}function E(_){if(isNaN(_)||!isFinite(_))return b;if(_<0)return j(E(-_));const d=[];let p=1;for(let I=0;_>=p;I++)d[I]=_/p|0,p*=4294967296;return new h(d,0)}function R(_,d){if(_.length==0)throw Error("number format error: empty string");if(d=d||10,d<2||36<d)throw Error("radix out of range: "+d);if(_.charAt(0)=="-")return j(R(_.substring(1),d));if(_.indexOf("-")>=0)throw Error('number format error: interior "-" character');const p=E(Math.pow(d,8));let I=b;for(let w=0;w<_.length;w+=8){var m=Math.min(8,_.length-w);const f=parseInt(_.substring(w,w+m),d);m<8?(m=E(Math.pow(d,m)),I=I.j(m).add(E(f))):(I=I.j(p),I=I.add(E(f)))}return I}var b=g(0),S=g(1),M=g(16777216);n=h.prototype,n.m=function(){if(W(this))return-j(this).m();let _=0,d=1;for(let p=0;p<this.g.length;p++){const I=this.i(p);_+=(I>=0?I:4294967296+I)*d,d*=4294967296}return _},n.toString=function(_){if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(U(this))return"0";if(W(this))return"-"+j(this).toString(_);const d=E(Math.pow(_,6));var p=this;let I="";for(;;){const m=xe(p,d).g;p=re(p,m.j(d));let w=((p.g.length>0?p.g[0]:p.h)>>>0).toString(_);if(p=m,U(p))return w+I;for(;w.length<6;)w="0"+w;I=w+I}},n.i=function(_){return _<0?0:_<this.g.length?this.g[_]:this.h};function U(_){if(_.h!=0)return!1;for(let d=0;d<_.g.length;d++)if(_.g[d]!=0)return!1;return!0}function W(_){return _.h==-1}n.l=function(_){return _=re(this,_),W(_)?-1:U(_)?0:1};function j(_){const d=_.g.length,p=[];for(let I=0;I<d;I++)p[I]=~_.g[I];return new h(p,~_.h).add(S)}n.abs=function(){return W(this)?j(this):this},n.add=function(_){const d=Math.max(this.g.length,_.g.length),p=[];let I=0;for(let m=0;m<=d;m++){let w=I+(this.i(m)&65535)+(_.i(m)&65535),f=(w>>>16)+(this.i(m)>>>16)+(_.i(m)>>>16);I=f>>>16,w&=65535,f&=65535,p[m]=f<<16|w}return new h(p,p[p.length-1]&-2147483648?-1:0)};function re(_,d){return _.add(j(d))}n.j=function(_){if(U(this)||U(_))return b;if(W(this))return W(_)?j(this).j(j(_)):j(j(this).j(_));if(W(_))return j(this.j(j(_)));if(this.l(M)<0&&_.l(M)<0)return E(this.m()*_.m());const d=this.g.length+_.g.length,p=[];for(var I=0;I<2*d;I++)p[I]=0;for(I=0;I<this.g.length;I++)for(let m=0;m<_.g.length;m++){const w=this.i(I)>>>16,f=this.i(I)&65535,ne=_.i(m)>>>16,tt=_.i(m)&65535;p[2*I+2*m]+=f*tt,se(p,2*I+2*m),p[2*I+2*m+1]+=w*tt,se(p,2*I+2*m+1),p[2*I+2*m+1]+=f*ne,se(p,2*I+2*m+1),p[2*I+2*m+2]+=w*ne,se(p,2*I+2*m+2)}for(_=0;_<d;_++)p[_]=p[2*_+1]<<16|p[2*_];for(_=d;_<2*d;_++)p[_]=0;return new h(p,0)};function se(_,d){for(;(_[d]&65535)!=_[d];)_[d+1]+=_[d]>>>16,_[d]&=65535,d++}function ce(_,d){this.g=_,this.h=d}function xe(_,d){if(U(d))throw Error("division by zero");if(U(_))return new ce(b,b);if(W(_))return d=xe(j(_),d),new ce(j(d.g),j(d.h));if(W(d))return d=xe(_,j(d)),new ce(j(d.g),d.h);if(_.g.length>30){if(W(_)||W(d))throw Error("slowDivide_ only works with positive integers.");for(var p=S,I=d;I.l(_)<=0;)p=je(p),I=je(I);var m=he(p,1),w=he(I,1);for(I=he(I,2),p=he(p,2);!U(I);){var f=w.add(I);f.l(_)<=0&&(m=m.add(p),w=f),I=he(I,1),p=he(p,1)}return d=re(_,m.j(d)),new ce(m,d)}for(m=b;_.l(d)>=0;){for(p=Math.max(1,Math.floor(_.m()/d.m())),I=Math.ceil(Math.log(p)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),w=E(p),f=w.j(d);W(f)||f.l(_)>0;)p-=I,w=E(p),f=w.j(d);U(w)&&(w=S),m=m.add(w),_=re(_,f)}return new ce(m,_)}n.B=function(_){return xe(this,_).h},n.and=function(_){const d=Math.max(this.g.length,_.g.length),p=[];for(let I=0;I<d;I++)p[I]=this.i(I)&_.i(I);return new h(p,this.h&_.h)},n.or=function(_){const d=Math.max(this.g.length,_.g.length),p=[];for(let I=0;I<d;I++)p[I]=this.i(I)|_.i(I);return new h(p,this.h|_.h)},n.xor=function(_){const d=Math.max(this.g.length,_.g.length),p=[];for(let I=0;I<d;I++)p[I]=this.i(I)^_.i(I);return new h(p,this.h^_.h)};function je(_){const d=_.g.length+1,p=[];for(let I=0;I<d;I++)p[I]=_.i(I)<<1|_.i(I-1)>>>31;return new h(p,_.h)}function he(_,d){const p=d>>5;d%=32;const I=_.g.length-p,m=[];for(let w=0;w<I;w++)m[w]=d>0?_.i(w+p)>>>d|_.i(w+p+1)<<32-d:_.i(w+p);return new h(m,_.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.B,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=E,h.fromString=R,Fr=h}).apply(typeof bo<"u"?bo:typeof self<"u"?self:typeof window<"u"?window:{});var Un=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var n,e=Object.defineProperty;function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof Un=="object"&&Un];for(var o=0;o<i.length;++o){var c=i[o];if(c&&c.Math==Math)return c}throw Error("Cannot find global object")}var r=t(this);function s(i,o){if(o)e:{var c=r;i=i.split(".");for(var l=0;l<i.length-1;l++){var y=i[l];if(!(y in c))break e;c=c[y]}i=i[i.length-1],l=c[i],o=o(l),o!=l&&o!=null&&e(c,i,{configurable:!0,writable:!0,value:o})}}s("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(i){return i||function(o){var c=[],l;for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&c.push([l,o[l]]);return c}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},h=this||self;function u(i){var o=typeof i;return o=="object"&&i!=null||o=="function"}function g(i,o,c){return i.call.apply(i.bind,arguments)}function E(i,o,c){return E=g,E.apply(null,arguments)}function R(i,o){var c=Array.prototype.slice.call(arguments,1);return function(){var l=c.slice();return l.push.apply(l,arguments),i.apply(this,l)}}function b(i,o){function c(){}c.prototype=o.prototype,i.Z=o.prototype,i.prototype=new c,i.prototype.constructor=i,i.Ob=function(l,y,T){for(var A=Array(arguments.length-2),C=2;C<arguments.length;C++)A[C-2]=arguments[C];return o.prototype[y].apply(l,A)}}var S=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function M(i){const o=i.length;if(o>0){const c=Array(o);for(let l=0;l<o;l++)c[l]=i[l];return c}return[]}function U(i,o){for(let l=1;l<arguments.length;l++){const y=arguments[l];var c=typeof y;if(c=c!="object"?c:y?Array.isArray(y)?"array":c:"null",c=="array"||c=="object"&&typeof y.length=="number"){c=i.length||0;const T=y.length||0;i.length=c+T;for(let A=0;A<T;A++)i[c+A]=y[A]}else i.push(y)}}class W{constructor(o,c){this.i=o,this.j=c,this.h=0,this.g=null}get(){let o;return this.h>0?(this.h--,o=this.g,this.g=o.next,o.next=null):o=this.i(),o}}function j(i){h.setTimeout(()=>{throw i},0)}function re(){var i=_;let o=null;return i.g&&(o=i.g,i.g=i.g.next,i.g||(i.h=null),o.next=null),o}class se{constructor(){this.h=this.g=null}add(o,c){const l=ce.get();l.set(o,c),this.h?this.h.next=l:this.g=l,this.h=l}}var ce=new W(()=>new xe,i=>i.reset());class xe{constructor(){this.next=this.g=this.h=null}set(o,c){this.h=o,this.g=c,this.next=null}reset(){this.next=this.g=this.h=null}}let je,he=!1,_=new se,d=()=>{const i=Promise.resolve(void 0);je=()=>{i.then(p)}};function p(){for(var i;i=re();){try{i.h.call(i.g)}catch(c){j(c)}var o=ce;o.j(i),o.h<100&&(o.h++,i.next=o.g,o.g=i)}he=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function m(i,o){this.type=i,this.g=this.target=o,this.defaultPrevented=!1}m.prototype.h=function(){this.defaultPrevented=!0};var w=(function(){if(!h.addEventListener||!Object.defineProperty)return!1;var i=!1,o=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const c=()=>{};h.addEventListener("test",c,o),h.removeEventListener("test",c,o)}catch{}return i})();function f(i){return/^[\s\xa0]*$/.test(i)}function ne(i,o){m.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,o)}b(ne,m),ne.prototype.init=function(i,o){const c=this.type=i.type,l=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=o,o=i.relatedTarget,o||(c=="mouseover"?o=i.fromElement:c=="mouseout"&&(o=i.toElement)),this.relatedTarget=o,l?(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&ne.Z.h.call(this)},ne.prototype.h=function(){ne.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var tt="closure_listenable_"+(Math.random()*1e6|0),Wc=0;function qc(i,o,c,l,y){this.listener=i,this.proxy=null,this.src=o,this.type=c,this.capture=!!l,this.ha=y,this.key=++Wc,this.da=this.fa=!1}function Tn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function vn(i,o,c){for(const l in i)o.call(c,i[l],l,i)}function zc(i,o){for(const c in i)o.call(void 0,i[c],c,i)}function Gr(i){const o={};for(const c in i)o[c]=i[c];return o}const Kr="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Yr(i,o){let c,l;for(let y=1;y<arguments.length;y++){l=arguments[y];for(c in l)i[c]=l[c];for(let T=0;T<Kr.length;T++)c=Kr[T],Object.prototype.hasOwnProperty.call(l,c)&&(i[c]=l[c])}}function An(i){this.src=i,this.g={},this.h=0}An.prototype.add=function(i,o,c,l,y){const T=i.toString();i=this.g[T],i||(i=this.g[T]=[],this.h++);const A=mi(i,o,l,y);return A>-1?(o=i[A],c||(o.fa=!1)):(o=new qc(o,this.src,T,!!l,y),o.fa=c,i.push(o)),o};function gi(i,o){const c=o.type;if(c in i.g){var l=i.g[c],y=Array.prototype.indexOf.call(l,o,void 0),T;(T=y>=0)&&Array.prototype.splice.call(l,y,1),T&&(Tn(o),i.g[c].length==0&&(delete i.g[c],i.h--))}}function mi(i,o,c,l){for(let y=0;y<i.length;++y){const T=i[y];if(!T.da&&T.listener==o&&T.capture==!!c&&T.ha==l)return y}return-1}var _i="closure_lm_"+(Math.random()*1e6|0),Ii={};function Jr(i,o,c,l,y){if(Array.isArray(o)){for(let T=0;T<o.length;T++)Jr(i,o[T],c,l,y);return null}return c=Zr(c),i&&i[tt]?i.J(o,c,u(l)?!!l.capture:!1,y):Gc(i,o,c,!1,l,y)}function Gc(i,o,c,l,y,T){if(!o)throw Error("Invalid event type");const A=u(y)?!!y.capture:!!y;let C=wi(i);if(C||(i[_i]=C=new An(i)),c=C.add(o,c,l,A,T),c.proxy)return c;if(l=Kc(),c.proxy=l,l.src=i,l.listener=c,i.addEventListener)w||(y=A),y===void 0&&(y=!1),i.addEventListener(o.toString(),l,y);else if(i.attachEvent)i.attachEvent(Qr(o.toString()),l);else if(i.addListener&&i.removeListener)i.addListener(l);else throw Error("addEventListener and attachEvent are unavailable.");return c}function Kc(){function i(c){return o.call(i.src,i.listener,c)}const o=Yc;return i}function Xr(i,o,c,l,y){if(Array.isArray(o))for(var T=0;T<o.length;T++)Xr(i,o[T],c,l,y);else l=u(l)?!!l.capture:!!l,c=Zr(c),i&&i[tt]?(i=i.i,T=String(o).toString(),T in i.g&&(o=i.g[T],c=mi(o,c,l,y),c>-1&&(Tn(o[c]),Array.prototype.splice.call(o,c,1),o.length==0&&(delete i.g[T],i.h--)))):i&&(i=wi(i))&&(o=i.g[o.toString()],i=-1,o&&(i=mi(o,c,l,y)),(c=i>-1?o[i]:null)&&yi(c))}function yi(i){if(typeof i!="number"&&i&&!i.da){var o=i.src;if(o&&o[tt])gi(o.i,i);else{var c=i.type,l=i.proxy;o.removeEventListener?o.removeEventListener(c,l,i.capture):o.detachEvent?o.detachEvent(Qr(c),l):o.addListener&&o.removeListener&&o.removeListener(l),(c=wi(o))?(gi(c,i),c.h==0&&(c.src=null,o[_i]=null)):Tn(i)}}}function Qr(i){return i in Ii?Ii[i]:Ii[i]="on"+i}function Yc(i,o){if(i.da)i=!0;else{o=new ne(o,this);const c=i.listener,l=i.ha||i.src;i.fa&&yi(i),i=c.call(l,o)}return i}function wi(i){return i=i[_i],i instanceof An?i:null}var Ei="__closure_events_fn_"+(Math.random()*1e9>>>0);function Zr(i){return typeof i=="function"?i:(i[Ei]||(i[Ei]=function(o){return i.handleEvent(o)}),i[Ei])}function J(){I.call(this),this.i=new An(this),this.M=this,this.G=null}b(J,I),J.prototype[tt]=!0,J.prototype.removeEventListener=function(i,o,c,l){Xr(this,i,o,c,l)};function X(i,o){var c,l=i.G;if(l)for(c=[];l;l=l.G)c.push(l);if(i=i.M,l=o.type||o,typeof o=="string")o=new m(o,i);else if(o instanceof m)o.target=o.target||i;else{var y=o;o=new m(l,i),Yr(o,y)}y=!0;let T,A;if(c)for(A=c.length-1;A>=0;A--)T=o.g=c[A],y=Sn(T,l,!0,o)&&y;if(T=o.g=i,y=Sn(T,l,!0,o)&&y,y=Sn(T,l,!1,o)&&y,c)for(A=0;A<c.length;A++)T=o.g=c[A],y=Sn(T,l,!1,o)&&y}J.prototype.N=function(){if(J.Z.N.call(this),this.i){var i=this.i;for(const o in i.g){const c=i.g[o];for(let l=0;l<c.length;l++)Tn(c[l]);delete i.g[o],i.h--}}this.G=null},J.prototype.J=function(i,o,c,l){return this.i.add(String(i),o,!1,c,l)},J.prototype.K=function(i,o,c,l){return this.i.add(String(i),o,!0,c,l)};function Sn(i,o,c,l){if(o=i.i.g[String(o)],!o)return!0;o=o.concat();let y=!0;for(let T=0;T<o.length;++T){const A=o[T];if(A&&!A.da&&A.capture==c){const C=A.listener,G=A.ha||A.src;A.fa&&gi(i.i,A),y=C.call(G,l)!==!1&&y}}return y&&!l.defaultPrevented}function Jc(i,o){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=E(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(o)>2147483647?-1:h.setTimeout(i,o||0)}function es(i){i.g=Jc(()=>{i.g=null,i.i&&(i.i=!1,es(i))},i.l);const o=i.h;i.h=null,i.m.apply(null,o)}class Xc extends I{constructor(o,c){super(),this.m=o,this.l=c,this.h=null,this.i=!1,this.g=null}j(o){this.h=arguments,this.g?this.i=!0:es(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ut(i){I.call(this),this.h=i,this.g={}}b(Ut,I);var ts=[];function ns(i){vn(i.g,function(o,c){this.g.hasOwnProperty(c)&&yi(o)},i),i.g={}}Ut.prototype.N=function(){Ut.Z.N.call(this),ns(this)},Ut.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ti=h.JSON.stringify,Qc=h.JSON.parse,Zc=class{stringify(i){return h.JSON.stringify(i,void 0)}parse(i){return h.JSON.parse(i,void 0)}};function is(){}function eh(){}var Ft={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function vi(){m.call(this,"d")}b(vi,m);function Ai(){m.call(this,"c")}b(Ai,m);var wt={},rs=null;function Si(){return rs=rs||new J}wt.Ia="serverreachability";function ss(i){m.call(this,wt.Ia,i)}b(ss,m);function Vt(i){const o=Si();X(o,new ss(o))}wt.STAT_EVENT="statevent";function os(i,o){m.call(this,wt.STAT_EVENT,i),this.stat=o}b(os,m);function Q(i){const o=Si();X(o,new os(o,i))}wt.Ja="timingevent";function as(i,o){m.call(this,wt.Ja,i),this.size=o}b(as,m);function xt(i,o){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){i()},o)}function jt(){this.g=!0}jt.prototype.ua=function(){this.g=!1};function th(i,o,c,l,y,T){i.info(function(){if(i.g)if(T){var A="",C=T.split("&");for(let L=0;L<C.length;L++){var G=C[L].split("=");if(G.length>1){const K=G[0];G=G[1];const ye=K.split("_");A=ye.length>=2&&ye[1]=="type"?A+(K+"="+G+"&"):A+(K+"=redacted&")}}}else A=null;else A=T;return"XMLHTTP REQ ("+l+") [attempt "+y+"]: "+o+`
`+c+`
`+A})}function nh(i,o,c,l,y,T,A){i.info(function(){return"XMLHTTP RESP ("+l+") [ attempt "+y+"]: "+o+`
`+c+`
`+T+" "+A})}function Et(i,o,c,l){i.info(function(){return"XMLHTTP TEXT ("+o+"): "+rh(i,c)+(l?" "+l:"")})}function ih(i,o){i.info(function(){return"TIMEOUT: "+o})}jt.prototype.info=function(){};function rh(i,o){if(!i.g)return o;if(!o)return null;try{const T=JSON.parse(o);if(T){for(i=0;i<T.length;i++)if(Array.isArray(T[i])){var c=T[i];if(!(c.length<2)){var l=c[1];if(Array.isArray(l)&&!(l.length<1)){var y=l[0];if(y!="noop"&&y!="stop"&&y!="close")for(let A=1;A<l.length;A++)l[A]=""}}}}return Ti(T)}catch{return o}}var bi={NO_ERROR:0,TIMEOUT:8},sh={},cs;function Ri(){}b(Ri,is),Ri.prototype.g=function(){return new XMLHttpRequest},cs=new Ri;function Ht(i){return encodeURIComponent(String(i))}function oh(i){var o=1;i=i.split(":");const c=[];for(;o>0&&i.length;)c.push(i.shift()),o--;return i.length&&c.push(i.join(":")),c}function He(i,o,c,l){this.j=i,this.i=o,this.l=c,this.S=l||1,this.V=new Ut(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new hs}function hs(){this.i=null,this.g="",this.h=!1}var ls={},Pi={};function Ci(i,o,c){i.M=1,i.A=Rn(Ie(o)),i.u=c,i.R=!0,us(i,null)}function us(i,o){i.F=Date.now(),bn(i),i.B=Ie(i.A);var c=i.B,l=i.S;Array.isArray(l)||(l=[String(l)]),As(c.i,"t",l),i.C=0,c=i.j.L,i.h=new hs,i.g=Bs(i.j,c?o:null,!i.u),i.P>0&&(i.O=new Xc(E(i.Y,i,i.g),i.P)),o=i.V,c=i.g,l=i.ba;var y="readystatechange";Array.isArray(y)||(y&&(ts[0]=y.toString()),y=ts);for(let T=0;T<y.length;T++){const A=Jr(c,y[T],l||o.handleEvent,!1,o.h||o);if(!A)break;o.g[A.key]=A}o=i.J?Gr(i.J):{},i.u?(i.v||(i.v="POST"),o["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,o)):(i.v="GET",i.g.ea(i.B,i.v,null,o)),Vt(),th(i.i,i.v,i.B,i.l,i.S,i.u)}He.prototype.ba=function(i){i=i.target;const o=this.O;o&&We(i)==3?o.j():this.Y(i)},He.prototype.Y=function(i){try{if(i==this.g)e:{const C=We(this.g),G=this.g.ya(),L=this.g.ca();if(!(C<3)&&(C!=3||this.g&&(this.h.h||this.g.la()||Ns(this.g)))){this.K||C!=4||G==7||(G==8||L<=0?Vt(3):Vt(2)),ki(this);var o=this.g.ca();this.X=o;var c=ah(this);if(this.o=o==200,nh(this.i,this.v,this.B,this.l,this.S,C,o),this.o){if(this.U&&!this.L){t:{if(this.g){var l,y=this.g;if((l=y.g?y.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!f(l)){var T=l;break t}}T=null}if(i=T)Et(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Ni(this,i);else{this.o=!1,this.m=3,Q(12),nt(this),Bt(this);break e}}if(this.R){i=!0;let K;for(;!this.K&&this.C<c.length;)if(K=ch(this,c),K==Pi){C==4&&(this.m=4,Q(14),i=!1),Et(this.i,this.l,null,"[Incomplete Response]");break}else if(K==ls){this.m=4,Q(15),Et(this.i,this.l,c,"[Invalid Chunk]"),i=!1;break}else Et(this.i,this.l,K,null),Ni(this,K);if(ds(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),C!=4||c.length!=0||this.h.h||(this.m=1,Q(16),i=!1),this.o=this.o&&i,!i)Et(this.i,this.l,c,"[Invalid Chunked Response]"),nt(this),Bt(this);else if(c.length>0&&!this.W){this.W=!0;var A=this.j;A.g==this&&A.aa&&!A.P&&(A.j.info("Great, no buffering proxy detected. Bytes received: "+c.length),xi(A),A.P=!0,Q(11))}}else Et(this.i,this.l,c,null),Ni(this,c);C==4&&nt(this),this.o&&!this.K&&(C==4?Vs(this.j,this):(this.o=!1,bn(this)))}else Th(this.g),o==400&&c.indexOf("Unknown SID")>0?(this.m=3,Q(12)):(this.m=0,Q(13)),nt(this),Bt(this)}}}catch{}finally{}};function ah(i){if(!ds(i))return i.g.la();const o=Ns(i.g);if(o==="")return"";let c="";const l=o.length,y=We(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return nt(i),Bt(i),"";i.h.i=new h.TextDecoder}for(let T=0;T<l;T++)i.h.h=!0,c+=i.h.i.decode(o[T],{stream:!(y&&T==l-1)});return o.length=0,i.h.g+=c,i.C=0,i.h.g}function ds(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function ch(i,o){var c=i.C,l=o.indexOf(`
`,c);return l==-1?Pi:(c=Number(o.substring(c,l)),isNaN(c)?ls:(l+=1,l+c>o.length?Pi:(o=o.slice(l,l+c),i.C=l+c,o)))}He.prototype.cancel=function(){this.K=!0,nt(this)};function bn(i){i.T=Date.now()+i.H,fs(i,i.H)}function fs(i,o){if(i.D!=null)throw Error("WatchDog timer not null");i.D=xt(E(i.aa,i),o)}function ki(i){i.D&&(h.clearTimeout(i.D),i.D=null)}He.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(ih(this.i,this.B),this.M!=2&&(Vt(),Q(17)),nt(this),this.m=2,Bt(this)):fs(this,this.T-i)};function Bt(i){i.j.I==0||i.K||Vs(i.j,i)}function nt(i){ki(i);var o=i.O;o&&typeof o.dispose=="function"&&o.dispose(),i.O=null,ns(i.V),i.g&&(o=i.g,i.g=null,o.abort(),o.dispose())}function Ni(i,o){try{var c=i.j;if(c.I!=0&&(c.g==i||Oi(c.h,i))){if(!i.L&&Oi(c.h,i)&&c.I==3){try{var l=c.Ba.g.parse(o)}catch{l=null}if(Array.isArray(l)&&l.length==3){var y=l;if(y[0]==0){e:if(!c.v){if(c.g)if(c.g.F+3e3<i.F)On(c),kn(c);else break e;Vi(c),Q(18)}}else c.xa=y[1],0<c.xa-c.K&&y[2]<37500&&c.F&&c.A==0&&!c.C&&(c.C=xt(E(c.Va,c),6e3));ms(c.h)<=1&&c.ta&&(c.ta=void 0)}else rt(c,11)}else if((i.L||c.g==i)&&On(c),!f(o))for(y=c.Ba.g.parse(o),o=0;o<y.length;o++){let L=y[o];const K=L[0];if(!(K<=c.K))if(c.K=K,L=L[1],c.I==2)if(L[0]=="c"){c.M=L[1],c.ba=L[2];const ye=L[3];ye!=null&&(c.ka=ye,c.j.info("VER="+c.ka));const st=L[4];st!=null&&(c.za=st,c.j.info("SVER="+c.za));const qe=L[5];qe!=null&&typeof qe=="number"&&qe>0&&(l=1.5*qe,c.O=l,c.j.info("backChannelRequestTimeoutMs_="+l)),l=c;const ze=i.g;if(ze){const Dn=ze.g?ze.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Dn){var T=l.h;T.g||Dn.indexOf("spdy")==-1&&Dn.indexOf("quic")==-1&&Dn.indexOf("h2")==-1||(T.j=T.l,T.g=new Set,T.h&&(Di(T,T.h),T.h=null))}if(l.G){const ji=ze.g?ze.g.getResponseHeader("X-HTTP-Session-Id"):null;ji&&(l.wa=ji,F(l.J,l.G,ji))}}c.I=3,c.l&&c.l.ra(),c.aa&&(c.T=Date.now()-i.F,c.j.info("Handshake RTT: "+c.T+"ms")),l=c;var A=i;if(l.na=Hs(l,l.L?l.ba:null,l.W),A.L){_s(l.h,A);var C=A,G=l.O;G&&(C.H=G),C.D&&(ki(C),bn(C)),l.g=A}else Us(l);c.i.length>0&&Nn(c)}else L[0]!="stop"&&L[0]!="close"||rt(c,7);else c.I==3&&(L[0]=="stop"||L[0]=="close"?L[0]=="stop"?rt(c,7):Fi(c):L[0]!="noop"&&c.l&&c.l.qa(L),c.A=0)}}Vt(4)}catch{}}var hh=class{constructor(i,o){this.g=i,this.map=o}};function ps(i){this.l=i||10,h.PerformanceNavigationTiming?(i=h.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function gs(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function ms(i){return i.h?1:i.g?i.g.size:0}function Oi(i,o){return i.h?i.h==o:i.g?i.g.has(o):!1}function Di(i,o){i.g?i.g.add(o):i.h=o}function _s(i,o){i.h&&i.h==o?i.h=null:i.g&&i.g.has(o)&&i.g.delete(o)}ps.prototype.cancel=function(){if(this.i=Is(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Is(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let o=i.i;for(const c of i.g.values())o=o.concat(c.G);return o}return M(i.i)}var ys=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function lh(i,o){if(i){i=i.split("&");for(let c=0;c<i.length;c++){const l=i[c].indexOf("=");let y,T=null;l>=0?(y=i[c].substring(0,l),T=i[c].substring(l+1)):y=i[c],o(y,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function Be(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let o;i instanceof Be?(this.l=i.l,$t(this,i.j),this.o=i.o,this.g=i.g,Wt(this,i.u),this.h=i.h,Li(this,Ss(i.i)),this.m=i.m):i&&(o=String(i).match(ys))?(this.l=!1,$t(this,o[1]||"",!0),this.o=qt(o[2]||""),this.g=qt(o[3]||"",!0),Wt(this,o[4]),this.h=qt(o[5]||"",!0),Li(this,o[6]||"",!0),this.m=qt(o[7]||"")):(this.l=!1,this.i=new Gt(null,this.l))}Be.prototype.toString=function(){const i=[];var o=this.j;o&&i.push(zt(o,ws,!0),":");var c=this.g;return(c||o=="file")&&(i.push("//"),(o=this.o)&&i.push(zt(o,ws,!0),"@"),i.push(Ht(c).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.u,c!=null&&i.push(":",String(c))),(c=this.h)&&(this.g&&c.charAt(0)!="/"&&i.push("/"),i.push(zt(c,c.charAt(0)=="/"?fh:dh,!0))),(c=this.i.toString())&&i.push("?",c),(c=this.m)&&i.push("#",zt(c,gh)),i.join("")},Be.prototype.resolve=function(i){const o=Ie(this);let c=!!i.j;c?$t(o,i.j):c=!!i.o,c?o.o=i.o:c=!!i.g,c?o.g=i.g:c=i.u!=null;var l=i.h;if(c)Wt(o,i.u);else if(c=!!i.h){if(l.charAt(0)!="/")if(this.g&&!this.h)l="/"+l;else{var y=o.h.lastIndexOf("/");y!=-1&&(l=o.h.slice(0,y+1)+l)}if(y=l,y==".."||y==".")l="";else if(y.indexOf("./")!=-1||y.indexOf("/.")!=-1){l=y.lastIndexOf("/",0)==0,y=y.split("/");const T=[];for(let A=0;A<y.length;){const C=y[A++];C=="."?l&&A==y.length&&T.push(""):C==".."?((T.length>1||T.length==1&&T[0]!="")&&T.pop(),l&&A==y.length&&T.push("")):(T.push(C),l=!0)}l=T.join("/")}else l=y}return c?o.h=l:c=i.i.toString()!=="",c?Li(o,Ss(i.i)):c=!!i.m,c&&(o.m=i.m),o};function Ie(i){return new Be(i)}function $t(i,o,c){i.j=c?qt(o,!0):o,i.j&&(i.j=i.j.replace(/:$/,""))}function Wt(i,o){if(o){if(o=Number(o),isNaN(o)||o<0)throw Error("Bad port number "+o);i.u=o}else i.u=null}function Li(i,o,c){o instanceof Gt?(i.i=o,mh(i.i,i.l)):(c||(o=zt(o,ph)),i.i=new Gt(o,i.l))}function F(i,o,c){i.i.set(o,c)}function Rn(i){return F(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function qt(i,o){return i?o?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function zt(i,o,c){return typeof i=="string"?(i=encodeURI(i).replace(o,uh),c&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function uh(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var ws=/[#\/\?@]/g,dh=/[#\?:]/g,fh=/[#\?]/g,ph=/[#\?@]/g,gh=/#/g;function Gt(i,o){this.h=this.g=null,this.i=i||null,this.j=!!o}function it(i){i.g||(i.g=new Map,i.h=0,i.i&&lh(i.i,function(o,c){i.add(decodeURIComponent(o.replace(/\+/g," ")),c)}))}n=Gt.prototype,n.add=function(i,o){it(this),this.i=null,i=Tt(this,i);let c=this.g.get(i);return c||this.g.set(i,c=[]),c.push(o),this.h+=1,this};function Es(i,o){it(i),o=Tt(i,o),i.g.has(o)&&(i.i=null,i.h-=i.g.get(o).length,i.g.delete(o))}function Ts(i,o){return it(i),o=Tt(i,o),i.g.has(o)}n.forEach=function(i,o){it(this),this.g.forEach(function(c,l){c.forEach(function(y){i.call(o,y,l,this)},this)},this)};function vs(i,o){it(i);let c=[];if(typeof o=="string")Ts(i,o)&&(c=c.concat(i.g.get(Tt(i,o))));else for(i=Array.from(i.g.values()),o=0;o<i.length;o++)c=c.concat(i[o]);return c}n.set=function(i,o){return it(this),this.i=null,i=Tt(this,i),Ts(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[o]),this.h+=1,this},n.get=function(i,o){return i?(i=vs(this,i),i.length>0?String(i[0]):o):o};function As(i,o,c){Es(i,o),c.length>0&&(i.i=null,i.g.set(Tt(i,o),M(c)),i.h+=c.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],o=Array.from(this.g.keys());for(let l=0;l<o.length;l++){var c=o[l];const y=Ht(c);c=vs(this,c);for(let T=0;T<c.length;T++){let A=y;c[T]!==""&&(A+="="+Ht(c[T])),i.push(A)}}return this.i=i.join("&")};function Ss(i){const o=new Gt;return o.i=i.i,i.g&&(o.g=new Map(i.g),o.h=i.h),o}function Tt(i,o){return o=String(o),i.j&&(o=o.toLowerCase()),o}function mh(i,o){o&&!i.j&&(it(i),i.i=null,i.g.forEach(function(c,l){const y=l.toLowerCase();l!=y&&(Es(this,l),As(this,y,c))},i)),i.j=o}function _h(i,o){const c=new jt;if(h.Image){const l=new Image;l.onload=R($e,c,"TestLoadImage: loaded",!0,o,l),l.onerror=R($e,c,"TestLoadImage: error",!1,o,l),l.onabort=R($e,c,"TestLoadImage: abort",!1,o,l),l.ontimeout=R($e,c,"TestLoadImage: timeout",!1,o,l),h.setTimeout(function(){l.ontimeout&&l.ontimeout()},1e4),l.src=i}else o(!1)}function Ih(i,o){const c=new jt,l=new AbortController,y=setTimeout(()=>{l.abort(),$e(c,"TestPingServer: timeout",!1,o)},1e4);fetch(i,{signal:l.signal}).then(T=>{clearTimeout(y),T.ok?$e(c,"TestPingServer: ok",!0,o):$e(c,"TestPingServer: server error",!1,o)}).catch(()=>{clearTimeout(y),$e(c,"TestPingServer: error",!1,o)})}function $e(i,o,c,l,y){try{y&&(y.onload=null,y.onerror=null,y.onabort=null,y.ontimeout=null),l(c)}catch{}}function yh(){this.g=new Zc}function Mi(i){this.i=i.Sb||null,this.h=i.ab||!1}b(Mi,is),Mi.prototype.g=function(){return new Pn(this.i,this.h)};function Pn(i,o){J.call(this),this.H=i,this.o=o,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}b(Pn,J),n=Pn.prototype,n.open=function(i,o){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=o,this.readyState=1,Yt(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const o={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(o.body=i),(this.H||h).fetch(new Request(this.D,o)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Kt(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,Yt(this)),this.g&&(this.readyState=3,Yt(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;bs(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function bs(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var o=i.value?i.value:new Uint8Array(0);(o=this.B.decode(o,{stream:!i.done}))&&(this.response=this.responseText+=o)}i.done?Kt(this):Yt(this),this.readyState==3&&bs(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,Kt(this))},n.Na=function(i){this.g&&(this.response=i,Kt(this))},n.ga=function(){this.g&&Kt(this)};function Kt(i){i.readyState=4,i.l=null,i.j=null,i.B=null,Yt(i)}n.setRequestHeader=function(i,o){this.A.append(i,o)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],o=this.h.entries();for(var c=o.next();!c.done;)c=c.value,i.push(c[0]+": "+c[1]),c=o.next();return i.join(`\r
`)};function Yt(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(Pn.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Rs(i){let o="";return vn(i,function(c,l){o+=l,o+=":",o+=c,o+=`\r
`}),o}function Ui(i,o,c){e:{for(l in c){var l=!1;break e}l=!0}l||(c=Rs(c),typeof i=="string"?c!=null&&Ht(c):F(i,o,c))}function $(i){J.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}b($,J);var wh=/^https?$/i,Eh=["POST","PUT"];n=$.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,o,c,l){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);o=o?o.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():cs.g(),this.g.onreadystatechange=S(E(this.Ca,this));try{this.B=!0,this.g.open(o,String(i),!0),this.B=!1}catch(T){Ps(this,T);return}if(i=c||"",c=new Map(this.headers),l)if(Object.getPrototypeOf(l)===Object.prototype)for(var y in l)c.set(y,l[y]);else if(typeof l.keys=="function"&&typeof l.get=="function")for(const T of l.keys())c.set(T,l.get(T));else throw Error("Unknown input type for opt_headers: "+String(l));l=Array.from(c.keys()).find(T=>T.toLowerCase()=="content-type"),y=h.FormData&&i instanceof h.FormData,!(Array.prototype.indexOf.call(Eh,o,void 0)>=0)||l||y||c.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[T,A]of c)this.g.setRequestHeader(T,A);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(T){Ps(this,T)}};function Ps(i,o){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=o,i.o=5,Cs(i),Cn(i)}function Cs(i){i.A||(i.A=!0,X(i,"complete"),X(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,X(this,"complete"),X(this,"abort"),Cn(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Cn(this,!0)),$.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?ks(this):this.Xa())},n.Xa=function(){ks(this)};function ks(i){if(i.h&&typeof a<"u"){if(i.v&&We(i)==4)setTimeout(i.Ca.bind(i),0);else if(X(i,"readystatechange"),We(i)==4){i.h=!1;try{const T=i.ca();e:switch(T){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var o=!0;break e;default:o=!1}var c;if(!(c=o)){var l;if(l=T===0){let A=String(i.D).match(ys)[1]||null;!A&&h.self&&h.self.location&&(A=h.self.location.protocol.slice(0,-1)),l=!wh.test(A?A.toLowerCase():"")}c=l}if(c)X(i,"complete"),X(i,"success");else{i.o=6;try{var y=We(i)>2?i.g.statusText:""}catch{y=""}i.l=y+" ["+i.ca()+"]",Cs(i)}}finally{Cn(i)}}}}function Cn(i,o){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const c=i.g;i.g=null,o||X(i,"ready");try{c.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function We(i){return i.g?i.g.readyState:0}n.ca=function(){try{return We(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var o=this.g.responseText;return i&&o.indexOf(i)==0&&(o=o.substring(i.length)),Qc(o)}};function Ns(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Th(i){const o={};i=(i.g&&We(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let l=0;l<i.length;l++){if(f(i[l]))continue;var c=oh(i[l]);const y=c[0];if(c=c[1],typeof c!="string")continue;c=c.trim();const T=o[y]||[];o[y]=T,T.push(c)}zc(o,function(l){return l.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Jt(i,o,c){return c&&c.internalChannelParams&&c.internalChannelParams[i]||o}function Os(i){this.za=0,this.i=[],this.j=new jt,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Jt("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Jt("baseRetryDelayMs",5e3,i),this.Za=Jt("retryDelaySeedMs",1e4,i),this.Ta=Jt("forwardChannelMaxRetries",2,i),this.va=Jt("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new ps(i&&i.concurrentRequestLimit),this.Ba=new yh,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Os.prototype,n.ka=8,n.I=1,n.connect=function(i,o,c,l){Q(0),this.W=i,this.H=o||{},c&&l!==void 0&&(this.H.OSID=c,this.H.OAID=l),this.F=this.X,this.J=Hs(this,null,this.W),Nn(this)};function Fi(i){if(Ds(i),i.I==3){var o=i.V++,c=Ie(i.J);if(F(c,"SID",i.M),F(c,"RID",o),F(c,"TYPE","terminate"),Xt(i,c),o=new He(i,i.j,o),o.M=2,o.A=Rn(Ie(c)),c=!1,h.navigator&&h.navigator.sendBeacon)try{c=h.navigator.sendBeacon(o.A.toString(),"")}catch{}!c&&h.Image&&(new Image().src=o.A,c=!0),c||(o.g=Bs(o.j,null),o.g.ea(o.A)),o.F=Date.now(),bn(o)}js(i)}function kn(i){i.g&&(xi(i),i.g.cancel(),i.g=null)}function Ds(i){kn(i),i.v&&(h.clearTimeout(i.v),i.v=null),On(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&h.clearTimeout(i.m),i.m=null)}function Nn(i){if(!gs(i.h)&&!i.m){i.m=!0;var o=i.Ea;je||d(),he||(je(),he=!0),_.add(o,i),i.D=0}}function vh(i,o){return ms(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=o.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=xt(E(i.Ea,i,o),xs(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const y=new He(this,this.j,i);let T=this.o;if(this.U&&(T?(T=Gr(T),Yr(T,this.U)):T=this.U),this.u!==null||this.R||(y.J=T,T=null),this.S)e:{for(var o=0,c=0;c<this.i.length;c++){t:{var l=this.i[c];if("__data__"in l.map&&(l=l.map.__data__,typeof l=="string")){l=l.length;break t}l=void 0}if(l===void 0)break;if(o+=l,o>4096){o=c;break e}if(o===4096||c===this.i.length-1){o=c+1;break e}}o=1e3}else o=1e3;o=Ms(this,y,o),c=Ie(this.J),F(c,"RID",i),F(c,"CVER",22),this.G&&F(c,"X-HTTP-Session-Id",this.G),Xt(this,c),T&&(this.R?o="headers="+Ht(Rs(T))+"&"+o:this.u&&Ui(c,this.u,T)),Di(this.h,y),this.Ra&&F(c,"TYPE","init"),this.S?(F(c,"$req",o),F(c,"SID","null"),y.U=!0,Ci(y,c,null)):Ci(y,c,o),this.I=2}}else this.I==3&&(i?Ls(this,i):this.i.length==0||gs(this.h)||Ls(this))};function Ls(i,o){var c;o?c=o.l:c=i.V++;const l=Ie(i.J);F(l,"SID",i.M),F(l,"RID",c),F(l,"AID",i.K),Xt(i,l),i.u&&i.o&&Ui(l,i.u,i.o),c=new He(i,i.j,c,i.D+1),i.u===null&&(c.J=i.o),o&&(i.i=o.G.concat(i.i)),o=Ms(i,c,1e3),c.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),Di(i.h,c),Ci(c,l,o)}function Xt(i,o){i.H&&vn(i.H,function(c,l){F(o,l,c)}),i.l&&vn({},function(c,l){F(o,l,c)})}function Ms(i,o,c){c=Math.min(i.i.length,c);const l=i.l?E(i.l.Ka,i.l,i):null;e:{var y=i.i;let C=-1;for(;;){const G=["count="+c];C==-1?c>0?(C=y[0].g,G.push("ofs="+C)):C=0:G.push("ofs="+C);let L=!0;for(let K=0;K<c;K++){var T=y[K].g;const ye=y[K].map;if(T-=C,T<0)C=Math.max(0,y[K].g-100),L=!1;else try{T="req"+T+"_"||"";try{var A=ye instanceof Map?ye:Object.entries(ye);for(const[st,qe]of A){let ze=qe;u(qe)&&(ze=Ti(qe)),G.push(T+st+"="+encodeURIComponent(ze))}}catch(st){throw G.push(T+"type="+encodeURIComponent("_badmap")),st}}catch{l&&l(ye)}}if(L){A=G.join("&");break e}}A=void 0}return i=i.i.splice(0,c),o.G=i,A}function Us(i){if(!i.g&&!i.v){i.Y=1;var o=i.Da;je||d(),he||(je(),he=!0),_.add(o,i),i.A=0}}function Vi(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=xt(E(i.Da,i),xs(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,Fs(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=xt(E(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Q(10),kn(this),Fs(this))};function xi(i){i.B!=null&&(h.clearTimeout(i.B),i.B=null)}function Fs(i){i.g=new He(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var o=Ie(i.na);F(o,"RID","rpc"),F(o,"SID",i.M),F(o,"AID",i.K),F(o,"CI",i.F?"0":"1"),!i.F&&i.ia&&F(o,"TO",i.ia),F(o,"TYPE","xmlhttp"),Xt(i,o),i.u&&i.o&&Ui(o,i.u,i.o),i.O&&(i.g.H=i.O);var c=i.g;i=i.ba,c.M=1,c.A=Rn(Ie(o)),c.u=null,c.R=!0,us(c,i)}n.Va=function(){this.C!=null&&(this.C=null,kn(this),Vi(this),Q(19))};function On(i){i.C!=null&&(h.clearTimeout(i.C),i.C=null)}function Vs(i,o){var c=null;if(i.g==o){On(i),xi(i),i.g=null;var l=2}else if(Oi(i.h,o))c=o.G,_s(i.h,o),l=1;else return;if(i.I!=0){if(o.o)if(l==1){c=o.u?o.u.length:0,o=Date.now()-o.F;var y=i.D;l=Si(),X(l,new as(l,c)),Nn(i)}else Us(i);else if(y=o.m,y==3||y==0&&o.X>0||!(l==1&&vh(i,o)||l==2&&Vi(i)))switch(c&&c.length>0&&(o=i.h,o.i=o.i.concat(c)),y){case 1:rt(i,5);break;case 4:rt(i,10);break;case 3:rt(i,6);break;default:rt(i,2)}}}function xs(i,o){let c=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(c*=2),c*o}function rt(i,o){if(i.j.info("Error code "+o),o==2){var c=E(i.bb,i),l=i.Ua;const y=!l;l=new Be(l||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||$t(l,"https"),Rn(l),y?_h(l.toString(),c):Ih(l.toString(),c)}else Q(2);i.I=0,i.l&&i.l.pa(o),js(i),Ds(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),Q(2)):(this.j.info("Failed to ping google.com"),Q(1))};function js(i){if(i.I=0,i.ja=[],i.l){const o=Is(i.h);(o.length!=0||i.i.length!=0)&&(U(i.ja,o),U(i.ja,i.i),i.h.i.length=0,M(i.i),i.i.length=0),i.l.oa()}}function Hs(i,o,c){var l=c instanceof Be?Ie(c):new Be(c);if(l.g!="")o&&(l.g=o+"."+l.g),Wt(l,l.u);else{var y=h.location;l=y.protocol,o=o?o+"."+y.hostname:y.hostname,y=+y.port;const T=new Be(null);l&&$t(T,l),o&&(T.g=o),y&&Wt(T,y),c&&(T.h=c),l=T}return c=i.G,o=i.wa,c&&o&&F(l,c,o),F(l,"VER",i.ka),Xt(i,l),l}function Bs(i,o,c){if(o&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return o=i.Aa&&!i.ma?new $(new Mi({ab:c})):new $(i.ma),o.Fa(i.L),o}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function $s(){}n=$s.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function le(i,o){J.call(this),this.g=new Os(o),this.l=i,this.h=o&&o.messageUrlParams||null,i=o&&o.messageHeaders||null,o&&o.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=o&&o.initMessageHeaders||null,o&&o.messageContentType&&(i?i["X-WebChannel-Content-Type"]=o.messageContentType:i={"X-WebChannel-Content-Type":o.messageContentType}),o&&o.sa&&(i?i["X-WebChannel-Client-Profile"]=o.sa:i={"X-WebChannel-Client-Profile":o.sa}),this.g.U=i,(i=o&&o.Qb)&&!f(i)&&(this.g.u=i),this.A=o&&o.supportsCrossDomainXhr||!1,this.v=o&&o.sendRawJson||!1,(o=o&&o.httpSessionIdParam)&&!f(o)&&(this.g.G=o,i=this.h,i!==null&&o in i&&(i=this.h,o in i&&delete i[o])),this.j=new vt(this)}b(le,J),le.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},le.prototype.close=function(){Fi(this.g)},le.prototype.o=function(i){var o=this.g;if(typeof i=="string"){var c={};c.__data__=i,i=c}else this.v&&(c={},c.__data__=Ti(i),i=c);o.i.push(new hh(o.Ya++,i)),o.I==3&&Nn(o)},le.prototype.N=function(){this.g.l=null,delete this.j,Fi(this.g),delete this.g,le.Z.N.call(this)};function Ws(i){vi.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var o=i.__sm__;if(o){e:{for(const c in o){i=c;break e}i=void 0}(this.i=i)&&(i=this.i,o=o!==null&&i in o?o[i]:void 0),this.data=o}else this.data=i}b(Ws,vi);function qs(){Ai.call(this),this.status=1}b(qs,Ai);function vt(i){this.g=i}b(vt,$s),vt.prototype.ra=function(){X(this.g,"a")},vt.prototype.qa=function(i){X(this.g,new Ws(i))},vt.prototype.pa=function(i){X(this.g,new qs)},vt.prototype.oa=function(){X(this.g,"b")},le.prototype.send=le.prototype.o,le.prototype.open=le.prototype.m,le.prototype.close=le.prototype.close,bi.NO_ERROR=0,bi.TIMEOUT=8,bi.HTTP_ERROR=6,sh.COMPLETE="complete",eh.EventType=Ft,Ft.OPEN="a",Ft.CLOSE="b",Ft.ERROR="c",Ft.MESSAGE="d",J.prototype.listen=J.prototype.J,$.prototype.listenOnce=$.prototype.K,$.prototype.getLastError=$.prototype.Ha,$.prototype.getLastErrorCode=$.prototype.ya,$.prototype.getStatus=$.prototype.ca,$.prototype.getResponseJson=$.prototype.La,$.prototype.getResponseText=$.prototype.la,$.prototype.send=$.prototype.ea,$.prototype.setWithCredentials=$.prototype.Fa}).apply(typeof Un<"u"?Un:typeof self<"u"?self:typeof window<"u"?window:{});/**
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
 */class oe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}oe.UNAUTHENTICATED=new oe(null),oe.GOOGLE_CREDENTIALS=new oe("google-credentials-uid"),oe.FIRST_PARTY=new oe("first-party-uid"),oe.MOCK_USER=new oe("mock-user");/**
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
 */let di="12.9.0";function jp(n){di=n}/**
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
 */const Jn=new ti("@firebase/firestore");function ge(n,...e){if(Jn.logLevel<=D.DEBUG){const t=e.map(_c);Jn.debug(`Firestore (${di}): ${n}`,...t)}}function mc(n,...e){if(Jn.logLevel<=D.ERROR){const t=e.map(_c);Jn.error(`Firestore (${di}): ${n}`,...t)}}function _c(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
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
 */function Xn(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Ic(n,r,t)}function Ic(n,e,t){let r=`FIRESTORE (${di}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw mc(r),new Error(r)}function cn(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||Ic(e,s,r)}/**
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
 */const N={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class O extends _e{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class hn{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class Hp{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Bp{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(oe.UNAUTHENTICATED)))}shutdown(){}}class $p{constructor(e){this.t=e,this.currentUser=oe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){cn(this.o===void 0,42304);let r=this.i;const s=g=>this.i!==r?(r=this.i,t(g)):Promise.resolve();let a=new hn;this.o=()=>{this.i++,this.currentUser=this.u(),a.resolve(),a=new hn,e.enqueueRetryable((()=>s(this.currentUser)))};const h=()=>{const g=a;e.enqueueRetryable((async()=>{await g.promise,await s(this.currentUser)}))},u=g=>{ge("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>u(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?u(g):(ge("FirebaseAuthCredentialsProvider","Auth not yet detected"),a.resolve(),a=new hn)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.i!==e?(ge("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(cn(typeof r.accessToken=="string",31837,{l:r}),new Hp(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return cn(e===null||typeof e=="string",2055,{h:e}),new oe(e)}}class Wp{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=oe.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class qp{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new Wp(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(oe.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Ro{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class zp{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,H(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){cn(this.o===void 0,3512);const r=a=>{a.error!=null&&ge("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${a.error.message}`);const h=a.token!==this.m;return this.m=a.token,ge("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(a.token):Promise.resolve()};this.o=a=>{e.enqueueRetryable((()=>r(a)))};const s=a=>{ge("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=a,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((a=>s(a))),setTimeout((()=>{if(!this.appCheck){const a=this.V.getImmediate({optional:!0});a?s(a):ge("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Ro(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(cn(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Ro(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Gp(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */class Kp{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=Gp(40);for(let a=0;a<s.length;++a)r.length<20&&s[a]<t&&(r+=e.charAt(s[a]%62))}return r}}function Ze(n,e){return n<e?-1:n>e?1:0}function Yp(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),a=e.charAt(r);if(s!==a)return Zi(s)===Zi(a)?Ze(s,a):Zi(s)?1:-1}return Ze(n.length,e.length)}const Jp=55296,Xp=57343;function Zi(n){const e=n.charCodeAt(0);return e>=Jp&&e<=Xp}/**
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
 */const Po="__name__";class we{constructor(e,t,r){t===void 0?t=0:t>e.length&&Xn(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&Xn(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return we.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof we?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const a=we.compareSegments(e.get(s),t.get(s));if(a!==0)return a}return Ze(e.length,t.length)}static compareSegments(e,t){const r=we.isNumericId(e),s=we.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?we.extractNumericId(e).compare(we.extractNumericId(t)):Yp(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Fr.fromString(e.substring(4,e.length-2))}}class fe extends we{construct(e,t,r){return new fe(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new O(N.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new fe(t)}static emptyPath(){return new fe([])}}const Qp=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class at extends we{construct(e,t,r){return new at(e,t,r)}static isValidIdentifier(e){return Qp.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),at.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Po}static keyField(){return new at([Po])}static fromServerFormat(e){const t=[];let r="",s=0;const a=()=>{if(r.length===0)throw new O(N.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let h=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new O(N.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[s+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new O(N.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=g,s+=2}else u==="`"?(h=!h,s++):u!=="."||h?(r+=u,s++):(a(),s++)}if(a(),h)throw new O(N.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new at(t)}static emptyPath(){return new at([])}}/**
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
 */class ht{constructor(e){this.path=e}static fromPath(e){return new ht(fe.fromString(e))}static fromName(e){return new ht(fe.fromString(e).popFirst(5))}static empty(){return new ht(fe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&fe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return fe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ht(new fe(e.slice()))}}function Zp(n,e,t,r){if(e===!0&&r===!0)throw new O(N.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function eg(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}/**
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
 */function z(n,e){const t={typeString:n};return e&&(t.value=e),t}function En(n,e){if(!eg(n))throw new O(N.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,a="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const h=n[r];if(s&&typeof h!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(a!==void 0&&h!==a.value){t=`Expected '${r}' field to equal '${a.value}'`;break}}if(t)throw new O(N.INVALID_ARGUMENT,t);return!0}/**
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
 */const Co=-62135596800,ko=1e6;class Ee{static now(){return Ee.fromMillis(Date.now())}static fromDate(e){return Ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*ko);return new Ee(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new O(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new O(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Co)throw new O(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ko}_compareTo(e){return this.seconds===e.seconds?Ze(this.nanoseconds,e.nanoseconds):Ze(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ee._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(En(e,Ee._jsonSchema))return new Ee(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Co;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ee._jsonSchemaVersion="firestore/timestamp/1.0",Ee._jsonSchema={type:z("string",Ee._jsonSchemaVersion),seconds:z("number"),nanoseconds:z("number")};function tg(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class ng extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class pt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(a){throw typeof DOMException<"u"&&a instanceof DOMException?new ng("Invalid base64 string: "+a):a}})(e);return new pt(t)}static fromUint8Array(e){const t=(function(s){let a="";for(let h=0;h<s.length;++h)a+=String.fromCharCode(s[h]);return a})(e);return new pt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ze(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}pt.EMPTY_BYTE_STRING=new pt("");const No="(default)";class Qn{constructor(e,t){this.projectId=e,this.database=t||No}static empty(){return new Qn("","")}get isDefaultDatabase(){return this.database===No}isEqual(e){return e instanceof Qn&&e.projectId===this.projectId&&e.database===this.database}}function ig(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new O(N.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Qn(n.options.projectId,e)}/**
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
 */class rg{constructor(e,t=null,r=[],s=[],a=null,h="F",u=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=a,this.limitType=h,this.startAt=u,this.endAt=g,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function sg(n){return new rg(n)}/**
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
 */var Oo,k;(k=Oo||(Oo={}))[k.OK=0]="OK",k[k.CANCELLED=1]="CANCELLED",k[k.UNKNOWN=2]="UNKNOWN",k[k.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",k[k.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",k[k.NOT_FOUND=5]="NOT_FOUND",k[k.ALREADY_EXISTS=6]="ALREADY_EXISTS",k[k.PERMISSION_DENIED=7]="PERMISSION_DENIED",k[k.UNAUTHENTICATED=16]="UNAUTHENTICATED",k[k.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",k[k.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",k[k.ABORTED=10]="ABORTED",k[k.OUT_OF_RANGE=11]="OUT_OF_RANGE",k[k.UNIMPLEMENTED=12]="UNIMPLEMENTED",k[k.INTERNAL=13]="INTERNAL",k[k.UNAVAILABLE=14]="UNAVAILABLE",k[k.DATA_LOSS=15]="DATA_LOSS";/**
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
 */new Fr([4294967295,4294967295],0);/**
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
 */const og=41943040;/**
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
 */const yc=1048576;function er(){return typeof document<"u"?document:null}class ag{constructor(e,t,r=1e3,s=1.5,a=6e4){this.Ci=e,this.timerId=t,this.R_=r,this.A_=s,this.V_=a,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-r);s>0&&ge("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
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
 */class Vr{constructor(e,t,r,s,a){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=a,this.deferred=new hn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,a){const h=Date.now()+r,u=new Vr(e,t,h,s,a);return u.start(r),u}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new O(N.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Do,Lo;(Lo=Do||(Do={})).Ma="default",Lo.Cache="cache";/**
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
 */function cg(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const hg="ComponentProvider",Mo=new Map;/**
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
 */const lg="firestore.googleapis.com",Uo=!0;class Fo{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new O(N.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=lg,this.ssl=Uo}else this.host=e.host,this.ssl=e.ssl??Uo;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=og;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<yc)throw new O(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Zp("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=cg(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new O(N.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new O(N.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new O(N.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ug{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Fo({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new O(N.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new O(N.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Fo(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Bp;switch(r.type){case"firstParty":return new qp(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new O(N.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Mo.get(t);r&&(ge(hg,"Removing Datastore"),Mo.delete(t),r.terminate())})(this),Promise.resolve()}}/**
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
 */class xr{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new xr(this.firestore,e,this._query)}}class ve{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new jr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ve(this.firestore,e,this._key)}toJSON(){return{type:ve._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(En(t,ve._jsonSchema))return new ve(e,r||null,new ht(fe.fromString(t.referencePath)))}}ve._jsonSchemaVersion="firestore/documentReference/1.0",ve._jsonSchema={type:z("string",ve._jsonSchemaVersion),referencePath:z("string")};class jr extends xr{constructor(e,t,r){super(e,t,sg(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ve(this.firestore,null,new ht(e))}withConverter(e){return new jr(this.firestore,e,this._path)}}/**
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
 */const Vo="AsyncQueue";class xo{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new ag(this,"async_queue_retry"),this._c=()=>{const r=er();r&&ge(Vo,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const t=er();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=er();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new hn;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!tg(e))throw e;ge(Vo,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((r=>{throw this.nc=r,this.rc=!1,mc("INTERNAL UNHANDLED ERROR: ",jo(r)),r})).then((r=>(this.rc=!1,r))))));return this.ac=t,t}enqueueAfterDelay(e,t,r){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=Vr.createAndSchedule(this,e,t,r,(a=>this.hc(a)));return this.tc.push(s),s}uc(){this.nc&&Xn(47125,{Pc:jo(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function jo(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class dg extends ug{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new xo,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new xo(e),this._firestoreClient=void 0,await e}}}function Vm(n,e,t){const r=It(n,"firestore");if(r.isInitialized(t)){const s=r.getImmediate({identifier:t}),a=r.getOptions(t);if(Qe(a,e))return s;throw new O(N.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new O(N.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<yc)throw new O(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&mn(e.host)&&ia(e.host),r.initialize({options:e,instanceIdentifier:t})}/**
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
 */class ke{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ke(pt.fromBase64String(e))}catch(t){throw new O(N.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ke(pt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:ke._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(En(e,ke._jsonSchema))return ke.fromBase64String(e.bytes)}}ke._jsonSchemaVersion="firestore/bytes/1.0",ke._jsonSchema={type:z("string",ke._jsonSchemaVersion),bytes:z("string")};/**
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
 */class wc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new O(N.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new at(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class dt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new O(N.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new O(N.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Ze(this._lat,e._lat)||Ze(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:dt._jsonSchemaVersion}}static fromJSON(e){if(En(e,dt._jsonSchema))return new dt(e.latitude,e.longitude)}}dt._jsonSchemaVersion="firestore/geoPoint/1.0",dt._jsonSchema={type:z("string",dt._jsonSchemaVersion),latitude:z("number"),longitude:z("number")};/**
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
 */class ft{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let a=0;a<r.length;++a)if(r[a]!==s[a])return!1;return!0})(this._values,e._values)}toJSON(){return{type:ft._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(En(e,ft._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new ft(e.vectorValues);throw new O(N.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ft._jsonSchemaVersion="firestore/vectorValue/1.0",ft._jsonSchema={type:z("string",ft._jsonSchemaVersion),vectorValues:z("object")};function Ec(n,e,t){if((e=P(e))instanceof wc)return e._internalPath;if(typeof e=="string")return pg(n,e);throw dr("Field path arguments must be of type string or ",n)}const fg=new RegExp("[~\\*/\\[\\]]");function pg(n,e,t){if(e.search(fg)>=0)throw dr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n);try{return new wc(...e.split("."))._internalPath}catch{throw dr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n)}}function dr(n,e,t,r,s){let a=`Function ${e}() called with invalid data`;a+=". ";let h="";return new O(N.INVALID_ARGUMENT,a+n+h)}const Ho="@firebase/firestore",Bo="4.11.0";/**
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
 */class Tc{constructor(e,t,r,s,a){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=a}get id(){return this._key.path.lastSegment()}get ref(){return new ve(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new gg(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Ec("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class gg extends Tc{data(){return super.data()}}class Fn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Rt extends Tc{constructor(e,t,r,s,a,h){super(e,t,r,s,h),this._firestore=e,this._firestoreImpl=e,this.metadata=a}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Bn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Ec("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new O(N.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Rt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Rt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Rt._jsonSchema={type:z("string",Rt._jsonSchemaVersion),bundleSource:z("string","DocumentSnapshot"),bundleName:z("string"),bundle:z("string")};class Bn extends Rt{data(e={}){return super.data(e)}}class ln{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Fn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Bn(this._firestore,this._userDataWriter,r.key,r,new Fn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new O(N.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,a){if(s._snapshot.oldDocs.isEmpty()){let h=0;return s._snapshot.docChanges.map((u=>{const g=new Bn(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Fn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((u=>a||u.type!==3)).map((u=>{const g=new Bn(s._firestore,s._userDataWriter,u.doc.key,u.doc,new Fn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let E=-1,R=-1;return u.type!==0&&(E=h.indexOf(u.doc.key),h=h.delete(u.doc.key)),u.type!==1&&(h=h.add(u.doc),R=h.indexOf(u.doc.key)),{type:mg(u.type),doc:g,oldIndex:E,newIndex:R}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new O(N.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ln._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Kp.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((a=>{a._document!==null&&(t.push(a._document),r.push(this._userDataWriter.convertObjectMap(a._document.data.value.mapValue.fields,"previous")),s.push(a.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function mg(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Xn(61501,{type:n})}}/**
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
 */ln._jsonSchemaVersion="firestore/querySnapshot/1.0",ln._jsonSchema={type:z("string",ln._jsonSchemaVersion),bundleSource:z("string","QuerySnapshot"),bundleName:z("string"),bundle:z("string")};(function(e,t=!0){jp(Nt),Ae(new me("firestore",((r,{instanceIdentifier:s,options:a})=>{const h=r.getProvider("app").getImmediate(),u=new dg(new $p(r.getProvider("auth-internal")),new zp(h,r.getProvider("app-check-internal")),ig(h,s),h);return a={useFetchStreams:t,...a},u._setSettings(a),u}),"PUBLIC").setMultipleInstances(!0)),ue(Ho,Bo,e),ue(Ho,Bo,"esm2020")})();const vc="@firebase/installations",Hr="0.6.19";/**
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
 */const Ac=1e4,Sc=`w:${Hr}`,bc="FIS_v2",_g="https://firebaseinstallations.googleapis.com/v1",Ig=3600*1e3,yg="installations",wg="Installations";/**
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
 */const Eg={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},gt=new _t(yg,wg,Eg);function Rc(n){return n instanceof _e&&n.code.includes("request-failed")}/**
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
 */function Pc({projectId:n}){return`${_g}/projects/${n}/installations`}function Cc(n){return{token:n.token,requestStatus:2,expiresIn:vg(n.expiresIn),creationTime:Date.now()}}async function kc(n,e){const r=(await e.json()).error;return gt.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function Nc({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function Tg(n,{refreshToken:e}){const t=Nc(n);return t.append("Authorization",Ag(e)),t}async function Oc(n){const e=await n();return e.status>=500&&e.status<600?n():e}function vg(n){return Number(n.replace("s","000"))}function Ag(n){return`${bc} ${n}`}/**
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
 */async function Sg({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=Pc(n),s=Nc(n),a=e.getImmediate({optional:!0});if(a){const E=await a.getHeartbeatsHeader();E&&s.append("x-firebase-client",E)}const h={fid:t,authVersion:bc,appId:n.appId,sdkVersion:Sc},u={method:"POST",headers:s,body:JSON.stringify(h)},g=await Oc(()=>fetch(r,u));if(g.ok){const E=await g.json();return{fid:E.fid||t,registrationStatus:2,refreshToken:E.refreshToken,authToken:Cc(E.authToken)}}else throw await kc("Create Installation",g)}/**
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
 */function Dc(n){return new Promise(e=>{setTimeout(e,n)})}/**
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
 */function bg(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const Rg=/^[cdef][\w-]{21}$/,fr="";function Pg(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=Cg(n);return Rg.test(t)?t:fr}catch{return fr}}function Cg(n){return bg(n).substr(0,22)}/**
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
 */function fi(n){return`${n.appName}!${n.appId}`}/**
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
 */const Lc=new Map;function Mc(n,e){const t=fi(n);Uc(t,e),kg(t,e)}function Uc(n,e){const t=Lc.get(n);if(t)for(const r of t)r(e)}function kg(n,e){const t=Ng();t&&t.postMessage({key:n,fid:e}),Og()}let lt=null;function Ng(){return!lt&&"BroadcastChannel"in self&&(lt=new BroadcastChannel("[Firebase] FID Change"),lt.onmessage=n=>{Uc(n.data.key,n.data.fid)}),lt}function Og(){Lc.size===0&&lt&&(lt.close(),lt=null)}/**
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
 */const Dg="firebase-installations-database",Lg=1,mt="firebase-installations-store";let tr=null;function Br(){return tr||(tr=aa(Dg,Lg,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(mt)}}})),tr}async function Zn(n,e){const t=fi(n),s=(await Br()).transaction(mt,"readwrite"),a=s.objectStore(mt),h=await a.get(t);return await a.put(e,t),await s.done,(!h||h.fid!==e.fid)&&Mc(n,e.fid),e}async function Fc(n){const e=fi(n),r=(await Br()).transaction(mt,"readwrite");await r.objectStore(mt).delete(e),await r.done}async function pi(n,e){const t=fi(n),s=(await Br()).transaction(mt,"readwrite"),a=s.objectStore(mt),h=await a.get(t),u=e(h);return u===void 0?await a.delete(t):await a.put(u,t),await s.done,u&&(!h||h.fid!==u.fid)&&Mc(n,u.fid),u}/**
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
 */async function $r(n){let e;const t=await pi(n.appConfig,r=>{const s=Mg(r),a=Ug(n,s);return e=a.registrationPromise,a.installationEntry});return t.fid===fr?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function Mg(n){const e=n||{fid:Pg(),registrationStatus:0};return Vc(e)}function Ug(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(gt.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=Fg(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Vg(n)}:{installationEntry:e}}async function Fg(n,e){try{const t=await Sg(n,e);return Zn(n.appConfig,t)}catch(t){throw Rc(t)&&t.customData.serverCode===409?await Fc(n.appConfig):await Zn(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function Vg(n){let e=await $o(n.appConfig);for(;e.registrationStatus===1;)await Dc(100),e=await $o(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await $r(n);return r||t}return e}function $o(n){return pi(n,e=>{if(!e)throw gt.create("installation-not-found");return Vc(e)})}function Vc(n){return xg(n)?{fid:n.fid,registrationStatus:0}:n}function xg(n){return n.registrationStatus===1&&n.registrationTime+Ac<Date.now()}/**
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
 */async function jg({appConfig:n,heartbeatServiceProvider:e},t){const r=Hg(n,t),s=Tg(n,t),a=e.getImmediate({optional:!0});if(a){const E=await a.getHeartbeatsHeader();E&&s.append("x-firebase-client",E)}const h={installation:{sdkVersion:Sc,appId:n.appId}},u={method:"POST",headers:s,body:JSON.stringify(h)},g=await Oc(()=>fetch(r,u));if(g.ok){const E=await g.json();return Cc(E)}else throw await kc("Generate Auth Token",g)}function Hg(n,{fid:e}){return`${Pc(n)}/${e}/authTokens:generate`}/**
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
 */async function Wr(n,e=!1){let t;const r=await pi(n.appConfig,a=>{if(!xc(a))throw gt.create("not-registered");const h=a.authToken;if(!e&&Wg(h))return a;if(h.requestStatus===1)return t=Bg(n,e),a;{if(!navigator.onLine)throw gt.create("app-offline");const u=zg(a);return t=$g(n,u),u}});return t?await t:r.authToken}async function Bg(n,e){let t=await Wo(n.appConfig);for(;t.authToken.requestStatus===1;)await Dc(100),t=await Wo(n.appConfig);const r=t.authToken;return r.requestStatus===0?Wr(n,e):r}function Wo(n){return pi(n,e=>{if(!xc(e))throw gt.create("not-registered");const t=e.authToken;return Gg(t)?{...e,authToken:{requestStatus:0}}:e})}async function $g(n,e){try{const t=await jg(n,e),r={...e,authToken:t};return await Zn(n.appConfig,r),t}catch(t){if(Rc(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await Fc(n.appConfig);else{const r={...e,authToken:{requestStatus:0}};await Zn(n.appConfig,r)}throw t}}function xc(n){return n!==void 0&&n.registrationStatus===2}function Wg(n){return n.requestStatus===2&&!qg(n)}function qg(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Ig}function zg(n){const e={requestStatus:1,requestTime:Date.now()};return{...n,authToken:e}}function Gg(n){return n.requestStatus===1&&n.requestTime+Ac<Date.now()}/**
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
 */async function Kg(n){const e=n,{installationEntry:t,registrationPromise:r}=await $r(e);return r?r.catch(console.error):Wr(e).catch(console.error),t.fid}/**
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
 */async function Yg(n,e=!1){const t=n;return await Jg(t),(await Wr(t,e)).token}async function Jg(n){const{registrationPromise:e}=await $r(n);e&&await e}/**
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
 */function Xg(n){if(!n||!n.options)throw nr("App Configuration");if(!n.name)throw nr("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw nr(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function nr(n){return gt.create("missing-app-config-values",{valueName:n})}/**
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
 */const jc="installations",Qg="installations-internal",Zg=n=>{const e=n.getProvider("app").getImmediate(),t=Xg(e),r=It(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},em=n=>{const e=n.getProvider("app").getImmediate(),t=It(e,jc).getImmediate();return{getId:()=>Kg(t),getToken:s=>Yg(t,s)}};function tm(){Ae(new me(jc,Zg,"PUBLIC")),Ae(new me(Qg,em,"PRIVATE"))}tm();ue(vc,Hr);ue(vc,Hr,"esm2020");/**
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
 */const ei="analytics",nm="firebase_id",im="origin",rm=60*1e3,sm="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",qr="https://www.googletagmanager.com/gtag/js";/**
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
 */const ee=new ti("@firebase/analytics");/**
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
 */const om={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},ae=new _t("analytics","Analytics",om);/**
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
 */function am(n){if(!n.startsWith(qr)){const e=ae.create("invalid-gtag-resource",{gtagURL:n});return ee.warn(e.message),""}return n}function Hc(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function cm(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function hm(n,e){const t=cm("firebase-js-sdk-policy",{createScriptURL:am}),r=document.createElement("script"),s=`${qr}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function lm(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function um(n,e,t,r,s,a){const h=r[s];try{if(h)await e[h];else{const g=(await Hc(t)).find(E=>E.measurementId===s);g&&await e[g.appId]}}catch(u){ee.error(u)}n("config",s,a)}async function dm(n,e,t,r,s){try{let a=[];if(s&&s.send_to){let h=s.send_to;Array.isArray(h)||(h=[h]);const u=await Hc(t);for(const g of h){const E=u.find(b=>b.measurementId===g),R=E&&e[E.appId];if(R)a.push(R);else{a=[];break}}}a.length===0&&(a=Object.values(e)),await Promise.all(a),n("event",r,s||{})}catch(a){ee.error(a)}}function fm(n,e,t,r){async function s(a,...h){try{if(a==="event"){const[u,g]=h;await dm(n,e,t,u,g)}else if(a==="config"){const[u,g]=h;await um(n,e,t,r,u,g)}else if(a==="consent"){const[u,g]=h;n("consent",u,g)}else if(a==="get"){const[u,g,E]=h;n("get",u,g,E)}else if(a==="set"){const[u]=h;n("set",u)}else n(a,...h)}catch(u){ee.error(u)}}return s}function pm(n,e,t,r,s){let a=function(...h){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(a=window[s]),window[s]=fm(a,n,e,t),{gtagCore:a,wrappedGtag:window[s]}}function gm(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(qr)&&t.src.includes(n))return t;return null}/**
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
 */const mm=30,_m=1e3;class Im{constructor(e={},t=_m){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Bc=new Im;function ym(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function wm(n){var h;const{appId:e,apiKey:t}=n,r={method:"GET",headers:ym(t)},s=sm.replace("{app-id}",e),a=await fetch(s,r);if(a.status!==200&&a.status!==304){let u="";try{const g=await a.json();(h=g.error)!=null&&h.message&&(u=g.error.message)}catch{}throw ae.create("config-fetch-failed",{httpStatus:a.status,responseMessage:u})}return a.json()}async function Em(n,e=Bc,t){const{appId:r,apiKey:s,measurementId:a}=n.options;if(!r)throw ae.create("no-app-id");if(!s){if(a)return{measurementId:a,appId:r};throw ae.create("no-api-key")}const h=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new Am;return setTimeout(async()=>{u.abort()},rm),$c({appId:r,apiKey:s,measurementId:a},h,u,e)}async function $c(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=Bc){var u;const{appId:a,measurementId:h}=n;try{await Tm(r,e)}catch(g){if(h)return ee.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${h} provided in the "measurementId" field in the local Firebase config. [${g==null?void 0:g.message}]`),{appId:a,measurementId:h};throw g}try{const g=await wm(n);return s.deleteThrottleMetadata(a),g}catch(g){const E=g;if(!vm(E)){if(s.deleteThrottleMetadata(a),h)return ee.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${h} provided in the "measurementId" field in the local Firebase config. [${E==null?void 0:E.message}]`),{appId:a,measurementId:h};throw g}const R=Number((u=E==null?void 0:E.customData)==null?void 0:u.httpStatus)===503?Ys(t,s.intervalMillis,mm):Ys(t,s.intervalMillis),b={throttleEndTimeMillis:Date.now()+R,backoffCount:t+1};return s.setThrottleMetadata(a,b),ee.debug(`Calling attemptFetch again in ${R} millis`),$c(n,b,r,s)}}function Tm(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),a=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(a),r(ae.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function vm(n){if(!(n instanceof _e)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class Am{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function Sm(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const a=await e,h={...r,send_to:a};n("event",t,h)}}async function bm(n,e,t,r){if(r&&r.global){const s={};for(const a of Object.keys(t))s[`user_properties.${a}`]=t[a];return n("set",s),Promise.resolve()}else{const s=await e;n("config",s,{update:!0,user_properties:t})}}/**
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
 */async function Rm(){if(mr())try{await _r()}catch(n){return ee.warn(ae.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return ee.warn(ae.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Pm(n,e,t,r,s,a,h){const u=Em(n);u.then(S=>{t[S.measurementId]=S.appId,n.options.measurementId&&S.measurementId!==n.options.measurementId&&ee.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${S.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(S=>ee.error(S)),e.push(u);const g=Rm().then(S=>{if(S)return r.getId()}),[E,R]=await Promise.all([u,g]);gm(a)||hm(a,E.measurementId),s("js",new Date);const b=(h==null?void 0:h.config)??{};return b[im]="firebase",b.update=!0,R!=null&&(b[nm]=R),s("config",E.measurementId,b),E.measurementId}/**
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
 */class Cm{constructor(e){this.app=e}_delete(){return delete Pt[this.app.options.appId],Promise.resolve()}}let Pt={},qo=[];const zo={};let ir="dataLayer",km="gtag",Go,zr,Ko=!1;function Nm(){const n=[];if(gr()&&n.push("This is a browser extension environment."),ra()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=ae.create("invalid-analytics-context",{errorInfo:e});ee.warn(t.message)}}function Om(n,e,t){Nm();const r=n.options.appId;if(!r)throw ae.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)ee.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw ae.create("no-api-key");if(Pt[r]!=null)throw ae.create("already-exists",{id:r});if(!Ko){lm(ir);const{wrappedGtag:a,gtagCore:h}=pm(Pt,qo,zo,ir,km);zr=a,Go=h,Ko=!0}return Pt[r]=Pm(n,qo,zo,e,Go,ir,t),new Cm(n)}function xm(n=ca()){n=P(n);const e=It(n,ei);return e.isInitialized()?e.getImmediate():Dm(n)}function Dm(n,e={}){const t=It(n,ei);if(t.isInitialized()){const s=t.getImmediate();if(Qe(e,t.getOptions()))return s;throw ae.create("already-initialized")}return t.initialize({options:e})}async function jm(){if(gr()||!ra()||!mr())return!1;try{return await _r()}catch{return!1}}function Lm(n,e,t){n=P(n),bm(zr,Pt[n.app.options.appId],e,t).catch(r=>ee.error(r))}function Mm(n,e,t,r){n=P(n),Sm(zr,Pt[n.app.options.appId],e,t,r).catch(s=>ee.error(s))}const Yo="@firebase/analytics",Jo="0.10.19";function Um(){Ae(new me(ei,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return Om(r,s,t)},"PUBLIC")),Ae(new me("analytics-internal",n,"PRIVATE")),ue(Yo,Jo),ue(Yo,Jo,"esm2020");function n(e){try{const t=e.getProvider(ei).getImmediate();return{logEvent:(r,s,a)=>Mm(t,r,s,a),setUserProperties:(r,s)=>Lm(t,r,s)}}catch(t){throw ae.create("interop-component-reg-failed",{reason:t})}}}Um();export{et as E,Vm as a,jm as b,xm as c,Cd as d,kd as e,Sd as f,Vp as g,Fm as h,Yl as i,qa as r,ef as s,Hd as u};
