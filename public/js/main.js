(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Gallery Controller*/

var GalleryController = function () {

	var _photos = null;
	var _currentPhoto;
	var _nIntervId;

	var init = function () {
		
		var galleries = document.getElementsByClassName("gallery");

		for (var i = 0; i < galleries.length; i++) {
			_initGallery(galleries[i]);
		}
	};

	var _initGallery = function(gallery){

		_photos = document.getElementsByClassName("gallery-item");

		_currentPhoto = _photos.length-1;
		_nIntervId = setInterval(_fadePhoto, 3000);

	};

	var _fadePhoto = function(){

		if (_currentPhoto!=0){
			_photos[_currentPhoto].className = _photos[_currentPhoto].className + " fade-out";
		} else {
			/*STEF MEJORAR: se puede mejorar haciendo fade-in primero de la primera foto y luego del resto */	
			for (var i = 0; i < _photos.length; i++) {
				_photos[i].className = _photos[i].className.replace(" fade-out", "");
			};			
		}

		_currentPhoto == 0 ? _currentPhoto = _photos.length-1 : _currentPhoto--;

	}


	return {
		init: init
	};

};

module.exports = new GalleryController();
},{}],2:[function(require,module,exports){
/* Home Page Controller*/
var RouteManager = require('../managers/route-manager')
;



var HomepageController = function () {

	homepageView = null;

	var init = function () {
		console.log('HomepageController');
		
		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", function(e){
				RouteManager.init(e, true, e.target.id);
			}); 
		}	

	};


	return {
		init: init
	};

};

module.exports = new HomepageController();
},{"../managers/route-manager":6}],3:[function(require,module,exports){
/* Home Page Controller */
var routeManager = require('../managers/route-manager');


var menuController = function () {

	var init = function () {
		console.log('menuController');
	
		var m = document.getElementById("menu"),
			cat;

		if(window.location.href.indexOf("/a/")!=-1){
			cat = "a";
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					routeManager.init(e, false, "/z");
				}, false);
			}		

		} else if(window.location.href.indexOf("/z/")!=-1){
			cat = "z";
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					routeManager.init(e, false, "/a");
				}, false);
			}			
		} else {
			console.log("error");
		}

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				routeManager.init(e, false, "/"+cat);
			}, false);
		}		
	};

	return {
		init: init
	};

};

