"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6661],{74465:e=>{e.exports=e=>{const r={};for(const[t,s]of Object.entries(e))r[t.toLowerCase()]=s;return r}},79204:(e,r,t)=>{var s=t(48287).Buffer;const o=t(88310).Readable,u=t(74465);e.exports=class extends o{constructor(e,r,t,o){if("number"!=typeof e)throw new TypeError("Argument `statusCode` should be a number");if("object"!=typeof r)throw new TypeError("Argument `headers` should be an object");if(!(t instanceof s))throw new TypeError("Argument `body` should be a buffer");if("string"!=typeof o)throw new TypeError("Argument `url` should be a string");super(),this.statusCode=e,this.headers=u(r),this.body=t,this.url=o}_read(){this.push(this.body),this.push(null)}}}}]);