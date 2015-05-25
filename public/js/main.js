(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Home Page Controller*/
var routeManager = require('../managers/route-manager')


var homepageController = function () {

	var init = function () {
		console.log('homepageController');
	
		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", function(e){
				routeManager.init(e, true, e.target.id);
			}); 
		}	
	};


	return {
		init: init
	};

};

module.exports = new homepageController();
},{"../managers/route-manager":5}],2:[function(require,module,exports){
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
},{"../managers/route-manager":5}],3:[function(require,module,exports){
/* Main Script of the web */

var pageManager = require('./managers/page-manager');


var mainApp = function () {
	console.log("mainApp");
	//console.log(pageManager);
	pageManager.init();

};

module.exports = new mainApp();


},{"./managers/page-manager":4}],4:[function(require,module,exports){
/* Page Manager*/
var homepageController 	= require('../controllers/homepage-controller')
	menuController 	= require('../controllers/menu-controller');



var pageManager = function() {

	var init = function () {
		console.log('pageManager');

		if(document.getElementById("primary").className.match(/homepage/)){
			homepageController.init();
		} else {
			menuController.init();
		}				
	};


	return {
		init: init
	};

};

module.exports = new pageManager();
},{"../controllers/homepage-controller":1,"../controllers/menu-controller":2}],5:[function(require,module,exports){
/* Route Manager */
var pageManager = require('./page-manager');

var routeManager = function () {

	var init = function () {
		console.log("routeManager init");
		console.log(pageManager);

	};

	return {
		init: init
	};

};

/*var routeManager = pageManager.extend({

	var init = function () {
		console.log("routeManager init");
		console.log(pageManager);

		var test = new pageManager();

		console.log(test);
		
	};


	return {
		init: init
	};

});*/


module.exports = new routeManager();




/*var routeManager = (function () {

	var init = function () {

		console.log(pageManager);

	};

	var init = function (e, isHP, where) {
		
		e.stopPropagation();
		console.log("routeManager init");

		console.log(pageManager);
		
		if (history.pushState) {
			
			//no es la solucion ideal - REVISAR	
			if(isHP===true){
				document.getElementsByClassName("container-home")[0].className += " disappear";	
			} else {
				document.getElementById("primary").className += " disappear";	
			}
			history.pushState(where, "", where+"/");
			//_requestPage(where+"/");
			
			
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

})();*/

//module.exports = routeManager;
},{"./page-manager":4}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvaG9tZXBhZ2UtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9jb250cm9sbGVycy9tZW51LWNvbnRyb2xsZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvZmFrZV82OTBiOGNhYi5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9tYW5hZ2Vycy9wYWdlLW1hbmFnZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvbWFuYWdlcnMvcm91dGUtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIEhvbWUgUGFnZSBDb250cm9sbGVyKi9cbnZhciByb3V0ZU1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9yb3V0ZS1tYW5hZ2VyJylcblxuXG52YXIgaG9tZXBhZ2VDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUubG9nKCdob21lcGFnZUNvbnRyb2xsZXInKTtcblx0XG5cdFx0dmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3F1YXJlXCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0cm91dGVNYW5hZ2VyLmluaXQoZSwgdHJ1ZSwgZS50YXJnZXQuaWQpO1xuXHRcdFx0fSk7IFxuXHRcdH1cdFxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IGhvbWVwYWdlQ29udHJvbGxlcigpOyIsIi8qIEhvbWUgUGFnZSBDb250cm9sbGVyICovXG52YXIgcm91dGVNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvcm91dGUtbWFuYWdlcicpO1xuXG5cbnZhciBtZW51Q29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnbWVudUNvbnRyb2xsZXInKTtcblx0XG5cdFx0dmFyIG0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVcIiksXG5cdFx0XHRjYXQ7XG5cblx0XHRpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL2EvXCIpIT0tMSl7XG5cdFx0XHRjYXQgPSBcImFcIjtcblx0XHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudVJpZ2h0XCIpIT09IG51bGwpe1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVSaWdodFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0cm91dGVNYW5hZ2VyLmluaXQoZSwgZmFsc2UsIFwiL3pcIik7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdH1cdFx0XG5cblx0XHR9IGVsc2UgaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi96L1wiKSE9LTEpe1xuXHRcdFx0Y2F0ID0gXCJ6XCI7XG5cdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVMZWZ0XCIpIT09IG51bGwpe1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVMZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRyb3V0ZU1hbmFnZXIuaW5pdChlLCBmYWxzZSwgXCIvYVwiKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImVycm9yXCIpO1xuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3Jvc3NNZW51XCIpIT09IG51bGwpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcm9zc01lbnVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRyb3V0ZU1hbmFnZXIuaW5pdChlLCBmYWxzZSwgXCIvXCIrY2F0KTtcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9XHRcdFxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBtZW51Q29udHJvbGxlcigpOyIsIi8qIE1haW4gU2NyaXB0IG9mIHRoZSB3ZWIgKi9cblxudmFyIHBhZ2VNYW5hZ2VyID0gcmVxdWlyZSgnLi9tYW5hZ2Vycy9wYWdlLW1hbmFnZXInKTtcblxuXG52YXIgbWFpbkFwcCA9IGZ1bmN0aW9uICgpIHtcblx0Y29uc29sZS5sb2coXCJtYWluQXBwXCIpO1xuXHQvL2NvbnNvbGUubG9nKHBhZ2VNYW5hZ2VyKTtcblx0cGFnZU1hbmFnZXIuaW5pdCgpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBtYWluQXBwKCk7XG5cbiIsIi8qIFBhZ2UgTWFuYWdlciovXG52YXIgaG9tZXBhZ2VDb250cm9sbGVyIFx0PSByZXF1aXJlKCcuLi9jb250cm9sbGVycy9ob21lcGFnZS1jb250cm9sbGVyJylcblx0bWVudUNvbnRyb2xsZXIgXHQ9IHJlcXVpcmUoJy4uL2NvbnRyb2xsZXJzL21lbnUtY29udHJvbGxlcicpO1xuXG5cblxudmFyIHBhZ2VNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coJ3BhZ2VNYW5hZ2VyJyk7XG5cblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lLm1hdGNoKC9ob21lcGFnZS8pKXtcblx0XHRcdGhvbWVwYWdlQ29udHJvbGxlci5pbml0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1lbnVDb250cm9sbGVyLmluaXQoKTtcblx0XHR9XHRcdFx0XHRcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBwYWdlTWFuYWdlcigpOyIsIi8qIFJvdXRlIE1hbmFnZXIgKi9cbnZhciBwYWdlTWFuYWdlciA9IHJlcXVpcmUoJy4vcGFnZS1tYW5hZ2VyJyk7XG5cbnZhciByb3V0ZU1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coXCJyb3V0ZU1hbmFnZXIgaW5pdFwiKTtcblx0XHRjb25zb2xlLmxvZyhwYWdlTWFuYWdlcik7XG5cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcblxufTtcblxuLyp2YXIgcm91dGVNYW5hZ2VyID0gcGFnZU1hbmFnZXIuZXh0ZW5kKHtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZyhcInJvdXRlTWFuYWdlciBpbml0XCIpO1xuXHRcdGNvbnNvbGUubG9nKHBhZ2VNYW5hZ2VyKTtcblxuXHRcdHZhciB0ZXN0ID0gbmV3IHBhZ2VNYW5hZ2VyKCk7XG5cblx0XHRjb25zb2xlLmxvZyh0ZXN0KTtcblx0XHRcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59KTsqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IHJvdXRlTWFuYWdlcigpO1xuXG5cblxuXG4vKnZhciByb3V0ZU1hbmFnZXIgPSAoZnVuY3Rpb24gKCkge1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Y29uc29sZS5sb2cocGFnZU1hbmFnZXIpO1xuXG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoZSwgaXNIUCwgd2hlcmUpIHtcblx0XHRcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGNvbnNvbGUubG9nKFwicm91dGVNYW5hZ2VyIGluaXRcIik7XG5cblx0XHRjb25zb2xlLmxvZyhwYWdlTWFuYWdlcik7XG5cdFx0XG5cdFx0aWYgKGhpc3RvcnkucHVzaFN0YXRlKSB7XG5cdFx0XHRcblx0XHRcdC8vbm8gZXMgbGEgc29sdWNpb24gaWRlYWwgLSBSRVZJU0FSXHRcblx0XHRcdGlmKGlzSFA9PT10cnVlKXtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRhaW5lci1ob21lXCIpWzBdLmNsYXNzTmFtZSArPSBcIiBkaXNhcHBlYXJcIjtcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZSArPSBcIiBkaXNhcHBlYXJcIjtcdFxuXHRcdFx0fVxuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUod2hlcmUsIFwiXCIsIHdoZXJlK1wiL1wiKTtcblx0XHRcdC8vX3JlcXVlc3RQYWdlKHdoZXJlK1wiL1wiKTtcblx0XHRcdFxuXHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vQmFja3VwIHNvbHV0aW9uIGZvciBvbGQgYnJvd3NlcnMuXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGUudGFyZ2V0LmlkK1wiL1wiO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgX3JlcXVlc3RQYWdlID0gZnVuY3Rpb24gcmVxdWVzdFBhZ2UoaHJlZil7XG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIl9yZXF1ZXN0UGFnZVwiKTtcblx0XHRcdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHJlcS5vcGVuKFwiR0VUXCIsIGhyZWYsIHRydWUpO1xuXHRcdFx0cmVxLm9ubG9hZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdCAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHQgICAgXHRfbG9hZE5ld1BhZ2UocmVxLnJlc3BvbnNlVGV4dCk7XHRcdFx0XHRcdFx0XHRcdCAgICBcblx0XHRcdCAgICB9IGVsc2Uge1x0XHRcdCAgICBcblx0XHRcdCAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1c1RleHQpO1x0XHRcdCAgICBcblx0XHRcdCAgICB9XG5cdFx0XHQgIH1cblx0XHRcdH07XG5cdFx0XHRyZXEub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHQgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1c1RleHQpO1xuXHRcdFx0fTtcblx0XHRcdHJlcS5zZW5kKG51bGwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGhyZWY7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBfbG9hZE5ld1BhZ2UgPSBmdW5jdGlvbiAoZGF0YSl7XG5cdFx0Y29uc29sZS5sb2coXCJfbG9hZE5ld1BhZ2VcIik7XG5cblx0XHR2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRcdHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGRhdGEsIFwidGV4dC9odG1sXCIpO1xuXHRcdGRvY3VtZW50LmJvZHkgPSBkb2MuYm9keTtcblx0XHRkb2N1bWVudC50aXRsZSA9IGRvYy50aXRsZTtcblxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59KSgpOyovXG5cbi8vbW9kdWxlLmV4cG9ydHMgPSByb3V0ZU1hbmFnZXI7Il19