module.exports = new menuController();
},{"../managers/route-manager":6}],4:[function(require,module,exports){
/* Page Controller */
var HomepageController 	= require('./homepage-controller'),
	MenuController 		= require('./menu-controller'),
	GalleryController	= require('./gallery-controller')
;



var PageController = function() {

	var init = function () {
		console.log('PageController');

		if(document.getElementById("primary").className.match(/homepage/)){
			HomepageController.init();
		} else {
			MenuController.init();
		}

		if(document.getElementById("primary").className.match(/single-project/)){
			GalleryController.init();
		}

	};


	return {
		init: init
	};

};

module.exports = new PageController();
},{"./gallery-controller":1,"./homepage-controller":2,"./menu-controller":3}],5:[function(require,module,exports){
/* Main Script of the web */

var PageController = require('./controllers/page-controller')
;


var MainApp = function () {
	console.log("MainApp");
	PageController.init();
};

module.exports = new MainApp();


},{"./controllers/page-controller":4}],6:[function(require,module,exports){
/* Route Manager */
//var pageManager = require('../controllers/page-controller');

var routeManager = function () {

	var init = function (e, isHP, where) {
		
		e.stopPropagation();
		console.log("routeManager init");

		if (history.pushState) {
			
			//no es la solucion ideal - REVISAR	
			if(isHP===true){
				document.getElementsByClassName("container-home")[0].className += " disappear";	
			} else {
				document.getElementById("primary").className += " disappear";	
			}
			history.pushState(where, "", where+"/");
			_requestPage(where+"/");
			
			
		} else {
			//Backup solution for old browsers.
			window.location.href = e.target.id+"/";
		}
	};

	var _requestPage = function requestPage(href){
		if (window.XMLHttpRequest){
			console.log("_requestPage");
			var req = new XMLHttpRequest();
			req.open("GET", href, true);
			req.onload = function(e){
			  if (req.readyState === 4) {
			    if (req.status === 200) {
			    	_loadNewPage(req.responseText);								    
			    } else {			    
			      console.error(req.statusText);			    
			    }
			  }
			};
			req.onerror = function (e) {
			  console.error(req.statusText);
			};
			req.send(null);
		} else {
			window.location.href = href;
		}
	};

	var _loadNewPage = function (data){
		console.log("_loadNewPage");

		var parser = new DOMParser();
		var doc = parser.parseFromString(data, "text/html");
		document.body = doc.body;
		document.title = doc.title;

	};

	return {
		init: init
	};

};

module.exports = new routeManager();
},{}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvZ2FsbGVyeS1jb250cm9sbGVyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzL2hvbWVwYWdlLWNvbnRyb2xsZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvbWVudS1jb250cm9sbGVyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3BhZ2UtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9mYWtlX2IyOWNjMzdkLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L21hbmFnZXJzL3JvdXRlLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogR2FsbGVyeSBDb250cm9sbGVyKi9cblxudmFyIEdhbGxlcnlDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBfcGhvdG9zID0gbnVsbDtcblx0dmFyIF9jdXJyZW50UGhvdG87XG5cdHZhciBfbkludGVydklkO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdHZhciBnYWxsZXJpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FsbGVyeVwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZ2FsbGVyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRfaW5pdEdhbGxlcnkoZ2FsbGVyaWVzW2ldKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIF9pbml0R2FsbGVyeSA9IGZ1bmN0aW9uKGdhbGxlcnkpe1xuXG5cdFx0X3Bob3RvcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJnYWxsZXJ5LWl0ZW1cIik7XG5cblx0XHRfY3VycmVudFBob3RvID0gX3Bob3Rvcy5sZW5ndGgtMTtcblx0XHRfbkludGVydklkID0gc2V0SW50ZXJ2YWwoX2ZhZGVQaG90bywgMzAwMCk7XG5cblx0fTtcblxuXHR2YXIgX2ZhZGVQaG90byA9IGZ1bmN0aW9uKCl7XG5cblx0XHRpZiAoX2N1cnJlbnRQaG90byE9MCl7XG5cdFx0XHRfcGhvdG9zW19jdXJyZW50UGhvdG9dLmNsYXNzTmFtZSA9IF9waG90b3NbX2N1cnJlbnRQaG90b10uY2xhc3NOYW1lICsgXCIgZmFkZS1vdXRcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0LypTVEVGIE1FSk9SQVI6IHNlIHB1ZWRlIG1lam9yYXIgaGFjaWVuZG8gZmFkZS1pbiBwcmltZXJvIGRlIGxhIHByaW1lcmEgZm90byB5IGx1ZWdvIGRlbCByZXN0byAqL1x0XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IF9waG90b3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0X3Bob3Rvc1tpXS5jbGFzc05hbWUgPSBfcGhvdG9zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKFwiIGZhZGUtb3V0XCIsIFwiXCIpO1xuXHRcdFx0fTtcdFx0XHRcblx0XHR9XG5cblx0XHRfY3VycmVudFBob3RvID09IDAgPyBfY3VycmVudFBob3RvID0gX3Bob3Rvcy5sZW5ndGgtMSA6IF9jdXJyZW50UGhvdG8tLTtcblxuXHR9XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgR2FsbGVyeUNvbnRyb2xsZXIoKTsiLCIvKiBIb21lIFBhZ2UgQ29udHJvbGxlciovXG52YXIgUm91dGVNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvcm91dGUtbWFuYWdlcicpXG47XG5cblxuXG52YXIgSG9tZXBhZ2VDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuXG5cdGhvbWVwYWdlVmlldyA9IG51bGw7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coJ0hvbWVwYWdlQ29udHJvbGxlcicpO1xuXHRcdFxuXHRcdHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNxdWFyZVwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFJvdXRlTWFuYWdlci5pbml0KGUsIHRydWUsIGUudGFyZ2V0LmlkKTtcblx0XHRcdH0pOyBcblx0XHR9XHRcblxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEhvbWVwYWdlQ29udHJvbGxlcigpOyIsIi8qIEhvbWUgUGFnZSBDb250cm9sbGVyICovXG52YXIgcm91dGVNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvcm91dGUtbWFuYWdlcicpO1xuXG5cbnZhciBtZW51Q29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnbWVudUNvbnRyb2xsZXInKTtcblx0XG5cdFx0dmFyIG0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVcIiksXG5cdFx0XHRjYXQ7XG5cblx0XHRpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL2EvXCIpIT0tMSl7XG5cdFx0XHRjYXQgPSBcImFcIjtcblx0XHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudVJpZ2h0XCIpIT09IG51bGwpe1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVSaWdodFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0cm91dGVNYW5hZ2VyLmluaXQoZSwgZmFsc2UsIFwiL3pcIik7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdH1cdFx0XG5cblx0XHR9IGVsc2UgaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi96L1wiKSE9LTEpe1xuXHRcdFx0Y2F0ID0gXCJ6XCI7XG5cdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVMZWZ0XCIpIT09IG51bGwpe1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVMZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRyb3V0ZU1hbmFnZXIuaW5pdChlLCBmYWxzZSwgXCIvYVwiKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImVycm9yXCIpO1xuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3Jvc3NNZW51XCIpIT09IG51bGwpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcm9zc01lbnVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRyb3V0ZU1hbmFnZXIuaW5pdChlLCBmYWxzZSwgXCIvXCIrY2F0KTtcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9XHRcdFxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBtZW51Q29udHJvbGxlcigpOyIsIi8qIFBhZ2UgQ29udHJvbGxlciAqL1xudmFyIEhvbWVwYWdlQ29udHJvbGxlciBcdD0gcmVxdWlyZSgnLi9ob21lcGFnZS1jb250cm9sbGVyJyksXG5cdE1lbnVDb250cm9sbGVyIFx0XHQ9IHJlcXVpcmUoJy4vbWVudS1jb250cm9sbGVyJyksXG5cdEdhbGxlcnlDb250cm9sbGVyXHQ9IHJlcXVpcmUoJy4vZ2FsbGVyeS1jb250cm9sbGVyJylcbjtcblxuXG5cbnZhciBQYWdlQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUubG9nKCdQYWdlQ29udHJvbGxlcicpO1xuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvaG9tZXBhZ2UvKSl7XG5cdFx0XHRIb21lcGFnZUNvbnRyb2xsZXIuaW5pdCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRNZW51Q29udHJvbGxlci5pbml0KCk7XG5cdFx0fVxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvc2luZ2xlLXByb2plY3QvKSl7XG5cdFx0XHRHYWxsZXJ5Q29udHJvbGxlci5pbml0KCk7XG5cdFx0fVxuXG5cdH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUGFnZUNvbnRyb2xsZXIoKTsiLCIvKiBNYWluIFNjcmlwdCBvZiB0aGUgd2ViICovXG5cbnZhciBQYWdlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcGFnZS1jb250cm9sbGVyJylcbjtcblxuXG52YXIgTWFpbkFwcCA9IGZ1bmN0aW9uICgpIHtcblx0Y29uc29sZS5sb2coXCJNYWluQXBwXCIpO1xuXHRQYWdlQ29udHJvbGxlci5pbml0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNYWluQXBwKCk7XG5cbiIsIi8qIFJvdXRlIE1hbmFnZXIgKi9cbi8vdmFyIHBhZ2VNYW5hZ2VyID0gcmVxdWlyZSgnLi4vY29udHJvbGxlcnMvcGFnZS1jb250cm9sbGVyJyk7XG5cbnZhciByb3V0ZU1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoZSwgaXNIUCwgd2hlcmUpIHtcblx0XHRcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGNvbnNvbGUubG9nKFwicm91dGVNYW5hZ2VyIGluaXRcIik7XG5cblx0XHRpZiAoaGlzdG9yeS5wdXNoU3RhdGUpIHtcblx0XHRcdFxuXHRcdFx0Ly9ubyBlcyBsYSBzb2x1Y2lvbiBpZGVhbCAtIFJFVklTQVJcdFxuXHRcdFx0aWYoaXNIUD09PXRydWUpe1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGFpbmVyLWhvbWVcIilbMF0uY2xhc3NOYW1lICs9IFwiIGRpc2FwcGVhclwiO1x0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lICs9IFwiIGRpc2FwcGVhclwiO1x0XG5cdFx0XHR9XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSh3aGVyZSwgXCJcIiwgd2hlcmUrXCIvXCIpO1xuXHRcdFx0X3JlcXVlc3RQYWdlKHdoZXJlK1wiL1wiKTtcblx0XHRcdFxuXHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vQmFja3VwIHNvbHV0aW9uIGZvciBvbGQgYnJvd3NlcnMuXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGUudGFyZ2V0LmlkK1wiL1wiO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgX3JlcXVlc3RQYWdlID0gZnVuY3Rpb24gcmVxdWVzdFBhZ2UoaHJlZil7XG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIl9yZXF1ZXN0UGFnZVwiKTtcblx0XHRcdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHJlcS5vcGVuKFwiR0VUXCIsIGhyZWYsIHRydWUpO1xuXHRcdFx0cmVxLm9ubG9hZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdCAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHQgICAgXHRfbG9hZE5ld1BhZ2UocmVxLnJlc3BvbnNlVGV4dCk7XHRcdFx0XHRcdFx0XHRcdCAgICBcblx0XHRcdCAgICB9IGVsc2Uge1x0XHRcdCAgICBcblx0XHRcdCAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1c1RleHQpO1x0XHRcdCAgICBcblx0XHRcdCAgICB9XG5cdFx0XHQgIH1cblx0XHRcdH07XG5cdFx0XHRyZXEub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHQgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1c1RleHQpO1xuXHRcdFx0fTtcblx0XHRcdHJlcS5zZW5kKG51bGwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGhyZWY7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBfbG9hZE5ld1BhZ2UgPSBmdW5jdGlvbiAoZGF0YSl7XG5cdFx0Y29uc29sZS5sb2coXCJfbG9hZE5ld1BhZ2VcIik7XG5cblx0XHR2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRcdHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGRhdGEsIFwidGV4dC9odG1sXCIpO1xuXHRcdGRvY3VtZW50LmJvZHkgPSBkb2MuYm9keTtcblx0XHRkb2N1bWVudC50aXRsZSA9IGRvYy50aXRsZTtcblxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyByb3V0ZU1hbmFnZXIoKTsiXX0=
