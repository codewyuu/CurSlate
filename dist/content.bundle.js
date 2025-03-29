"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[854],{630:(e,t,n)=>{var o=n(467),a=n(756),r=n.n(a),i=!0,s=300,c="en",l=!0,u=["en","es","fr","de","zh","ru"],d="minimal",p="cursor",y="medium",g=!0,m=!0,h=!1,f="none",w=null,v=null,b=null;function x(){if(!v){(v=document.createElement("div")).className="curslate-popup",v.style.display="none",v.style.position="fixed",v.style.zIndex="2147483647",v.style.maxWidth="300px",v.style.padding="8px 12px",v.style.borderRadius="4px",v.style.boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",v.style.transition="opacity 0.2s ease-in-out, transform 0.2s ease-in-out",v.style.opacity="0",v.style.backgroundColor="#FFFFFF",v.style.border="1px solid #E5E7EB",S();var e=document.createElement("div");e.className="curslate-popup-header",e.style.fontSize="0.75rem",e.style.marginBottom="0.25rem",v.appendChild(e);var t=document.createElement("div");t.className="curslate-popup-content",v.appendChild(t),document.body?document.body.appendChild(v):document.addEventListener("DOMContentLoaded",(function(){document.body.appendChild(v)}))}}function S(){if(v){switch(y){case"small":v.style.fontSize="0.75rem";break;case"medium":v.style.fontSize="0.875rem";break;case"large":v.style.fontSize="1rem"}switch(d){case"minimal":v.style.backgroundColor="#FFFFFF",v.style.color="#1F2937",v.style.border="1px solid #E5E7EB",v.style.padding="0.5rem 0.75rem",v.querySelector(".curslate-popup-header").style.color="#6B7280";break;case"detailed":v.style.backgroundColor="#FFFFFF",v.style.color="#1F2937",v.style.border="1px solid #E5E7EB",v.style.padding="0.75rem 1rem",v.querySelector(".curslate-popup-header").style.color="#6B7280";break;case"dark":v.style.backgroundColor="#1F2937",v.style.color="#F9FAFB",v.style.border="1px solid #374151",v.style.padding="0.5rem 0.75rem",v.querySelector(".curslate-popup-header").style.color="#9CA3AF"}}}function k(e,t,n,o,a){v||x();var r=v.querySelector(".curslate-popup-header"),i=v.querySelector(".curslate-popup-content");g?(r.textContent="".concat(T(n)," → ").concat(T(c)),r.style.display="block"):r.style.display="none",i.textContent=t,v.style.display="block",requestAnimationFrame((function(){v.style.opacity="1",v.style.transform="translateY(0)"})),v.style.display="block";var s=selection.getRangeAt(0).getBoundingClientRect();!function(e,t){if(v){var n,o,a=window.innerWidth,r=window.innerHeight,i=v.getBoundingClientRect(),s=i.width||300,c=i.height||100;switch(p){case"cursor":default:n=e,o=t+10;break;case"fixed":n=a/2,o=r/2}switch(n+s>a&&(n=a-s-10),o+c>r&&(o=t-c-10),n=Math.max(10,Math.min(a-s-10,n)),o=Math.max(10,Math.min(r-c-10,o)),p){case"cursor":n=e+10,o=t+10;break;case"above":n=e,o=t-10,v.style.transform="translateY(-100%)";break;case"below":n=e,o=t+20,v.style.transform="translateY(0)";break;case"fixed":n=window.innerWidth-320,o=window.innerHeight-100}n+i.width>window.innerWidth&&(n=window.innerWidth-i.width-10),o+i.height>window.innerHeight&&(o=window.innerHeight-i.height-10),n+s>window.innerWidth&&(n=window.innerWidth-s-10),o+c>window.innerHeight&&(o=window.innerHeight-c-10),v.style.left="".concat(n,"px"),v.style.top="".concat(o,"px")}}(s.left+s.width/2,s.bottom+window.scrollY),v.style.opacity="1",v.style.transform="translateY(0)"}function F(){v&&(v.style.opacity="0",setTimeout((function(){v.style.display="none"}),200))}function L(e){if("INPUT"===e.tagName||"TEXTAREA"===e.tagName||"SELECT"===e.tagName)return"";var t="",n=window.getSelection();if(n&&n.toString().trim())t=n.toString().trim();else if(1===e.childNodes.length&&e.childNodes[0].nodeType===Node.TEXT_NODE)t=e.textContent.trim();else{for(var o,a=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),r=[];o=a.nextNode();)o.nodeType===Node.TEXT_NODE&&o.nodeValue.trim()&&r.push(o.nodeValue.trim());t=r.join(" ").trim()}return t}function E(e){return/[а-яА-Я]/.test(e)?"ru":/[\u4E00-\u9FFF]/.test(e)?"zh":/[\u3040-\u30FF]/.test(e)?"ja":/[äöüßÄÖÜ]/.test(e)?"de":/[àâçéèêëîïôùûüÿæœÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ]/.test(e)?"fr":/[áéíóúüñÁÉÍÓÚÜÑ]/.test(e)?"es":"en"}function T(e){return{en:"English",es:"Spanish",fr:"French",de:"German",it:"Italian",pt:"Portuguese",ru:"Russian",zh:"Chinese",ja:"Japanese",ko:"Korean",auto:"Auto-detected"}[e]||e}function C(e,t){return new Promise((function(n,o){chrome.runtime.sendMessage({action:"translate",text:e,sourceLanguage:t,targetLanguage:c},(function(e){e&&e.translatedText?n(e):o(new Error((null==e?void 0:e.error)||"Translation failed"))}))}))}document.addEventListener("DOMContentLoaded",(function(){x()})),chrome.storage.sync.get(["isActive","hoverDelay","targetLanguage","autoDetectLanguage","sourceLanguages","popupStyle","popupPosition","fontSize","showSourceLanguage","translateOnHover","keyboardShortcutActivation","activationKey"],(function(e){void 0!==e.isActive&&(i=e.isActive),void 0!==e.hoverDelay&&(s=e.hoverDelay),void 0!==e.targetLanguage&&(c=e.targetLanguage),void 0!==e.autoDetectLanguage&&(l=e.autoDetectLanguage),void 0!==e.sourceLanguages&&(u=e.sourceLanguages),void 0!==e.popupStyle&&(d=e.popupStyle),void 0!==e.popupPosition&&(p=e.popupPosition),void 0!==e.fontSize&&(y=e.fontSize),void 0!==e.showSourceLanguage&&(g=e.showSourceLanguage),void 0!==e.translateOnHover&&(m=e.translateOnHover),void 0!==e.keyboardShortcutActivation&&(h=e.keyboardShortcutActivation),void 0!==e.activationKey&&(f=e.activationKey)})),chrome.storage.onChanged.addListener((function(e,t){if("sync"===t)for(var n in e)switch(n){case"isActive":i=e[n].newValue;break;case"hoverDelay":s=e[n].newValue;break;case"targetLanguage":c=e[n].newValue;break;case"autoDetectLanguage":l=e[n].newValue;break;case"sourceLanguages":u=e[n].newValue;break;case"popupStyle":d=e[n].newValue,v&&S();break;case"popupPosition":p=e[n].newValue;break;case"fontSize":y=e[n].newValue,v&&S();break;case"showSourceLanguage":g=e[n].newValue;break;case"translateOnHover":m=e[n].newValue;break;case"keyboardShortcutActivation":h=e[n].newValue;break;case"activationKey":f=e[n].newValue}})),chrome.runtime.onMessage.addListener((function(e,t,n){return"toggleActive"===e.action&&(!(i=e.isActive)&&v&&F(),n({success:!0})),!0})),document.addEventListener("mousemove",(function(e){if(i&&m&&function(e){if(!h||"none"===f)return!0;switch(f){case"alt":return e.altKey;case"ctrl":return e.ctrlKey;case"shift":return e.shiftKey;default:return!0}}(e)){var t=window.getSelection().toString().trim();if(t){var n=l?E(t):"auto";if(l||u.includes(n)){w&&clearTimeout(w),w=setTimeout((function(){C(t,n).then((function(e){e.translatedText&&showTranslation(t,e.translatedText,e.detectedSourceLanguage||n)})).catch((function(e){console.error("Translation error:",e)}))}),s);var a=e.target;v&&(a===v||v.contains(a))||a!==b&&(b=a,w=setTimeout((0,o.A)(r().mark((function t(){var n,o,i;return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!((n=L(a))&&n.length>1)){t.next=18;break}if(o="auto",!l&&u.length>0?o=u[0]:l&&(o=E(n)),o!==c){t.next=6;break}return t.abrupt("return");case 6:return t.prev=6,t.next=9,C(n,o);case 9:k(0,(i=t.sent).translatedText,i.detectedSourceLanguage||o,e.clientX,e.clientY),t.next=16;break;case 13:t.prev=13,t.t0=t.catch(6),console.error("Translation error:",t.t0);case 16:t.next=19;break;case 18:v&&"none"!==v.style.display&&F();case 19:case"end":return t.stop()}}),t,null,[[6,13]])}))),s))}}else v&&"none"!==v.style.display&&F()}else v&&"none"!==v.style.display&&F()})),document.addEventListener("mouseout",(function(){w&&(clearTimeout(w),w=null)})),document.addEventListener("keydown",(function(e){if(e.ctrlKey&&e.shiftKey&&"T"===e.key&&(i=!i,chrome.runtime.sendMessage({action:"setActive",isActive:i}),!i&&v&&F()),e.ctrlKey&&"c"===e.key&&v&&"none"!==v.style.display){var t=v.querySelector(".curslate-popup-content").textContent;navigator.clipboard.writeText(t).then((function(){var e=v.querySelector(".curslate-popup-content").textContent;v.querySelector(".curslate-popup-content").textContent="Copied to clipboard!",setTimeout((function(){v.querySelector(".curslate-popup-content").textContent=e}),1e3)})).catch((function(e){console.error("Failed to copy: ",e)}))}})),document.addEventListener("contextmenu",(function(e){var t=window.getSelection().toString().trim();t&&(sessionStorage.setItem("curslateSelectedText",t),sessionStorage.setItem("curslatePositionX",e.clientX),sessionStorage.setItem("curslatePositionY",e.clientY))}))}},e=>{e.O(0,[363],(()=>e(e.s=630))),e.O()}]);