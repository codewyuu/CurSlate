(self.webpackChunk=self.webpackChunk||[]).push([[6624],{42746:(e,n,r)=>{var o=r(48287).Buffer,t=Object.prototype.toString,f=void 0!==o&&"function"==typeof o.alloc&&"function"==typeof o.allocUnsafe&&"function"==typeof o.from;e.exports=function(e,n,r){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return i=e,"ArrayBuffer"===t.call(i).slice(8,-1)?function(e,n,r){n>>>=0;var t=e.byteLength-n;if(t<0)throw new RangeError("'offset' is out of bounds");if(void 0===r)r=t;else if((r>>>=0)>t)throw new RangeError("'length' is out of bounds");return f?o.from(e.slice(n,n+r)):new o(new Uint8Array(e.slice(n,n+r)))}(e,n,r):"string"==typeof e?function(e,n){if("string"==typeof n&&""!==n||(n="utf8"),!o.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');return f?o.from(e,n):new o(e,n)}(e,n):f?o.from(e):new o(e);var i}}}]);