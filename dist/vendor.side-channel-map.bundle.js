"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7651],{80507:(t,e,n)=>{var o=n(70453),r=n(36556),p=n(58859),a=n(69675),s=o("%Map%",!0),u=r("Map.prototype.get",!0),i=r("Map.prototype.set",!0),c=r("Map.prototype.has",!0),f=r("Map.prototype.delete",!0),h=r("Map.prototype.size",!0);t.exports=!!s&&function(){var t,e={assert:function(t){if(!e.has(t))throw new a("Side channel does not contain "+p(t))},delete:function(e){if(t){var n=f(t,e);return 0===h(t)&&(t=void 0),n}return!1},get:function(e){if(t)return u(t,e)},has:function(e){return!!t&&c(t,e)},set:function(e,n){t||(t=new s),i(t,e,n)}};return e}}}]);