/*! For license information please see vendor.destroy.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9733],{17013:(n,e,t)=>{var o=t(37007).EventEmitter,i=t(67713).ReadStream,r=t(88310),s=t(78559);function f(){}function c(){this._binding.clear()}function a(){"number"==typeof this.fd&&this.close()}n.exports=function(n,e){return!function(n){return n instanceof i}(n)?function(n){return n instanceof s.Gzip||n instanceof s.Gunzip||n instanceof s.Deflate||n instanceof s.DeflateRaw||n instanceof s.Inflate||n instanceof s.InflateRaw||n instanceof s.Unzip}(n)?function(n){"function"==typeof n.destroy?n._binding?(n.destroy(),n._processing?(n._needDrain=!0,n.once("drain",c)):n._binding.clear()):n._destroy&&n._destroy!==r.Transform.prototype._destroy?n.destroy():n._destroy&&"function"==typeof n.close?(n.destroyed=!0,n.close()):n.destroy():"function"==typeof n.close&&function(n){if(!0===n._hadError){var e=null===n._binding?"_binding":"_handle";n[e]={close:function(){this[e]=null}}}n.close()}(n)}(n):function(n){return n instanceof r&&"function"==typeof n.destroy}(n)&&n.destroy():function(n){n.destroy(),"function"==typeof n.close&&n.on("open",a)}(n),n instanceof o&&e&&(n.removeAllListeners("error"),n.addListener("error",f)),n}}}]);