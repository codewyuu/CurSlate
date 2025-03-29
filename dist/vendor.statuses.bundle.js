/*! For license information please see vendor.statuses.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[8823],{17662:e=>{e.exports=JSON.parse('{"100":"Continue","101":"Switching Protocols","102":"Processing","103":"Early Hints","200":"OK","201":"Created","202":"Accepted","203":"Non-Authoritative Information","204":"No Content","205":"Reset Content","206":"Partial Content","207":"Multi-Status","208":"Already Reported","226":"IM Used","300":"Multiple Choices","301":"Moved Permanently","302":"Found","303":"See Other","304":"Not Modified","305":"Use Proxy","307":"Temporary Redirect","308":"Permanent Redirect","400":"Bad Request","401":"Unauthorized","402":"Payment Required","403":"Forbidden","404":"Not Found","405":"Method Not Allowed","406":"Not Acceptable","407":"Proxy Authentication Required","408":"Request Timeout","409":"Conflict","410":"Gone","411":"Length Required","412":"Precondition Failed","413":"Payload Too Large","414":"URI Too Long","415":"Unsupported Media Type","416":"Range Not Satisfiable","417":"Expectation Failed","418":"I\'m a Teapot","421":"Misdirected Request","422":"Unprocessable Entity","423":"Locked","424":"Failed Dependency","425":"Too Early","426":"Upgrade Required","428":"Precondition Required","429":"Too Many Requests","431":"Request Header Fields Too Large","451":"Unavailable For Legal Reasons","500":"Internal Server Error","501":"Not Implemented","502":"Bad Gateway","503":"Service Unavailable","504":"Gateway Timeout","505":"HTTP Version Not Supported","506":"Variant Also Negotiates","507":"Insufficient Storage","508":"Loop Detected","509":"Bandwidth Limit Exceeded","510":"Not Extended","511":"Network Authentication Required"}')},52403:(e,t,o)=>{var r=o(17662);function n(e){if(!Object.prototype.hasOwnProperty.call(a.message,e))throw new Error("invalid status code: "+e);return a.message[e]}function a(e){if("number"==typeof e)return n(e);if("string"!=typeof e)throw new TypeError("code must be a number or string");var t=parseInt(e,10);return isNaN(t)?function(e){var t=e.toLowerCase();if(!Object.prototype.hasOwnProperty.call(a.code,t))throw new Error('invalid status message: "'+e+'"');return a.code[t]}(e):n(t)}e.exports=a,a.message=r,a.code=function(e){var t={};return Object.keys(e).forEach((function(o){var r=e[o],n=Number(o);t[r.toLowerCase()]=n})),t}(r),a.codes=function(e){return Object.keys(e).map((function(e){return Number(e)}))}(r),a.redirect={300:!0,301:!0,302:!0,303:!0,305:!0,307:!0,308:!0},a.empty={204:!0,205:!0,304:!0},a.retry={502:!0,503:!0,504:!0}}}]);