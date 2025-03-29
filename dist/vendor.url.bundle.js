"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6832],{88835:(t,h,s)=>{var e=s(9655);function a(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}var r=/^([a-z0-9.+-]+:)/i,o=/:[0-9]*$/,n=/^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/,i=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),l=["'"].concat(i),p=["%","/","?",";","#"].concat(l),c=["/","?","#"],f=/^[+a-z0-9A-Z_-]{0,63}$/,u=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,m={javascript:!0,"javascript:":!0},v={javascript:!0,"javascript:":!0},y={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},g=s(55373);function b(t,h,s){if(t&&"object"==typeof t&&t instanceof a)return t;var e=new a;return e.parse(t,h,s),e}a.prototype.parse=function(t,h,s){if("string"!=typeof t)throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var a=t.indexOf("?"),o=-1!==a&&a<t.indexOf("#")?"?":"#",i=t.split(o);i[0]=i[0].replace(/\\/g,"/");var b=t=i.join(o);if(b=b.trim(),!s&&1===t.split("#").length){var j=n.exec(b);if(j)return this.path=b,this.href=b,this.pathname=j[1],j[2]?(this.search=j[2],this.query=h?g.parse(this.search.substr(1)):this.search.substr(1)):h&&(this.search="",this.query={}),this}var d=r.exec(b);if(d){var O=(d=d[0]).toLowerCase();this.protocol=O,b=b.substr(d.length)}if(s||d||b.match(/^\/\/[^@/]+@[^@/]+/)){var q="//"===b.substr(0,2);!q||d&&v[d]||(b=b.substr(2),this.slashes=!0)}if(!v[d]&&(q||d&&!y[d])){for(var x,A,C=-1,k=0;k<c.length;k++)-1!==(w=b.indexOf(c[k]))&&(-1===C||w<C)&&(C=w);for(-1!==(A=-1===C?b.lastIndexOf("@"):b.lastIndexOf("@",C))&&(x=b.slice(0,A),b=b.slice(A+1),this.auth=decodeURIComponent(x)),C=-1,k=0;k<p.length;k++){var w;-1!==(w=b.indexOf(p[k]))&&(-1===C||w<C)&&(C=w)}-1===C&&(C=b.length),this.host=b.slice(0,C),b=b.slice(C),this.parseHost(),this.hostname=this.hostname||"";var I="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!I)for(var U=this.hostname.split(/\./),R=(k=0,U.length);k<R;k++){var $=U[k];if($&&!$.match(f)){for(var z="",H=0,L=$.length;H<L;H++)$.charCodeAt(H)>127?z+="x":z+=$[H];if(!z.match(f)){var P=U.slice(0,k),Z=U.slice(k+1),_=$.match(u);_&&(P.push(_[1]),Z.unshift(_[2])),Z.length&&(b="/"+Z.join(".")+b),this.hostname=P.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),I||(this.hostname=e.toASCII(this.hostname));var E=this.port?":"+this.port:"",F=this.hostname||"";this.host=F+E,this.href+=this.host,I&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==b[0]&&(b="/"+b))}if(!m[O])for(k=0,R=l.length;k<R;k++){var Q=l[k];if(-1!==b.indexOf(Q)){var S=encodeURIComponent(Q);S===Q&&(S=escape(Q)),b=b.split(Q).join(S)}}var T=b.indexOf("#");-1!==T&&(this.hash=b.substr(T),b=b.slice(0,T));var B=b.indexOf("?");if(-1!==B?(this.search=b.substr(B),this.query=b.substr(B+1),h&&(this.query=g.parse(this.query)),b=b.slice(0,B)):h&&(this.search="",this.query={}),b&&(this.pathname=b),y[O]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){E=this.pathname||"";var D=this.search||"";this.path=E+D}return this.href=this.format(),this},a.prototype.format=function(){var t=this.auth||"";t&&(t=(t=encodeURIComponent(t)).replace(/%3A/i,":"),t+="@");var h=this.protocol||"",s=this.pathname||"",e=this.hash||"",a=!1,r="";this.host?a=t+this.host:this.hostname&&(a=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(a+=":"+this.port)),this.query&&"object"==typeof this.query&&Object.keys(this.query).length&&(r=g.stringify(this.query,{arrayFormat:"repeat",addQueryPrefix:!1}));var o=this.search||r&&"?"+r||"";return h&&":"!==h.substr(-1)&&(h+=":"),this.slashes||(!h||y[h])&&!1!==a?(a="//"+(a||""),s&&"/"!==s.charAt(0)&&(s="/"+s)):a||(a=""),e&&"#"!==e.charAt(0)&&(e="#"+e),o&&"?"!==o.charAt(0)&&(o="?"+o),h+a+(s=s.replace(/[?#]/g,(function(t){return encodeURIComponent(t)})))+(o=o.replace("#","%23"))+e},a.prototype.resolve=function(t){return this.resolveObject(b(t,!1,!0)).format()},a.prototype.resolveObject=function(t){if("string"==typeof t){var h=new a;h.parse(t,!1,!0),t=h}for(var s=new a,e=Object.keys(this),r=0;r<e.length;r++){var o=e[r];s[o]=this[o]}if(s.hash=t.hash,""===t.href)return s.href=s.format(),s;if(t.slashes&&!t.protocol){for(var n=Object.keys(t),i=0;i<n.length;i++){var l=n[i];"protocol"!==l&&(s[l]=t[l])}return y[s.protocol]&&s.hostname&&!s.pathname&&(s.pathname="/",s.path=s.pathname),s.href=s.format(),s}if(t.protocol&&t.protocol!==s.protocol){if(!y[t.protocol]){for(var p=Object.keys(t),c=0;c<p.length;c++){var f=p[c];s[f]=t[f]}return s.href=s.format(),s}if(s.protocol=t.protocol,t.host||v[t.protocol])s.pathname=t.pathname;else{for(var u=(t.pathname||"").split("/");u.length&&!(t.host=u.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==u[0]&&u.unshift(""),u.length<2&&u.unshift(""),s.pathname=u.join("/")}if(s.search=t.search,s.query=t.query,s.host=t.host||"",s.auth=t.auth,s.hostname=t.hostname||t.host,s.port=t.port,s.pathname||s.search){var m=s.pathname||"",g=s.search||"";s.path=m+g}return s.slashes=s.slashes||t.slashes,s.href=s.format(),s}var b=s.pathname&&"/"===s.pathname.charAt(0),j=t.host||t.pathname&&"/"===t.pathname.charAt(0),d=j||b||s.host&&t.pathname,O=d,q=s.pathname&&s.pathname.split("/")||[],x=(u=t.pathname&&t.pathname.split("/")||[],s.protocol&&!y[s.protocol]);if(x&&(s.hostname="",s.port=null,s.host&&(""===q[0]?q[0]=s.host:q.unshift(s.host)),s.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===u[0]?u[0]=t.host:u.unshift(t.host)),t.host=null),d=d&&(""===u[0]||""===q[0])),j)s.host=t.host||""===t.host?t.host:s.host,s.hostname=t.hostname||""===t.hostname?t.hostname:s.hostname,s.search=t.search,s.query=t.query,q=u;else if(u.length)q||(q=[]),q.pop(),q=q.concat(u),s.search=t.search,s.query=t.query;else if(null!=t.search)return x&&(s.host=q.shift(),s.hostname=s.host,(I=!!(s.host&&s.host.indexOf("@")>0)&&s.host.split("@"))&&(s.auth=I.shift(),s.hostname=I.shift(),s.host=s.hostname)),s.search=t.search,s.query=t.query,null===s.pathname&&null===s.search||(s.path=(s.pathname?s.pathname:"")+(s.search?s.search:"")),s.href=s.format(),s;if(!q.length)return s.pathname=null,s.search?s.path="/"+s.search:s.path=null,s.href=s.format(),s;for(var A=q.slice(-1)[0],C=(s.host||t.host||q.length>1)&&("."===A||".."===A)||""===A,k=0,w=q.length;w>=0;w--)"."===(A=q[w])?q.splice(w,1):".."===A?(q.splice(w,1),k++):k&&(q.splice(w,1),k--);if(!d&&!O)for(;k--;k)q.unshift("..");!d||""===q[0]||q[0]&&"/"===q[0].charAt(0)||q.unshift(""),C&&"/"!==q.join("/").substr(-1)&&q.push("");var I,U=""===q[0]||q[0]&&"/"===q[0].charAt(0);return x&&(s.hostname=U?"":q.length?q.shift():"",s.host=s.hostname,(I=!!(s.host&&s.host.indexOf("@")>0)&&s.host.split("@"))&&(s.auth=I.shift(),s.hostname=I.shift(),s.host=s.hostname)),(d=d||s.host&&q.length)&&!U&&q.unshift(""),q.length>0?s.pathname=q.join("/"):(s.pathname=null,s.path=null),null===s.pathname&&null===s.search||(s.path=(s.pathname?s.pathname:"")+(s.search?s.search:"")),s.auth=t.auth||s.auth,s.slashes=s.slashes||t.slashes,s.href=s.format(),s},a.prototype.parseHost=function(){var t=this.host,h=o.exec(t);h&&(":"!==(h=h[0])&&(this.port=h.substr(1)),t=t.substr(0,t.length-h.length)),t&&(this.hostname=t)},h.parse=b,h.resolve=function(t,h){return b(t,!1,!0).resolve(h)},h.resolveObject=function(t,h){return t?b(t,!1,!0).resolveObject(h):h},h.format=function(t){return"string"==typeof t&&(t=b(t)),t instanceof a?t.format():a.prototype.format.call(t)},h.Url=a}}]);