"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7014],{67332:(e,u,o)=>{var n=o(39404),r=o(53209),m=o(92861).Buffer;function d(e){var u,o=e.modulus.byteLength();do{u=new n(r(o))}while(u.cmp(e.modulus)>=0||!u.umod(e.prime1)||!u.umod(e.prime2));return u}function i(e,u){var o=function(e){var u=d(e);return{blinder:u.toRed(n.mont(e.modulus)).redPow(new n(e.publicExponent)).fromRed(),unblinder:u.invm(e.modulus)}}(u),r=u.modulus.byteLength(),i=new n(e).mul(o.blinder).umod(u.modulus),t=i.toRed(n.mont(u.prime1)),l=i.toRed(n.mont(u.prime2)),p=u.coefficient,s=u.prime1,f=u.prime2,b=t.redPow(u.exponent1).fromRed(),c=l.redPow(u.exponent2).fromRed(),w=b.isub(c).imul(p).umod(s).imul(f);return c.iadd(w).imul(o.unblinder).umod(u.modulus).toArrayLike(m,"be",r)}i.getr=d,e.exports=i}}]);