!function t(e,n,i){function o(s,a){if(!n[s]){if(!e[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var u=n[s]={exports:{}};e[s][0].call(u.exports,function(t){var n=e[s][1][t];return o(n?n:t)},u,u.exports,t,e,n,i)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<i.length;s++)o(i[s]);return o}({1:[function(e,t,n){var i=e("../views/project-view"),o=e("../views/menu-view"),r=function(){function e(){return-1!=window.location.href.indexOf("/z/")?"z":-1!=window.location.href.indexOf("/a/")?"a":-1!=r.indexOf("/z/")?"z":(-1!=r.indexOf("/a/"),"a")}var t,n,r,s="",a=function(e){n="es"!=WPGlobus.language?"/"+WPGlobus.language:"",r="undefined"!=typeof e?e:"/a/",o.initSubMenu(),c(),u()},c=function(){t=e(),null!==document.getElementById("menuRight")&&document.getElementById("menuRight").addEventListener("click",function(e){i.clearTheInterval(),-1!=window.location.href.indexOf("/a/")?emitter.emit("requestNewPage",s+n+"/z/"):o.showSubMenu()},!1),null!==document.getElementById("menuLeft")&&document.getElementById("menuLeft").addEventListener("click",function(e){i.clearTheInterval(),-1!=window.location.href.indexOf("/a/")?o.showSubMenu():emitter.emit("requestNewPage",s+n+"/a/")},!1),null!==document.getElementById("crossMenu")&&document.getElementById("crossMenu").addEventListener("click",function(e){i.clearTheInterval(),emitter.emit("requestNewPage",s+n+"/"+t+"/")},!1)},u=function(){for(var e=document.getElementById("sub-sections"),t=e.getElementsByTagName("li"),i=document.getElementById("overlay"),r=0;r<t.length;r++)t[r].addEventListener("click",function(e){e.stopPropagation(),o.hideSubMenu(!1),emitter.emit("requestNewPage",s+n+e.target.getAttribute("data-href"))});i.addEventListener("click",function(e){o.hideSubMenu(!0)})};return{init:a}};t.exports=new r},{"../views/menu-view":9,"../views/project-view":10}],2:[function(e,t,n){var i=e("../views/homepage-view"),o=e("./menu-controller"),r=e("../views/project-view"),s=e("../models/page-model"),a=e("../views/gallery-view"),c=e("../views/puente-view"),u=function(){var e,t=function(){m(),emitter.on("loadNewPage",function(e){d(e)}),emitter.on("requestNewPage",function(t){l(),e=window.location.href,n(t)}),emitter.on("homeRequestNewPage",function(e){i.fadeOut(),n(e.target.id+"/",!0)}),window.addEventListener("popstate",function(e){l(),setTimeout(function(){s.initNewPage(e.state,!1)},1e3)}),u()},n=function(e){setTimeout(function(){s.initNewPage(e)},1e3)},u=function(){document.getElementById("primary").className.match(/page-puente/)&&c.init(e),document.getElementById("primary").className.match(/homepage/)?i.init():o.init(e),document.getElementById("primary").className.match(/single-project/)&&r.init(),document.getElementById("primary").className.match(/page-gallery/)&&a.init()},l=function(){setTimeout(function(){document.getElementById("primary").className=document.getElementById("primary").className.replace("fade-in-page","fade-out-page")},500),setTimeout(f,1500)},m=function(){setTimeout(function(){document.getElementById("primary").className=document.getElementById("primary").className.replace("fade-out","fade-in-page")},500)},d=function(e){var t=new DOMParser,n=t.parseFromString(e,"text/html");document.title=n.title,document.body.className=n.body.className,document.body.innerHTML=n.body.innerHTML,m(),u()},f=function(){window.scrollTo(0,0)};return{init:t}};t.exports=new u},{"../models/page-model":6,"../views/gallery-view":7,"../views/homepage-view":8,"../views/project-view":10,"../views/puente-view":11,"./menu-controller":1}],3:[function(e,t,n){var i=function(){var e,t=function(t){e=document.getElementById(t),n(),window.addEventListener("scroll",n)},n=function(){i()&&(window.removeEventListener("scroll",n),o(e))},i=function(){{var t=e.getBoundingClientRect().top;e.getBoundingClientRect().bottom}return t>=0&&t+100<=window.innerHeight},o=function(){e.className=e.className+" fade-in"};return{init:t}};t.exports=new i},{}],4:[function(e,t,n){var i=e("./controllers/page-controller"),o=e("./managers/emitter"),r=function(){emitter=new o,i.init()};r()},{"./controllers/page-controller":2,"./managers/emitter":5}],5:[function(e,t,n){function i(e){return e?o(e):void 0}function o(e){for(var t in i.prototype)e[t]=i.prototype[t];return e}t.exports=i,i.prototype.on=i.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this},i.prototype.once=function(e,t){function n(){this.off(e,n),t.apply(this,arguments)}return n.fn=t,this.on(e,n),this},i.prototype.off=i.prototype.removeListener=i.prototype.removeAllListeners=i.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks["$"+e];if(!n)return this;if(1==arguments.length)return delete this._callbacks["$"+e],this;for(var i,o=0;o<n.length;o++)if(i=n[o],i===t||i.fn===t){n.splice(o,1);break}return this},i.prototype.emit=function(e){this._callbacks=this._callbacks||{};var t=[].slice.call(arguments,1),n=this._callbacks["$"+e];if(n){n=n.slice(0);for(var i=0,o=n.length;o>i;++i)n[i].apply(this,t)}return this},i.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]},i.prototype.hasListeners=function(e){return!!this.listeners(e).length}},{}],6:[function(t,n,i){var o=function(){var t=function(t,i){i="undefined"!=typeof i?i:!0,t||(t=""),history.pushState?n(t,i):window.location.href=e.target.id+"/"},n=function(e,t){if(window.XMLHttpRequest){var n=new XMLHttpRequest;n.open("GET",e,!0),n.onload=function(i){4===n.readyState&&200===n.status&&(1==t&&history.pushState(e,"",e),setTimeout(function(){emitter.emit("loadNewPage",n.responseText)},500))},n.onerror=function(e){},n.send(null)}else window.location.href=e};return{initNewPage:t}};n.exports=new o},{}],7:[function(e,t,n){var i=e("../controllers/scroll-controller"),o=function(){var e=function(){i.init("gallery-pagination");for(var e=document.getElementsByClassName("project"),t=0;t<e.length;t++)e[t].addEventListener("click",function(e){e.stopPropagation(),emitter.emit("requestNewPage",e.target.parentNode.getAttribute("data-href"))})};return{init:e}};t.exports=new o},{"../controllers/scroll-controller":3}],8:[function(e,t,n){var i=function(){var e=function(){for(var e=document.getElementsByClassName("square"),t=0;t<e.length;t++)e[t].addEventListener("click",function(e){e.stopPropagation(),emitter.emit("homeRequestNewPage",e)});document.body.addEventListener("click",i,!1)},t=function(){document.getElementsByClassName("container-home")[0].className+=" fade-out-home"},n=function(e,t,n){e.className=e.className.replace(t,n)},i=function(e){e.stopPropagation();var t=document.getElementsByClassName("light"),i=document.getElementsByClassName("mid"),o=document.getElementsByClassName("dark");t=t[0],i=i[0],o=o[0],n(o,"dark","mid"),n(i,"mid","light"),n(t,"light","dark")};return{init:e,fadeOut:t}};t.exports=new i},{}],9:[function(e,t,n){var i=function(){var e,t,n=function(){e=document.getElementById("overlay"),t=document.getElementById("submenu")},i=function(){e.style.visibility="visible",t.style.visibility="visible",e.className=e.className+" fade-in",t.className=t.className+" fade-in"},o=function(n){t.className=t.className.replace("fade-in","fade-out"),n===!0&&(e.className=e.className.replace("fade-in","fade-out"),e.style.visibility="hidden",t.style.visibility="hidden")};return{initSubMenu:n,showSubMenu:i,hideSubMenu:o}};t.exports=new i},{}],10:[function(e,t,n){var i=e("../controllers/scroll-controller"),o=function(){function e(e){this.photos=e.getElementsByClassName("gallery-item"),this.currentPhoto=this.photos.length-1,this.DOMObject=e,this.time=e.getAttribute("data-time"),this.time=void 0==this.time?2e3:1e3*this.time,this.init=function(){n.push(this),this._setTime(this.time)},this._setTime=function(e){var t=this;this._nIntervId=setTimeout(function(){t._fadePhoto()},e)},this._fadePhoto=function(){if(clearTimeout(this._timeoutID),0!=this.currentPhoto)this.photos[this.currentPhoto].className=this.photos[this.currentPhoto].className+" fade-out",this._setTime(this.time);else{this.photos[this.currentPhoto].className=this.photos[this.currentPhoto].className+" fade-out",this.photos[this.photos.length-1].className=this.photos[this.photos.length-1].className.replace(" fade-out","");var e=this;this._timeoutID=setTimeout(function(){for(var t=0;t<e.photos.length;t++)e.photos[t].className=e.photos[t].className.replace(" fade-out","")},800);var t=this.time>=1e3?this.time+1e3:this.time;this._setTime(t)}0==this.currentPhoto?this.currentPhoto=this.photos.length-1:this.currentPhoto--}}var t,n=new Array,o=function(){t="es"!=WPGlobus.language?WPGlobus.language:"",i.init("related-posts"),c();for(var e=document.getElementsByClassName("gallery"),n=0;n<e.length;n++)r(e[n]);for(var o=document.getElementsByClassName("project"),n=0;n<o.length;n++)o[n].addEventListener("click",function(e){e.stopPropagation(),emitter.emit("requestNewPage",t+e.target.parentNode.getAttribute("data-href"))})},r=function(t){var n=new e(t);n.init()},s=function(){for(var e=0;e<n.length;e++)clearTimeout(n[e]._nIntervId)},a=function(e,t){for(;(e=e.parentElement)&&!e.classList.contains(t););return e},c=function(){var e;document.contains(document.getElementById("square-previous"))&&document.getElementById("square-previous").addEventListener("click",function(t){s(),e=a(t.target,"clickable-square"),emitter.emit("requestNewPage",e.getAttribute("data-href"))},!1),document.contains(document.getElementById("square-next"))&&document.getElementById("square-next").addEventListener("click",function(t){s(),e=a(t.target,"clickable-square"),emitter.emit("requestNewPage",e.getAttribute("data-href"))},!1),document.getElementById("scroll-up").addEventListener("click",function(e){!function t(){var e=document.documentElement.scrollTop||document.body.scrollTop;e>0&&(window.requestAnimationFrame(t),window.scrollTo(0,e-e/25))}()},!1)};return{init:o,clearTheInterval:s}};t.exports=new o},{"../controllers/scroll-controller":3}],11:[function(e,t,n){var i=function(){var e=function(e){e="undefined"!=typeof e?e:"/a/",document.getElementById("menu").innerHTML=-1!=e.indexOf("/a/")?'<div id="crossMenu" class="cross-menu left"></div><!--<div id="menuRight" class="square-menu right"></div>-->':'<!--<div id="menuLeft" class="square-menu left"></div>--><div id="crossMenu" class="cross-menu right"></div>'};return{init:e}};t.exports=new i},{}]},{},[4]);