var b;(function(e){e.STRING="string",e.NUMBER="number",e.INTEGER="integer",e.BOOLEAN="boolean",e.ARRAY="array",e.OBJECT="object"})(b||(b={}));/**
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
 */var N;(function(e){e.LANGUAGE_UNSPECIFIED="language_unspecified",e.PYTHON="python"})(N||(N={}));var M;(function(e){e.OUTCOME_UNSPECIFIED="outcome_unspecified",e.OUTCOME_OK="outcome_ok",e.OUTCOME_FAILED="outcome_failed",e.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(M||(M={}));/**
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
 */const D=["user","model","function","system"];var L;(function(e){e.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",e.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(L||(L={}));var G;(function(e){e.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",e.BLOCK_NONE="BLOCK_NONE"})(G||(G={}));var k;(function(e){e.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",e.NEGLIGIBLE="NEGLIGIBLE",e.LOW="LOW",e.MEDIUM="MEDIUM",e.HIGH="HIGH"})(k||(k={}));var $;(function(e){e.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",e.SAFETY="SAFETY",e.OTHER="OTHER"})($||($={}));var v;(function(e){e.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",e.STOP="STOP",e.MAX_TOKENS="MAX_TOKENS",e.SAFETY="SAFETY",e.RECITATION="RECITATION",e.LANGUAGE="LANGUAGE",e.BLOCKLIST="BLOCKLIST",e.PROHIBITED_CONTENT="PROHIBITED_CONTENT",e.SPII="SPII",e.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",e.OTHER="OTHER"})(v||(v={}));var x;(function(e){e.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",e.RETRIEVAL_QUERY="RETRIEVAL_QUERY",e.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",e.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",e.CLASSIFICATION="CLASSIFICATION",e.CLUSTERING="CLUSTERING"})(x||(x={}));var j;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.AUTO="AUTO",e.ANY="ANY",e.NONE="NONE"})(j||(j={}));var U;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.MODE_DYNAMIC="MODE_DYNAMIC"})(U||(U={}));/**
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
 */class f extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class _ extends f{constructor(t,n){super(t),this.response=n}}class V extends f{constructor(t,n,s,o){super(t),this.status=n,this.statusText=s,this.errorDetails=o}}class m extends f{}class J extends f{}/**
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
 */const Q="https://generativelanguage.googleapis.com",Z="v1beta",ee="0.24.1",te="genai-js";var C;(function(e){e.GENERATE_CONTENT="generateContent",e.STREAM_GENERATE_CONTENT="streamGenerateContent",e.COUNT_TOKENS="countTokens",e.EMBED_CONTENT="embedContent",e.BATCH_EMBED_CONTENTS="batchEmbedContents"})(C||(C={}));class ne{constructor(t,n,s,o,i){this.model=t,this.task=n,this.apiKey=s,this.stream=o,this.requestOptions=i}toString(){var t,n;const s=((t=this.requestOptions)===null||t===void 0?void 0:t.apiVersion)||Z;let i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||Q}/${s}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}function se(e){const t=[];return e!=null&&e.apiClient&&t.push(e.apiClient),t.push(`${te}/${ee}`),t.join(" ")}async function oe(e){var t;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",se(e.requestOptions)),n.append("x-goog-api-key",e.apiKey);let s=(t=e.requestOptions)===null||t===void 0?void 0:t.customHeaders;if(s){if(!(s instanceof Headers))try{s=new Headers(s)}catch(o){throw new m(`unable to convert customHeaders value ${JSON.stringify(s)} to Headers: ${o.message}`)}for(const[o,i]of s.entries()){if(o==="x-goog-api-key")throw new m(`Cannot set reserved header name ${o}`);if(o==="x-goog-api-client")throw new m(`Header name ${o} can only be set using the apiClient field`);n.append(o,i)}}return n}async function ie(e,t,n,s,o,i){const r=new ne(e,t,n,s,i);return{url:r.toString(),fetchOptions:Object.assign(Object.assign({},de(i)),{method:"POST",headers:await oe(r),body:o})}}async function R(e,t,n,s,o,i={},r=fetch){const{url:a,fetchOptions:c}=await ie(e,t,n,s,o,i);return re(a,c,r)}async function re(e,t,n=fetch){let s;try{s=await n(e,t)}catch(o){ae(o,e)}return s.ok||await ce(s,e),s}function ae(e,t){let n=e;throw n.name==="AbortError"?(n=new J(`Request aborted when fetching ${t.toString()}: ${e.message}`),n.stack=e.stack):e instanceof V||e instanceof m||(n=new f(`Error fetching from ${t.toString()}: ${e.message}`),n.stack=e.stack),n}async function ce(e,t){let n="",s;try{const o=await e.json();n=o.error.message,o.error.details&&(n+=` ${JSON.stringify(o.error.details)}`,s=o.error.details)}catch{}throw new V(`Error fetching from ${t.toString()}: [${e.status} ${e.statusText}] ${n}`,e.status,e.statusText,s)}function de(e){const t={};if((e==null?void 0:e.signal)!==void 0||(e==null?void 0:e.timeout)>=0){const n=new AbortController;(e==null?void 0:e.timeout)>=0&&setTimeout(()=>n.abort(),e.timeout),e!=null&&e.signal&&e.signal.addEventListener("abort",()=>{n.abort()}),t.signal=n.signal}return t}/**
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
 */function w(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),S(e.candidates[0]))throw new _(`${E(e)}`,e);return le(e)}else if(e.promptFeedback)throw new _(`Text not available. ${E(e)}`,e);return""},e.functionCall=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),S(e.candidates[0]))throw new _(`${E(e)}`,e);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),P(e)[0]}else if(e.promptFeedback)throw new _(`Function call not available. ${E(e)}`,e)},e.functionCalls=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),S(e.candidates[0]))throw new _(`${E(e)}`,e);return P(e)}else if(e.promptFeedback)throw new _(`Function call not available. ${E(e)}`,e)},e}function le(e){var t,n,s,o;const i=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const r of(o=(s=e.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)r.text&&i.push(r.text),r.executableCode&&i.push("\n```"+r.executableCode.language+`
`+r.executableCode.code+"\n```\n"),r.codeExecutionResult&&i.push("\n```\n"+r.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function P(e){var t,n,s,o;const i=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const r of(o=(s=e.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)r.functionCall&&i.push(r.functionCall);if(i.length>0)return i}const ue=[v.RECITATION,v.SAFETY,v.LANGUAGE];function S(e){return!!e.finishReason&&ue.includes(e.finishReason)}function E(e){var t,n,s;let o="";if((!e.candidates||e.candidates.length===0)&&e.promptFeedback)o+="Response was blocked",!((t=e.promptFeedback)===null||t===void 0)&&t.blockReason&&(o+=` due to ${e.promptFeedback.blockReason}`),!((n=e.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(o+=`: ${e.promptFeedback.blockReasonMessage}`);else if(!((s=e.candidates)===null||s===void 0)&&s[0]){const i=e.candidates[0];S(i)&&(o+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(o+=`: ${i.finishMessage}`))}return o}function I(e){return this instanceof I?(this.v=e,this):new I(e)}function fe(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s=n.apply(e,t||[]),o,i=[];return o={},r("next"),r("throw"),r("return"),o[Symbol.asyncIterator]=function(){return this},o;function r(l){s[l]&&(o[l]=function(d){return new Promise(function(p,y){i.push([l,d,p,y])>1||a(l,d)})})}function a(l,d){try{c(s[l](d))}catch(p){g(i[0][3],p)}}function c(l){l.value instanceof I?Promise.resolve(l.value.v).then(h,u):g(i[0][2],l)}function h(l){a("next",l)}function u(l){a("throw",l)}function g(l,d){l(d),i.shift(),i.length&&a(i[0][0],i[0][1])}}/**
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
 */const F=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function he(e){const t=e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=Ee(t),[s,o]=n.tee();return{stream:ge(s),response:pe(o)}}async function pe(e){const t=[],n=e.getReader();for(;;){const{done:s,value:o}=await n.read();if(s)return w(me(t));t.push(o)}}function ge(e){return fe(this,arguments,function*(){const n=e.getReader();for(;;){const{value:s,done:o}=yield I(n.read());if(o)break;yield yield I(w(s))}})}function Ee(e){const t=e.getReader();return new ReadableStream({start(s){let o="";return i();function i(){return t.read().then(({value:r,done:a})=>{if(a){if(o.trim()){s.error(new f("Failed to parse stream"));return}s.close();return}o+=r;let c=o.match(F),h;for(;c;){try{h=JSON.parse(c[1])}catch{s.error(new f(`Error parsing JSON response: "${c[1]}"`));return}s.enqueue(h),o=o.substring(c[0].length),c=o.match(F)}return i()}).catch(r=>{let a=r;throw a.stack=r.stack,a.name==="AbortError"?a=new J("Request aborted when reading from the stream"):a=new f("Error reading from the stream"),a})}}})}function me(e){const t=e[e.length-1],n={promptFeedback:t==null?void 0:t.promptFeedback};for(const s of e){if(s.candidates){let o=0;for(const i of s.candidates)if(n.candidates||(n.candidates=[]),n.candidates[o]||(n.candidates[o]={index:o}),n.candidates[o].citationMetadata=i.citationMetadata,n.candidates[o].groundingMetadata=i.groundingMetadata,n.candidates[o].finishReason=i.finishReason,n.candidates[o].finishMessage=i.finishMessage,n.candidates[o].safetyRatings=i.safetyRatings,i.content&&i.content.parts){n.candidates[o].content||(n.candidates[o].content={role:i.content.role||"user",parts:[]});const r={};for(const a of i.content.parts)a.text&&(r.text=a.text),a.functionCall&&(r.functionCall=a.functionCall),a.executableCode&&(r.executableCode=a.executableCode),a.codeExecutionResult&&(r.codeExecutionResult=a.codeExecutionResult),Object.keys(r).length===0&&(r.text=""),n.candidates[o].content.parts.push(r)}o++}s.usageMetadata&&(n.usageMetadata=s.usageMetadata)}return n}/**
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
 */async function W(e,t,n,s){const o=await R(t,C.STREAM_GENERATE_CONTENT,e,!0,JSON.stringify(n),s);return he(o)}async function z(e,t,n,s){const i=await(await R(t,C.GENERATE_CONTENT,e,!1,JSON.stringify(n),s)).json();return{response:w(i)}}/**
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
 */function X(e){if(e!=null){if(typeof e=="string")return{role:"system",parts:[{text:e}]};if(e.text)return{role:"system",parts:[e]};if(e.parts)return e.role?e:{role:"system",parts:e.parts}}}function A(e){let t=[];if(typeof e=="string")t=[{text:e}];else for(const n of e)typeof n=="string"?t.push({text:n}):t.push(n);return Ce(t)}function Ce(e){const t={role:"user",parts:[]},n={role:"function",parts:[]};let s=!1,o=!1;for(const i of e)"functionResponse"in i?(n.parts.push(i),o=!0):(t.parts.push(i),s=!0);if(s&&o)throw new f("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!o)throw new f("No content is provided for sending chat message.");return s?t:n}function ye(e,t){var n;let s={model:t==null?void 0:t.model,generationConfig:t==null?void 0:t.generationConfig,safetySettings:t==null?void 0:t.safetySettings,tools:t==null?void 0:t.tools,toolConfig:t==null?void 0:t.toolConfig,systemInstruction:t==null?void 0:t.systemInstruction,cachedContent:(n=t==null?void 0:t.cachedContent)===null||n===void 0?void 0:n.name,contents:[]};const o=e.generateContentRequest!=null;if(e.contents){if(o)throw new m("CountTokensRequest must have one of contents or generateContentRequest, not both.");s.contents=e.contents}else if(o)s=Object.assign(Object.assign({},s),e.generateContentRequest);else{const i=A(e);s.contents=[i]}return{generateContentRequest:s}}function H(e){let t;return e.contents?t=e:t={contents:[A(e)]},e.systemInstruction&&(t.systemInstruction=X(e.systemInstruction)),t}function _e(e){return typeof e=="string"||Array.isArray(e)?{content:A(e)}:e}/**
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
 */const B=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],ve={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function Ie(e){let t=!1;for(const n of e){const{role:s,parts:o}=n;if(!t&&s!=="user")throw new f(`First content should be with role 'user', got ${s}`);if(!D.includes(s))throw new f(`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(D)}`);if(!Array.isArray(o))throw new f("Content should have 'parts' property with an array of Parts");if(o.length===0)throw new f("Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const a of o)for(const c of B)c in a&&(i[c]+=1);const r=ve[s];for(const a of B)if(!r.includes(a)&&i[a]>0)throw new f(`Content with role '${s}' can't contain '${a}' part`);t=!0}}function Y(e){var t;if(e.candidates===void 0||e.candidates.length===0)return!1;const n=(t=e.candidates[0])===null||t===void 0?void 0:t.content;if(n===void 0||n.parts===void 0||n.parts.length===0)return!1;for(const s of n.parts)if(s===void 0||Object.keys(s).length===0||s.text!==void 0&&s.text==="")return!1;return!0}/**
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
 */const K="SILENT_ERROR";class Ae{constructor(t,n,s,o={}){this.model=n,this.params=s,this._requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,s!=null&&s.history&&(Ie(s.history),this._history=s.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t,n={}){var s,o,i,r,a,c;await this._sendPromise;const h=A(t),u={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(o=this.params)===null||o===void 0?void 0:o.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,contents:[...this._history,h]},g=Object.assign(Object.assign({},this._requestOptions),n);let l;return this._sendPromise=this._sendPromise.then(()=>z(this._apiKey,this.model,u,g)).then(d=>{var p;if(Y(d.response)){this._history.push(h);const y=Object.assign({parts:[],role:"model"},(p=d.response.candidates)===null||p===void 0?void 0:p[0].content);this._history.push(y)}else{const y=E(d.response);y&&console.warn(`sendMessage() was unsuccessful. ${y}. Inspect response object for details.`)}l=d}).catch(d=>{throw this._sendPromise=Promise.resolve(),d}),await this._sendPromise,l}async sendMessageStream(t,n={}){var s,o,i,r,a,c;await this._sendPromise;const h=A(t),u={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(o=this.params)===null||o===void 0?void 0:o.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,contents:[...this._history,h]},g=Object.assign(Object.assign({},this._requestOptions),n),l=W(this._apiKey,this.model,u,g);return this._sendPromise=this._sendPromise.then(()=>l).catch(d=>{throw new Error(K)}).then(d=>d.response).then(d=>{if(Y(d)){this._history.push(h);const p=Object.assign({},d.candidates[0].content);p.role||(p.role="model"),this._history.push(p)}else{const p=E(d);p&&console.warn(`sendMessageStream() was unsuccessful. ${p}. Inspect response object for details.`)}}).catch(d=>{d.message!==K&&console.error(d)}),l}}/**
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
 */async function Re(e,t,n,s){return(await R(t,C.COUNT_TOKENS,e,!1,JSON.stringify(n),s)).json()}/**
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
 */async function Se(e,t,n,s){return(await R(t,C.EMBED_CONTENT,e,!1,JSON.stringify(n),s)).json()}async function Oe(e,t,n,s){const o=n.requests.map(r=>Object.assign(Object.assign({},r),{model:t}));return(await R(t,C.BATCH_EMBED_CONTENTS,e,!1,JSON.stringify({requests:o}),s)).json()}/**
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
 */class q{constructor(t,n,s={}){this.apiKey=t,this._requestOptions=s,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=X(n.systemInstruction),this.cachedContent=n.cachedContent}async generateContent(t,n={}){var s;const o=H(t),i=Object.assign(Object.assign({},this._requestOptions),n);return z(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},o),i)}async generateContentStream(t,n={}){var s;const o=H(t),i=Object.assign(Object.assign({},this._requestOptions),n);return W(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},o),i)}startChat(t){var n;return new Ae(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},t),this._requestOptions)}async countTokens(t,n={}){const s=ye(t,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),o=Object.assign(Object.assign({},this._requestOptions),n);return Re(this.apiKey,this.model,s,o)}async embedContent(t,n={}){const s=_e(t),o=Object.assign(Object.assign({},this._requestOptions),n);return Se(this.apiKey,this.model,s,o)}async batchEmbedContents(t,n={}){const s=Object.assign(Object.assign({},this._requestOptions),n);return Oe(this.apiKey,this.model,t,s)}}/**
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
 */class Te{constructor(t){this.apiKey=t}getGenerativeModel(t,n){if(!t.model)throw new f("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new q(this.apiKey,t,n)}getGenerativeModelFromCachedContent(t,n,s){if(!t.name)throw new m("Cached content must contain a `name` field.");if(!t.model)throw new m("Cached content must contain a `model` field.");const o=["model","systemInstruction"];for(const r of o)if(n!=null&&n[r]&&t[r]&&(n==null?void 0:n[r])!==t[r]){if(r==="model"){const a=n.model.startsWith("models/")?n.model.replace("models/",""):n.model,c=t.model.startsWith("models/")?t.model.replace("models/",""):t.model;if(a===c)continue}throw new m(`Different value for "${r}" specified in modelParams (${n[r]}) and cachedContent (${t[r]})`)}const i=Object.assign(Object.assign({},n),{model:t.model,tools:t.tools,toolConfig:t.toolConfig,systemInstruction:t.systemInstruction,cachedContent:t});return new q(this.apiKey,i,s)}}const we=()=>{const e="AIzaSyDP8hCewNzH1nMSAJOARb4JY6G97A6sr90";return new Te(e)},O=we();async function be(e,t,n=[],s="Intermediate",o="3-4 weeks"){if(!O)return console.error("Gemini AI not initialized. Check your API key."),T();try{const i=O.getGenerativeModel({model:"gemini-1.5-pro"}),r=`You are a project planning expert. Create a detailed project roadmap for the following project.

Project Title: ${e}
Description: ${t}
Tech Stack: ${n.join(", ")}
Complexity Level: ${s}
Estimated Time: ${o}

Generate a comprehensive roadmap with EXACTLY 4 phases: Design, Development, Testing, and Deployment.

For each phase, provide:
1. Phase name (must be one of: Design, Development, Testing, Deployment)
2. Duration (e.g., "3 days", "2 weeks")
3. A list of 5-8 specific tasks

For each task, provide:
1. A unique id (format: phasename-number, e.g., "design-1", "dev-2")
2. Title (concise, action-oriented)
3. Description (detailed explanation of what to do)
4. Duration (e.g., "1 day", "2 days", "3-4 hours")

Return ONLY valid JSON in this exact format (no markdown, no code blocks, just pure JSON):
{
  "phases": [
    {
      "name": "Design",
      "duration": "3 days",
      "tasks": [
        {
          "id": "design-1",
          "title": "Task title",
          "description": "Detailed description",
          "duration": "1 day"
        }
      ]
    }
  ]
}

Important:
- Be specific and practical for the given tech stack
- Tasks should be actionable and measurable
- Durations should be realistic
- Return ONLY the JSON object, nothing else`,h=(await(await i.generateContent(r)).response).text(),u=Ne(h);return console.log("✅ Successfully generated roadmap for:",e),u}catch(i){return console.error("Error generating roadmap with Gemini AI:",i),T()}}function Ne(e){try{let t=e.trim();t=t.replace(/```json\s*/g,""),t=t.replace(/```\s*/g,"");const n=t.match(/\{[\s\S]*\}/);n&&(t=n[0]);const s=JSON.parse(t);if(!s.phases||!Array.isArray(s.phases))throw new Error("Invalid roadmap structure: missing phases array");return s.phases=s.phases.map(o=>({name:o.name||"Unnamed Phase",duration:o.duration||"1 week",tasks:Array.isArray(o.tasks)?o.tasks.map(i=>({id:i.id||`task-${Math.random().toString(36).substr(2,9)}`,title:i.title||"Untitled Task",description:i.description||"",duration:i.duration||"1 day"})):[]})),s}catch(t){return console.error("Error parsing roadmap response:",t),console.error("Response text:",e),T()}}function T(){return{phases:[{name:"Design",duration:"3-5 days",tasks:[{id:"design-1",title:"Create project wireframes and mockups",description:"Design the user interface and user experience",duration:"1-2 days"},{id:"design-2",title:"Plan system architecture",description:"Design the overall system architecture and data flow",duration:"1-2 days"},{id:"design-3",title:"Define API contracts",description:"Specify API endpoints and data structures",duration:"1 day"}]},{name:"Development",duration:"2-3 weeks",tasks:[{id:"dev-1",title:"Set up development environment",description:"Initialize project structure and install dependencies",duration:"1 day"},{id:"dev-2",title:"Implement core features",description:"Build the main functionality of the application",duration:"1-2 weeks"},{id:"dev-3",title:"Integrate third-party services",description:"Connect external APIs and services",duration:"2-3 days"},{id:"dev-4",title:"Build user interface",description:"Create responsive UI components",duration:"3-5 days"}]},{name:"Testing",duration:"3-5 days",tasks:[{id:"test-1",title:"Write unit tests",description:"Test individual components and functions",duration:"1-2 days"},{id:"test-2",title:"Perform integration testing",description:"Test the complete application flow",duration:"1-2 days"},{id:"test-3",title:"User acceptance testing",description:"Validate with end users and fix issues",duration:"1 day"}]},{name:"Deployment",duration:"2-3 days",tasks:[{id:"deploy-1",title:"Prepare production environment",description:"Set up hosting and configure servers",duration:"1 day"},{id:"deploy-2",title:"Deploy application",description:"Push code to production and verify deployment",duration:"1 day"},{id:"deploy-3",title:"Monitor and optimize",description:"Set up monitoring and optimize performance",duration:"1 day"}]}]}}function Me(e){return{"AI/ML":`- AI/ML: Gemini 2.0, GPT-4, PyTorch, TensorFlow, LangChain
- Backend: Python, FastAPI
- Frontend: React, Streamlit`,"Web Development":`- Frontend: React 19, Next.js 14+, shadcn/ui, TailwindCSS
- Backend: Node.js 20+, Bun, tRPC
- Database: Supabase, PostgreSQL, Prisma`,Blockchain:`- Platforms: Ethereum, Solana, Polygon
- Smart Contracts: Solidity, Hardhat
- Frontend: ethers.js, wagmi, Web3.js`,"Cloud Computing":`- Platforms: AWS, Google Cloud, Azure
- Infrastructure: Terraform, Kubernetes, Docker
- Serverless: Vercel, Cloudflare Workers`,"Mobile Development":`- Cross-platform: React Native, Flutter, Expo
- Native: Swift, Kotlin
- Backend: Firebase, Supabase`,IoT:`- Hardware: Arduino, Raspberry Pi, ESP32
- Protocols: MQTT, CoAP
- Cloud: AWS IoT, Azure IoT Hub`,Cybersecurity:`- Tools: Kali Linux, Metasploit, Burp Suite
- Languages: Python, Go
- Frameworks: OWASP, NIST`,"Data Science":`- Languages: Python, R
- Libraries: Pandas, NumPy, Scikit-learn
- Visualization: Plotly, Streamlit`,DevOps:`- CI/CD: GitHub Actions, GitLab CI
- Containers: Docker, Kubernetes
- IaC: Terraform, Pulumi`,"AR/VR":`- Engines: Unity, Unreal Engine
- Frameworks: Meta Quest SDK, ARKit
- Languages: C#, C++`}[e]||"- Use modern, relevant technologies for this domain"}async function Le({domain:e,complexity:t,targetRole:n,interests:s="",existingSkills:o=""}){if(!O)throw console.error("Gemini AI not initialized. Check your API key."),new Error("Gemini AI not configured. Please add VITE_GEMINI_API_KEY to your .env file");try{const i=O.getGenerativeModel({model:"gemini-1.5-pro"}),r=`You are a specialized project advisor. Generate a unique, innovative project idea that MUST be in the ${e} domain.

REQUIREMENTS:
- Domain: ${e} (STRICTLY ENFORCE - project MUST be in this domain)
- Experience Level: ${t}
- Target Job Role: ${n}
- Specific Interests: ${s||"General"}
- Existing Skills: ${o||"Basic programming"}

IMPORTANT - Domain Enforcement:
- The project MUST be clearly related to ${e}
- ALL technologies in the tech stack MUST be relevant to ${e}
- If domain is "AI/ML", include AI/ML frameworks and tools
- If domain is "Web Development", focus on web technologies
- If domain is "Blockchain", include blockchain platforms and smart contracts
- If domain is "Cloud Computing", include cloud services and infrastructure
- DO NOT mix unrelated domains

Use ONLY 2026 cutting-edge technologies relevant to ${e}:
${Me(e)}

Return ONLY valid JSON (no markdown, no code blocks, just pure JSON):

{
  "title": "Creative and specific project name relevant to ${e}",
  "description": "2-3 sentence compelling description that clearly explains what the project does and its value in ${e}",
  "domain": "${e}",
  "complexity": "${t}",
  "tech_stack": ["${e} tech 1", "${e} tech 2", "${e} tech 3", "${e} tech 4", "${e} tech 5"],
  "estimated_time": "X-Y weeks",
  "use_cases": ["practical ${e} use case 1", "use case 2", "use case 3"],
  "target_roles": ["${n}"],
  "is_trending": true,
  "resources": [
    {"title": "Official ${e} Documentation", "type": "Documentation", "level": "Beginner", "source": "Official Site", "url": "https://example.com", "description": "Getting started with ${e}"},
    {"title": "${e} Tutorial Series", "type": "Video", "level": "Beginner", "source": "YouTube", "url": "https://youtube.com", "description": "Step by step ${e} course"},
    {"title": "${e} GitHub Template", "type": "GitHub", "level": "Intermediate", "source": "GitHub", "url": "https://github.com", "description": "${e} starter code repository"},
    {"title": "${e} Best Practices", "type": "Article", "level": "Intermediate", "source": "Medium", "url": "https://medium.com", "description": "${e} industry best practices"},
    {"title": "Advanced ${e} Course", "type": "Course", "level": "Advanced", "source": "Udemy", "url": "https://udemy.com", "description": "Deep dive ${e} course"}
  ],
  "github_structure": "project-root/\\n├── src/\\n│   ├── components/\\n│   ├── pages/\\n│   ├── services/\\n│   └── utils/\\n├── tests/\\n├── docs/\\n├── README.md\\n└── package.json",
  "architecture": "Brief description of the ${e} system architecture, key components, and how they interact",
  "deployment_guide": "Step-by-step deployment instructions for ${e} project:\\n1. First step\\n2. Second step\\n3. Third step"
}

CRITICAL Requirements:
- Project MUST be 100% focused on ${e}
- Tech stack MUST use only ${e}-relevant technologies
- Make the project practical and achievable for ${t} level
- Project should be portfolio-worthy and demonstrate ${e} expertise
- Use cases must be real-world ${e} applications
- Make it innovative but not overly complex
- Return ONLY the JSON object, nothing else`,h=(await(await i.generateContent(r)).response).text(),u=De(h),g=await be(u.title,u.description,u.tech_stack,u.complexity,u.estimated_time);return u.roadmap=g,console.log("✅ Successfully generated full project:",u.title),u}catch(i){throw console.error("Error generating project with Gemini AI:",i),i}}function De(e){try{let t=e.trim();t=t.replace(/```json\s*/g,""),t=t.replace(/```\s*/g,"");const n=t.match(/\{[\s\S]*\}/);n&&(t=n[0]);const s=JSON.parse(t);return{title:s.title||"Untitled Project",description:s.description||"No description provided",domain:s.domain,complexity:s.complexity,tech_stack:Array.isArray(s.tech_stack)?s.tech_stack:[],estimated_time:s.estimated_time||"4 weeks",use_cases:Array.isArray(s.use_cases)?s.use_cases:[],target_roles:Array.isArray(s.target_roles)?s.target_roles:[],is_trending:s.is_trending!==!1,resources:Array.isArray(s.resources)?s.resources:[],github_structure:s.github_structure||"No structure defined",architecture:s.architecture||"No architecture defined",deployment_guide:s.deployment_guide||"No deployment guide available"}}catch(t){throw console.error("Error parsing project response:",t),console.error("Response text:",e),new Error("Failed to parse project response from AI")}}export{Le as generateFullProject,be as generateProjectRoadmap};
