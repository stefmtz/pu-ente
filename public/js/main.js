(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* 
	Menu Controller
	-------------- 
	Gives behavior to Menu elements
*/
var pageModel 	= require('../models/page-model'),
	projectView	= require('../views/project-view')
;


var MenuController = function () {

	var init = function () {
		console.log('MenuController');
	
		var m = document.getElementById("menu"),
			cat;

		if(window.location.href.indexOf("/a/")!=-1){
			cat = "a";
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					projectView.clearTheInterval();
					pageModel.initNewPage("/z");
				}, false);
			}		

		} else if(window.location.href.indexOf("/z/")!=-1){
			cat = "z";
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					pageModel.initNewPage("/a");
				}, false);
			}			
		} else {
			console.log("error");
		}

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				console.log(projectView);

				projectView.clearTheInterval();
				pageModel.initNewPage("/"+cat);
			}, false);
		}		
	};

	return {
		init: init
	};

};

module.exports = new MenuController();
},{"../models/page-model":6,"../views/project-view":9}],2:[function(require,module,exports){
/* 
	Page Controller
	-------------- 
	Decides which pages and/or components should be rendered
*/
var HomepageView 		= require('../views/homepage-view'),
	MenuController 		= require('./menu-controller'),
	ProjectView			= require('../views/project-view'),
	PageModel			= require('../models/page-model'),
	GalleryView			= require('../views/gallery-view')
;

var PageController = function() {

	var init = function () {
		console.log('PageController');

		_fadeInContent();

		emitter.on("loadNewPage", function(data){
			_loadNewPage(data);
		});

		emitter.on("requestNewPage", function(href){
			//fade out current content
			_fadeOutContent();
			//request new page
			_requestNewPage(href);
		});

		emitter.on("homeRequestNewPage", function(e){
			//fade out current content
			HomepageView.fadeOut();
			//request new page
			_requestNewPage(e.target.id);
			
		});

		_setViews();
	};

	var _requestNewPage = function(href){
		setTimeout(function(){
			PageModel.initNewPage(href);
		}, 1000);
	}

	var _setViews = function(){

		if(document.getElementById("primary").className.match(/homepage/)){
			HomepageView.init();			
		} else {
			// Initialize Menu when is not the homepage.
			MenuController.init();
		}

		if(document.getElementById("primary").className.match(/single-project/)){
			ProjectView.init();			
		}

		if(document.getElementById("primary").className.match(/page-gallery/)){
			GalleryView.init();		
		}
	};

	var _fadeOutContent = function(){
		setTimeout(function(){
			document.getElementById("primary").className += " fade-out";	
		}, 500);

	};

	var _fadeInContent = function(){
		setTimeout(function(){
			document.getElementById("content").className = document.getElementById("content").className.replace("fade-out", 'fade-in');
		}, 500);
	};

	var _loadNewPage = function (data){
		console.log("_loadNewPage");

		var parser = new DOMParser();
		var doc = parser.parseFromString(data, "text/html");
		
		document.title = doc.title;

		document.body.className = doc.body.className;
		
		document.body.innerHTML = doc.body.innerHTML;
		_fadeInContent();

		_setViews();

	};


	return {
		init: init
	};

};

module.exports = new PageController;
},{"../models/page-model":6,"../views/gallery-view":7,"../views/homepage-view":8,"../views/project-view":9,"./menu-controller":1}],3:[function(require,module,exports){
/* 
	Scroll Controller
	-------------- 
	Given an element, checks if it is inside the view of the user
*/
var ScrollController = function() {

	var element;

	var init = function (ele) {

		element = document.getElementById(ele);
		onScrolling();
		window.addEventListener("scroll", onScrolling);

	};

	var onScrolling = function(){

		if (isScrolledIntoView()){
    		window.removeEventListener("scroll", onScrolling);
    		showElement(element);
    	}		
	};


	var isScrolledIntoView = function(){

		var elementTop    = element.getBoundingClientRect().top,
        elementBottom = element.getBoundingClientRect().bottom;
        
        // controlo que al menos se vean 100px del elemento
		return elementTop >= 0 && (elementTop + 100) <= window.innerHeight;

	};

	// STEF: esto tendría que estar en la vista
	var showElement = function(){

		element.className = element.className + " appear"; 
		
	};


	return {
		init: init
	};

};

module.exports = new ScrollController();
},{}],4:[function(require,module,exports){
/* 
	Main
	-------------- 
	Main script of the App - initial file
*/
var PageController 	= require('./controllers/page-controller'),
	Emitter			= require('./managers/emitter')
;


var MainApp = function () {
	console.log("MainApp");
	emitter = new Emitter();
	PageController.init();
};

MainApp();
},{"./controllers/page-controller":2,"./managers/emitter":5}],5:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],6:[function(require,module,exports){
/* Route Manager - Page Model */

var PageModel = function () {

	var initNewPage = function (newPage) {
		console.log("PageModel init");

		if (history.pushState) {			
			_requestPage(newPage+"/");			
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
			    	history.pushState(href, "", href);
					emitter.emit("loadNewPage", req.responseText)								    
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

	return {
		initNewPage: initNewPage
	};

};

module.exports = new PageModel();


},{}],7:[function(require,module,exports){
/* 
	Gallery View
	-------------- 
	Renders View of projects List (A-Z galleries)
*/

var GalleryView = function () {

	
	var init = function () {
		
		var p = document.getElementsByClassName("project");

		for (var i = 0; i < p.length; i++) {
			p[i].addEventListener("click", function(e){
				e.stopPropagation();
				emitter.emit("requestNewPage", e.target.parentNode.getAttribute("data-href"));
			}); 
		}
				
	};


	return {
		init: init
	};
};

module.exports = new GalleryView();
},{}],8:[function(require,module,exports){
/* 
	Home Page View
	-------------- 
	Renders Home Page View
*/
var HomepageView = function () {
	
	var init = function (){

		console.log('HomepageView init');

		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", function(e){
				e.stopPropagation();
				emitter.emit("homeRequestNewPage", e);
			}); 
		}
	};

	var fadeOut = function(){
		document.getElementsByClassName("container-home")[0].className += " fade-out-home";
	};

	return {
		init: init,
		fadeOut: fadeOut		
	};
	
};

module.exports = new HomepageView;
},{}],9:[function(require,module,exports){
/* 
	Project View
	-------------- 
	Renders View of projects (initializes galleries)
*/
var	ScrollController = require('../controllers/scroll-controller');

var ProjectView = function () {

	var _photos = null;
	var _currentPhoto;
	var _nIntervId;

	var init = function () {
		
		ScrollController.init("related-posts");

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

	var clearTheInterval = function(){
		clearInterval(_nIntervId);
	}


	return {
		init: init,
		clearTheInterval : clearTheInterval
	};
};

module.exports = new ProjectView();
},{"../controllers/scroll-controller":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvbWVudS1jb250cm9sbGVyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3BhZ2UtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9mYWtlXzYyYjk4OWU4LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L21hbmFnZXJzL2VtaXR0ZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvbW9kZWxzL3BhZ2UtbW9kZWwuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvZ2FsbGVyeS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL2hvbWVwYWdlLXZpZXcuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvcHJvamVjdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuXHRNZW51IENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdEdpdmVzIGJlaGF2aW9yIHRvIE1lbnUgZWxlbWVudHNcbiovXG52YXIgcGFnZU1vZGVsIFx0PSByZXF1aXJlKCcuLi9tb2RlbHMvcGFnZS1tb2RlbCcpLFxuXHRwcm9qZWN0Vmlld1x0PSByZXF1aXJlKCcuLi92aWV3cy9wcm9qZWN0LXZpZXcnKVxuO1xuXG5cbnZhciBNZW51Q29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnTWVudUNvbnRyb2xsZXInKTtcblx0XG5cdFx0dmFyIG0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVcIiksXG5cdFx0XHRjYXQ7XG5cblx0XHRpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL2EvXCIpIT0tMSl7XG5cdFx0XHRjYXQgPSBcImFcIjtcblx0XHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudVJpZ2h0XCIpIT09IG51bGwpe1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVSaWdodFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0cHJvamVjdFZpZXcuY2xlYXJUaGVJbnRlcnZhbCgpO1xuXHRcdFx0XHRcdHBhZ2VNb2RlbC5pbml0TmV3UGFnZShcIi96XCIpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHR9XHRcdFxuXG5cdFx0fSBlbHNlIGlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCIvei9cIikhPS0xKXtcblx0XHRcdGNhdCA9IFwielwiO1xuXHRcdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51TGVmdFwiKSE9PSBudWxsKXtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51TGVmdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0cHJvamVjdFZpZXcuY2xlYXJUaGVJbnRlcnZhbCgpO1xuXHRcdFx0XHRcdHBhZ2VNb2RlbC5pbml0TmV3UGFnZShcIi9hXCIpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHR9XHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XG5cdFx0fVxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcm9zc01lbnVcIikhPT0gbnVsbCl7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyb3NzTWVudVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHByb2plY3RWaWV3KTtcblxuXHRcdFx0XHRwcm9qZWN0Vmlldy5jbGVhclRoZUludGVydmFsKCk7XG5cdFx0XHRcdHBhZ2VNb2RlbC5pbml0TmV3UGFnZShcIi9cIitjYXQpO1xuXHRcdFx0fSwgZmFsc2UpO1xuXHRcdH1cdFx0XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IE1lbnVDb250cm9sbGVyKCk7IiwiLyogXG5cdFBhZ2UgQ29udHJvbGxlclxuXHQtLS0tLS0tLS0tLS0tLSBcblx0RGVjaWRlcyB3aGljaCBwYWdlcyBhbmQvb3IgY29tcG9uZW50cyBzaG91bGQgYmUgcmVuZGVyZWRcbiovXG52YXIgSG9tZXBhZ2VWaWV3IFx0XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL2hvbWVwYWdlLXZpZXcnKSxcblx0TWVudUNvbnRyb2xsZXIgXHRcdD0gcmVxdWlyZSgnLi9tZW51LWNvbnRyb2xsZXInKSxcblx0UHJvamVjdFZpZXdcdFx0XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL3Byb2plY3QtdmlldycpLFxuXHRQYWdlTW9kZWxcdFx0XHQ9IHJlcXVpcmUoJy4uL21vZGVscy9wYWdlLW1vZGVsJyksXG5cdEdhbGxlcnlWaWV3XHRcdFx0PSByZXF1aXJlKCcuLi92aWV3cy9nYWxsZXJ5LXZpZXcnKVxuO1xuXG52YXIgUGFnZUNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnUGFnZUNvbnRyb2xsZXInKTtcblxuXHRcdF9mYWRlSW5Db250ZW50KCk7XG5cblx0XHRlbWl0dGVyLm9uKFwibG9hZE5ld1BhZ2VcIiwgZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRfbG9hZE5ld1BhZ2UoZGF0YSk7XG5cdFx0fSk7XG5cblx0XHRlbWl0dGVyLm9uKFwicmVxdWVzdE5ld1BhZ2VcIiwgZnVuY3Rpb24oaHJlZil7XG5cdFx0XHQvL2ZhZGUgb3V0IGN1cnJlbnQgY29udGVudFxuXHRcdFx0X2ZhZGVPdXRDb250ZW50KCk7XG5cdFx0XHQvL3JlcXVlc3QgbmV3IHBhZ2Vcblx0XHRcdF9yZXF1ZXN0TmV3UGFnZShocmVmKTtcblx0XHR9KTtcblxuXHRcdGVtaXR0ZXIub24oXCJob21lUmVxdWVzdE5ld1BhZ2VcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHQvL2ZhZGUgb3V0IGN1cnJlbnQgY29udGVudFxuXHRcdFx0SG9tZXBhZ2VWaWV3LmZhZGVPdXQoKTtcblx0XHRcdC8vcmVxdWVzdCBuZXcgcGFnZVxuXHRcdFx0X3JlcXVlc3ROZXdQYWdlKGUudGFyZ2V0LmlkKTtcblx0XHRcdFxuXHRcdH0pO1xuXG5cdFx0X3NldFZpZXdzKCk7XG5cdH07XG5cblx0dmFyIF9yZXF1ZXN0TmV3UGFnZSA9IGZ1bmN0aW9uKGhyZWYpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFBhZ2VNb2RlbC5pbml0TmV3UGFnZShocmVmKTtcblx0XHR9LCAxMDAwKTtcblx0fVxuXG5cdHZhciBfc2V0Vmlld3MgPSBmdW5jdGlvbigpe1xuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvaG9tZXBhZ2UvKSl7XG5cdFx0XHRIb21lcGFnZVZpZXcuaW5pdCgpO1x0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBJbml0aWFsaXplIE1lbnUgd2hlbiBpcyBub3QgdGhlIGhvbWVwYWdlLlxuXHRcdFx0TWVudUNvbnRyb2xsZXIuaW5pdCgpO1xuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUubWF0Y2goL3NpbmdsZS1wcm9qZWN0Lykpe1xuXHRcdFx0UHJvamVjdFZpZXcuaW5pdCgpO1x0XHRcdFxuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUubWF0Y2goL3BhZ2UtZ2FsbGVyeS8pKXtcblx0XHRcdEdhbGxlcnlWaWV3LmluaXQoKTtcdFx0XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBfZmFkZU91dENvbnRlbnQgPSBmdW5jdGlvbigpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUgKz0gXCIgZmFkZS1vdXRcIjtcdFxuXHRcdH0sIDUwMCk7XG5cblx0fTtcblxuXHR2YXIgX2ZhZGVJbkNvbnRlbnQgPSBmdW5jdGlvbigpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKS5jbGFzc05hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIikuY2xhc3NOYW1lLnJlcGxhY2UoXCJmYWRlLW91dFwiLCAnZmFkZS1pbicpO1xuXHRcdH0sIDUwMCk7XG5cdH07XG5cblx0dmFyIF9sb2FkTmV3UGFnZSA9IGZ1bmN0aW9uIChkYXRhKXtcblx0XHRjb25zb2xlLmxvZyhcIl9sb2FkTmV3UGFnZVwiKTtcblxuXHRcdHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cdFx0dmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoZGF0YSwgXCJ0ZXh0L2h0bWxcIik7XG5cdFx0XG5cdFx0ZG9jdW1lbnQudGl0bGUgPSBkb2MudGl0bGU7XG5cblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvYy5ib2R5LmNsYXNzTmFtZTtcblx0XHRcblx0XHRkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IGRvYy5ib2R5LmlubmVySFRNTDtcblx0XHRfZmFkZUluQ29udGVudCgpO1xuXG5cdFx0X3NldFZpZXdzKCk7XG5cblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQYWdlQ29udHJvbGxlcjsiLCIvKiBcblx0U2Nyb2xsIENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdEdpdmVuIGFuIGVsZW1lbnQsIGNoZWNrcyBpZiBpdCBpcyBpbnNpZGUgdGhlIHZpZXcgb2YgdGhlIHVzZXJcbiovXG52YXIgU2Nyb2xsQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciBlbGVtZW50O1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKGVsZSkge1xuXG5cdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZSk7XG5cdFx0b25TY3JvbGxpbmcoKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbGluZyk7XG5cblx0fTtcblxuXHR2YXIgb25TY3JvbGxpbmcgPSBmdW5jdGlvbigpe1xuXG5cdFx0aWYgKGlzU2Nyb2xsZWRJbnRvVmlldygpKXtcbiAgICBcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgb25TY3JvbGxpbmcpO1xuICAgIFx0XHRzaG93RWxlbWVudChlbGVtZW50KTtcbiAgICBcdH1cdFx0XG5cdH07XG5cblxuXHR2YXIgaXNTY3JvbGxlZEludG9WaWV3ID0gZnVuY3Rpb24oKXtcblxuXHRcdHZhciBlbGVtZW50VG9wICAgID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AsXG4gICAgICAgIGVsZW1lbnRCb3R0b20gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnRyb2xvIHF1ZSBhbCBtZW5vcyBzZSB2ZWFuIDEwMHB4IGRlbCBlbGVtZW50b1xuXHRcdHJldHVybiBlbGVtZW50VG9wID49IDAgJiYgKGVsZW1lbnRUb3AgKyAxMDApIDw9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHR9O1xuXG5cdC8vIFNURUY6IGVzdG8gdGVuZHLDrWEgcXVlIGVzdGFyIGVuIGxhIHZpc3RhXG5cdHZhciBzaG93RWxlbWVudCA9IGZ1bmN0aW9uKCl7XG5cblx0XHRlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lICsgXCIgYXBwZWFyXCI7IFxuXHRcdFxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNjcm9sbENvbnRyb2xsZXIoKTsiLCIvKiBcblx0TWFpblxuXHQtLS0tLS0tLS0tLS0tLSBcblx0TWFpbiBzY3JpcHQgb2YgdGhlIEFwcCAtIGluaXRpYWwgZmlsZVxuKi9cbnZhciBQYWdlQ29udHJvbGxlciBcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wYWdlLWNvbnRyb2xsZXInKSxcblx0RW1pdHRlclx0XHRcdD0gcmVxdWlyZSgnLi9tYW5hZ2Vycy9lbWl0dGVyJylcbjtcblxuXG52YXIgTWFpbkFwcCA9IGZ1bmN0aW9uICgpIHtcblx0Y29uc29sZS5sb2coXCJNYWluQXBwXCIpO1xuXHRlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblx0UGFnZUNvbnRyb2xsZXIuaW5pdCgpO1xufTtcblxuTWFpbkFwcCgpOyIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHRoaXMub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIi8qIFJvdXRlIE1hbmFnZXIgLSBQYWdlIE1vZGVsICovXG5cbnZhciBQYWdlTW9kZWwgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIGluaXROZXdQYWdlID0gZnVuY3Rpb24gKG5ld1BhZ2UpIHtcblx0XHRjb25zb2xlLmxvZyhcIlBhZ2VNb2RlbCBpbml0XCIpO1xuXG5cdFx0aWYgKGhpc3RvcnkucHVzaFN0YXRlKSB7XHRcdFx0XG5cdFx0XHRfcmVxdWVzdFBhZ2UobmV3UGFnZStcIi9cIik7XHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vQmFja3VwIHNvbHV0aW9uIGZvciBvbGQgYnJvd3NlcnMuXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGUudGFyZ2V0LmlkK1wiL1wiO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgX3JlcXVlc3RQYWdlID0gZnVuY3Rpb24gcmVxdWVzdFBhZ2UoaHJlZil7XG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIl9yZXF1ZXN0UGFnZVwiKTtcblx0XHRcdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHJlcS5vcGVuKFwiR0VUXCIsIGhyZWYsIHRydWUpO1xuXHRcdFx0cmVxLm9ubG9hZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdCAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHQgICAgXHRoaXN0b3J5LnB1c2hTdGF0ZShocmVmLCBcIlwiLCBocmVmKTtcblx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJsb2FkTmV3UGFnZVwiLCByZXEucmVzcG9uc2VUZXh0KVx0XHRcdFx0XHRcdFx0XHQgICAgXG5cdFx0XHQgICAgfSBlbHNlIHtcdFx0XHQgICAgXG5cdFx0XHQgICAgICBjb25zb2xlLmVycm9yKHJlcS5zdGF0dXNUZXh0KTtcdFx0XHQgICAgXG5cdFx0XHQgICAgfVxuXHRcdFx0ICB9XG5cdFx0XHR9O1xuXHRcdFx0cmVxLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0ICBjb25zb2xlLmVycm9yKHJlcS5zdGF0dXNUZXh0KTtcblx0XHRcdH07XG5cdFx0XHRyZXEuc2VuZChudWxsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBocmVmO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXROZXdQYWdlOiBpbml0TmV3UGFnZVxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQYWdlTW9kZWwoKTtcblxuIiwiLyogXG5cdEdhbGxlcnkgVmlld1xuXHQtLS0tLS0tLS0tLS0tLSBcblx0UmVuZGVycyBWaWV3IG9mIHByb2plY3RzIExpc3QgKEEtWiBnYWxsZXJpZXMpXG4qL1xuXG52YXIgR2FsbGVyeVZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cblx0XG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInByb2plY3RcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBlLnRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSk7XG5cdFx0XHR9KTsgXG5cdFx0fVxuXHRcdFx0XHRcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgR2FsbGVyeVZpZXcoKTsiLCIvKiBcblx0SG9tZSBQYWdlIFZpZXdcblx0LS0tLS0tLS0tLS0tLS0gXG5cdFJlbmRlcnMgSG9tZSBQYWdlIFZpZXdcbiovXG52YXIgSG9tZXBhZ2VWaWV3ID0gZnVuY3Rpb24gKCkge1xuXHRcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKXtcblxuXHRcdGNvbnNvbGUubG9nKCdIb21lcGFnZVZpZXcgaW5pdCcpO1xuXG5cdFx0dmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3F1YXJlXCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwiaG9tZVJlcXVlc3ROZXdQYWdlXCIsIGUpO1xuXHRcdFx0fSk7IFxuXHRcdH1cblx0fTtcblxuXHR2YXIgZmFkZU91dCA9IGZ1bmN0aW9uKCl7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRhaW5lci1ob21lXCIpWzBdLmNsYXNzTmFtZSArPSBcIiBmYWRlLW91dC1ob21lXCI7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdGZhZGVPdXQ6IGZhZGVPdXRcdFx0XG5cdH07XG5cdFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgSG9tZXBhZ2VWaWV3OyIsIi8qIFxuXHRQcm9qZWN0IFZpZXdcblx0LS0tLS0tLS0tLS0tLS0gXG5cdFJlbmRlcnMgVmlldyBvZiBwcm9qZWN0cyAoaW5pdGlhbGl6ZXMgZ2FsbGVyaWVzKVxuKi9cbnZhclx0U2Nyb2xsQ29udHJvbGxlciA9IHJlcXVpcmUoJy4uL2NvbnRyb2xsZXJzL3Njcm9sbC1jb250cm9sbGVyJyk7XG5cbnZhciBQcm9qZWN0VmlldyA9IGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgX3Bob3RvcyA9IG51bGw7XG5cdHZhciBfY3VycmVudFBob3RvO1xuXHR2YXIgX25JbnRlcnZJZDtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcblx0XHRTY3JvbGxDb250cm9sbGVyLmluaXQoXCJyZWxhdGVkLXBvc3RzXCIpO1xuXG5cdFx0dmFyIGdhbGxlcmllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJnYWxsZXJ5XCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBnYWxsZXJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdF9pbml0R2FsbGVyeShnYWxsZXJpZXNbaV0pO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgX2luaXRHYWxsZXJ5ID0gZnVuY3Rpb24oZ2FsbGVyeSl7XG5cblx0XHRfcGhvdG9zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbGxlcnktaXRlbVwiKTtcblxuXHRcdF9jdXJyZW50UGhvdG8gPSBfcGhvdG9zLmxlbmd0aC0xO1xuXHRcdF9uSW50ZXJ2SWQgPSBzZXRJbnRlcnZhbChfZmFkZVBob3RvLCAzMDAwKTtcblxuXHR9O1xuXG5cdHZhciBfZmFkZVBob3RvID0gZnVuY3Rpb24oKXtcblxuXHRcdGlmIChfY3VycmVudFBob3RvIT0wKXtcblx0XHRcdF9waG90b3NbX2N1cnJlbnRQaG90b10uY2xhc3NOYW1lID0gX3Bob3Rvc1tfY3VycmVudFBob3RvXS5jbGFzc05hbWUgKyBcIiBmYWRlLW91dFwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvKlNURUYgTUVKT1JBUjogc2UgcHVlZGUgbWVqb3JhciBoYWNpZW5kbyBmYWRlLWluIHByaW1lcm8gZGUgbGEgcHJpbWVyYSBmb3RvIHkgbHVlZ28gZGVsIHJlc3RvICovXHRcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgX3Bob3Rvcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRfcGhvdG9zW2ldLmNsYXNzTmFtZSA9IF9waG90b3NbaV0uY2xhc3NOYW1lLnJlcGxhY2UoXCIgZmFkZS1vdXRcIiwgXCJcIik7XG5cdFx0XHR9O1x0XHRcdFxuXHRcdH1cblxuXHRcdF9jdXJyZW50UGhvdG8gPT0gMCA/IF9jdXJyZW50UGhvdG8gPSBfcGhvdG9zLmxlbmd0aC0xIDogX2N1cnJlbnRQaG90by0tO1xuXG5cdH1cblxuXHR2YXIgY2xlYXJUaGVJbnRlcnZhbCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y2xlYXJJbnRlcnZhbChfbkludGVydklkKTtcblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdGNsZWFyVGhlSW50ZXJ2YWwgOiBjbGVhclRoZUludGVydmFsXG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQcm9qZWN0VmlldygpOyJdfQ==
