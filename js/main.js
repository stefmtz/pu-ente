!function e(t,o,r){function n(s,i){if(!o[s]){if(!t[s]){var l="function"==typeof require&&require;if(!i&&l)return l(s,!0);if(a)return a(s,!0);throw new Error("Cannot find module '"+s+"'")}var u=o[s]={exports:{}};t[s][0].call(u.exports,function(e){var o=t[s][1][e];return n(o?o:e)},u,u.exports,e,t,o,r)}return o[s].exports}for(var a="function"==typeof require&&require,s=0;s<r.length;s++)n(r[s]);return n}({1:[function(e,t,o){var r=e("../managers/route-manager"),n=function(){console.log("HPController");for(var e=document.getElementsByClassName("square"),t=0;t<e.length;t++)e[t].addEventListener("click",r,!1)};t.exports=n},{"../managers/route-manager":3}],2:[function(e,t,o){var r=e("./controllers/homepage-controller"),n=function(){r()};t.exports=n()},{"./controllers/homepage-controller":1}],3:[function(e,t,o){var r=function(e){function t(e){e.stopPropagation(),history.pushState?(document.getElementById("primary").className+=" disappear",document.getElementsByClassName("container-home")[0].className+=" disappear",history.pushState(e.target.id,"",e.target.id+"/"),o(e.target.id+"/")):window.location.href=e.target.id+"/"}function o(e){if(window.XMLHttpRequest){console.log("requestPage");var t=new XMLHttpRequest;t.open("GET",e,!0),t.onload=function(e){4===t.readyState&&(200===t.status?r(t.responseText):console.error(t.statusText))},t.onerror=function(e){console.error(t.statusText)},t.send(null)}else window.location.href=e}function r(e){console.log("loadNewPage");var t=new DOMParser,o=t.parseFromString(e,"text/html");console.log(o),document.body=o.body,document.title=o.title}console.log("RouteManager"),t(e)};t.exports=r},{}]},{},[2]);