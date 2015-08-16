(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* 
	Menu Controller
	-------------- 
	Gives behavior to Menu elements
*/
var projectView	= require('../views/project-view')
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
					emitter.emit("requestNewPage", "/z/");
				}, false);
			}		

		} else if(window.location.href.indexOf("/z/")!=-1){
			cat = "z";
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", "/a/");
				}, false);
			}			
		} else {
			console.log("error");
		}

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				projectView.clearTheInterval();
				emitter.emit("requestNewPage", "/"+cat+"/");
			}, false);
		}		
	};

	return {
		init: init
	};

};

module.exports = new MenuController();
},{"../views/project-view":9}],2:[function(require,module,exports){
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
			//requst new pagee
			_fadeOutContent();
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
		//fade out current content
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

		element.className = element.className + " fade-in"; 
		
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
			_requestPage(newPage);			
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
					emitter.emit("loadNewPage", req.responseText);								    
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

	var _galleries = new Array();

	var init = function () {
		
		//init Scroll controller
		ScrollController.init("related-posts");

		//init the galleries
		var galleries = document.getElementsByClassName("gallery");

		for (var i = 0; i < galleries.length; i++) {
			_initGallery(galleries[i]);
		}

		//add functionality to related posts
		var p = document.getElementsByClassName("project");

		for (var i = 0; i < p.length; i++) {
			p[i].addEventListener("click", function(e){
				e.stopPropagation();
				emitter.emit("requestNewPage", e.target.parentNode.getAttribute("data-href"));
			}); 
		}
	};

	var _initGallery = function(gallery){
		
		var gallery = new Gallery(gallery);
		gallery.init();
		

	};

	function Gallery(gallery){

		this.photos = gallery.getElementsByClassName("gallery-item");
		this.currentPhoto = this.photos.length-1;;
		this.DOMObject = gallery;

		this.init = function(){
			_galleries.push(this);
			var thisGallery = this;
			this._nIntervId = setInterval(function(){
				thisGallery._fadePhoto();
			}, 3000);
		};

		this._fadePhoto = function(){
			if (this.currentPhoto!=0){
				this.photos[this.currentPhoto].className = this.photos[this.currentPhoto].className + " fade-out";
			} else {
				//STEF MEJORAR: se puede mejorar haciendo fade-in primero de la primera foto y luego del resto 	
				for (var i = 0; i < this.photos.length; i++) {
					this.photos[i].className = this.photos[i].className.replace(" fade-out", "");
				};
			}

			this.currentPhoto == 0 ? this.currentPhoto = this.photos.length-1 : this.currentPhoto--;

		}

	}

	var clearTheInterval = function(){

		for (var i = 0; i < _galleries.length; i++) {
			clearInterval(_galleries[i]._nIntervId);
		}
	}


	return {
		init: init,
		clearTheInterval : clearTheInterval
	};
};

module.exports = new ProjectView();
},{"../controllers/scroll-controller":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvbWVudS1jb250cm9sbGVyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3BhZ2UtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9mYWtlXzRiY2NjYWVmLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L21hbmFnZXJzL2VtaXR0ZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvbW9kZWxzL3BhZ2UtbW9kZWwuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvZ2FsbGVyeS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL2hvbWVwYWdlLXZpZXcuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvcHJvamVjdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuXHRNZW51IENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdEdpdmVzIGJlaGF2aW9yIHRvIE1lbnUgZWxlbWVudHNcbiovXG52YXIgcHJvamVjdFZpZXdcdD0gcmVxdWlyZSgnLi4vdmlld3MvcHJvamVjdC12aWV3JylcbjtcblxuXG52YXIgTWVudUNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coJ01lbnVDb250cm9sbGVyJyk7XG5cdFxuXHRcdHZhciBtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51XCIpLFxuXHRcdFx0Y2F0O1xuXG5cdFx0aWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi9hL1wiKSE9LTEpe1xuXHRcdFx0Y2F0ID0gXCJhXCI7XG5cdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVSaWdodFwiKSE9PSBudWxsKXtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51UmlnaHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBcIi96L1wiKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0fVx0XHRcblxuXHRcdH0gZWxzZSBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL3ovXCIpIT0tMSl7XG5cdFx0XHRjYXQgPSBcInpcIjtcblx0XHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudUxlZnRcIikhPT0gbnVsbCl7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudUxlZnRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBcIi9hL1wiKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImVycm9yXCIpO1xuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3Jvc3NNZW51XCIpIT09IG51bGwpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcm9zc01lbnVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRwcm9qZWN0Vmlldy5jbGVhclRoZUludGVydmFsKCk7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIFwiL1wiK2NhdCtcIi9cIik7XG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fVx0XHRcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWVudUNvbnRyb2xsZXIoKTsiLCIvKiBcblx0UGFnZSBDb250cm9sbGVyXG5cdC0tLS0tLS0tLS0tLS0tIFxuXHREZWNpZGVzIHdoaWNoIHBhZ2VzIGFuZC9vciBjb21wb25lbnRzIHNob3VsZCBiZSByZW5kZXJlZFxuKi9cbnZhciBIb21lcGFnZVZpZXcgXHRcdD0gcmVxdWlyZSgnLi4vdmlld3MvaG9tZXBhZ2UtdmlldycpLFxuXHRNZW51Q29udHJvbGxlciBcdFx0PSByZXF1aXJlKCcuL21lbnUtY29udHJvbGxlcicpLFxuXHRQcm9qZWN0Vmlld1x0XHRcdD0gcmVxdWlyZSgnLi4vdmlld3MvcHJvamVjdC12aWV3JyksXG5cdFBhZ2VNb2RlbFx0XHRcdD0gcmVxdWlyZSgnLi4vbW9kZWxzL3BhZ2UtbW9kZWwnKSxcblx0R2FsbGVyeVZpZXdcdFx0XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL2dhbGxlcnktdmlldycpXG47XG5cbnZhciBQYWdlQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUubG9nKCdQYWdlQ29udHJvbGxlcicpO1xuXG5cdFx0X2ZhZGVJbkNvbnRlbnQoKTtcblxuXHRcdGVtaXR0ZXIub24oXCJsb2FkTmV3UGFnZVwiLCBmdW5jdGlvbihkYXRhKXtcblx0XHRcdF9sb2FkTmV3UGFnZShkYXRhKTtcblx0XHR9KTtcblxuXHRcdGVtaXR0ZXIub24oXCJyZXF1ZXN0TmV3UGFnZVwiLCBmdW5jdGlvbihocmVmKXtcblx0XHRcdC8vcmVxdXN0IG5ldyBwYWdlZVxuXHRcdFx0X2ZhZGVPdXRDb250ZW50KCk7XG5cdFx0XHRfcmVxdWVzdE5ld1BhZ2UoaHJlZik7XG5cdFx0fSk7XG5cblx0XHRlbWl0dGVyLm9uKFwiaG9tZVJlcXVlc3ROZXdQYWdlXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0Ly9mYWRlIG91dCBjdXJyZW50IGNvbnRlbnRcblx0XHRcdEhvbWVwYWdlVmlldy5mYWRlT3V0KCk7XG5cdFx0XHQvL3JlcXVlc3QgbmV3IHBhZ2Vcblx0XHRcdF9yZXF1ZXN0TmV3UGFnZShlLnRhcmdldC5pZCk7XG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdF9zZXRWaWV3cygpO1xuXHR9O1xuXG5cdHZhciBfcmVxdWVzdE5ld1BhZ2UgPSBmdW5jdGlvbihocmVmKXtcblx0XHQvL2ZhZGUgb3V0IGN1cnJlbnQgY29udGVudFxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFBhZ2VNb2RlbC5pbml0TmV3UGFnZShocmVmKTtcblx0XHR9LCAxMDAwKTtcblx0fVxuXG5cdHZhciBfc2V0Vmlld3MgPSBmdW5jdGlvbigpe1xuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvaG9tZXBhZ2UvKSl7XG5cdFx0XHRIb21lcGFnZVZpZXcuaW5pdCgpO1x0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBJbml0aWFsaXplIE1lbnUgd2hlbiBpcyBub3QgdGhlIGhvbWVwYWdlLlxuXHRcdFx0TWVudUNvbnRyb2xsZXIuaW5pdCgpO1xuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUubWF0Y2goL3NpbmdsZS1wcm9qZWN0Lykpe1xuXHRcdFx0UHJvamVjdFZpZXcuaW5pdCgpO1x0XHRcdFxuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUubWF0Y2goL3BhZ2UtZ2FsbGVyeS8pKXtcblx0XHRcdEdhbGxlcnlWaWV3LmluaXQoKTtcdFx0XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBfZmFkZU91dENvbnRlbnQgPSBmdW5jdGlvbigpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUgKz0gXCIgZmFkZS1vdXRcIjtcdFxuXHRcdH0sIDUwMCk7XG5cblx0fTtcblxuXHR2YXIgX2ZhZGVJbkNvbnRlbnQgPSBmdW5jdGlvbigpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKS5jbGFzc05hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIikuY2xhc3NOYW1lLnJlcGxhY2UoXCJmYWRlLW91dFwiLCAnZmFkZS1pbicpO1xuXHRcdH0sIDUwMCk7XG5cdH07XG5cblx0dmFyIF9sb2FkTmV3UGFnZSA9IGZ1bmN0aW9uIChkYXRhKXtcblx0XHRjb25zb2xlLmxvZyhcIl9sb2FkTmV3UGFnZVwiKTtcblxuXHRcdHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cdFx0dmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoZGF0YSwgXCJ0ZXh0L2h0bWxcIik7XG5cdFx0XG5cdFx0ZG9jdW1lbnQudGl0bGUgPSBkb2MudGl0bGU7XG5cblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvYy5ib2R5LmNsYXNzTmFtZTtcblx0XHRcblx0XHRkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IGRvYy5ib2R5LmlubmVySFRNTDtcblx0XHRfZmFkZUluQ29udGVudCgpO1xuXG5cdFx0X3NldFZpZXdzKCk7XG5cblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQYWdlQ29udHJvbGxlcjsiLCIvKiBcblx0U2Nyb2xsIENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdEdpdmVuIGFuIGVsZW1lbnQsIGNoZWNrcyBpZiBpdCBpcyBpbnNpZGUgdGhlIHZpZXcgb2YgdGhlIHVzZXJcbiovXG52YXIgU2Nyb2xsQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciBlbGVtZW50O1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKGVsZSkge1xuXG5cdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZSk7XG5cdFx0b25TY3JvbGxpbmcoKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbGluZyk7XG5cblx0fTtcblxuXHR2YXIgb25TY3JvbGxpbmcgPSBmdW5jdGlvbigpe1xuXG5cdFx0aWYgKGlzU2Nyb2xsZWRJbnRvVmlldygpKXtcbiAgICBcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgb25TY3JvbGxpbmcpO1xuICAgIFx0XHRzaG93RWxlbWVudChlbGVtZW50KTtcbiAgICBcdH1cdFx0XG5cdH07XG5cblxuXHR2YXIgaXNTY3JvbGxlZEludG9WaWV3ID0gZnVuY3Rpb24oKXtcblxuXHRcdHZhciBlbGVtZW50VG9wICAgID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AsXG4gICAgICAgIGVsZW1lbnRCb3R0b20gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnRyb2xvIHF1ZSBhbCBtZW5vcyBzZSB2ZWFuIDEwMHB4IGRlbCBlbGVtZW50b1xuXHRcdHJldHVybiBlbGVtZW50VG9wID49IDAgJiYgKGVsZW1lbnRUb3AgKyAxMDApIDw9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHR9O1xuXG5cdC8vIFNURUY6IGVzdG8gdGVuZHLDrWEgcXVlIGVzdGFyIGVuIGxhIHZpc3RhXG5cdHZhciBzaG93RWxlbWVudCA9IGZ1bmN0aW9uKCl7XG5cblx0XHRlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lICsgXCIgZmFkZS1pblwiOyBcblx0XHRcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTY3JvbGxDb250cm9sbGVyKCk7IiwiLyogXG5cdE1haW5cblx0LS0tLS0tLS0tLS0tLS0gXG5cdE1haW4gc2NyaXB0IG9mIHRoZSBBcHAgLSBpbml0aWFsIGZpbGVcbiovXG52YXIgUGFnZUNvbnRyb2xsZXIgXHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcGFnZS1jb250cm9sbGVyJyksXG5cdEVtaXR0ZXJcdFx0XHQ9IHJlcXVpcmUoJy4vbWFuYWdlcnMvZW1pdHRlcicpXG47XG5cblxudmFyIE1haW5BcHAgPSBmdW5jdGlvbiAoKSB7XG5cdGNvbnNvbGUubG9nKFwiTWFpbkFwcFwiKTtcblx0ZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cdFBhZ2VDb250cm9sbGVyLmluaXQoKTtcbn07XG5cbk1haW5BcHAoKTsiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICBmdW5jdGlvbiBvbigpIHtcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCIvKiBSb3V0ZSBNYW5hZ2VyIC0gUGFnZSBNb2RlbCAqL1xuXG52YXIgUGFnZU1vZGVsID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBpbml0TmV3UGFnZSA9IGZ1bmN0aW9uIChuZXdQYWdlKSB7XG5cdFx0Y29uc29sZS5sb2coXCJQYWdlTW9kZWwgaW5pdFwiKTtcblxuXHRcdGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkge1x0XHRcdFxuXHRcdFx0X3JlcXVlc3RQYWdlKG5ld1BhZ2UpO1x0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL0JhY2t1cCBzb2x1dGlvbiBmb3Igb2xkIGJyb3dzZXJzLlxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBlLnRhcmdldC5pZCtcIi9cIjtcblx0XHR9XG5cdH07XG5cblx0dmFyIF9yZXF1ZXN0UGFnZSA9IGZ1bmN0aW9uIHJlcXVlc3RQYWdlKGhyZWYpe1xuXHRcdGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3Qpe1xuXHRcdFx0Y29uc29sZS5sb2coXCJfcmVxdWVzdFBhZ2VcIik7XG5cdFx0XHR2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHRyZXEub3BlbihcIkdFVFwiLCBocmVmLCB0cnVlKTtcblx0XHRcdHJlcS5vbmxvYWQgPSBmdW5jdGlvbihlKXtcblx0XHRcdCAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHQgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0ICAgIFx0aGlzdG9yeS5wdXNoU3RhdGUoaHJlZiwgXCJcIiwgaHJlZik7XG5cdFx0XHRcdFx0ZW1pdHRlci5lbWl0KFwibG9hZE5ld1BhZ2VcIiwgcmVxLnJlc3BvbnNlVGV4dCk7XHRcdFx0XHRcdFx0XHRcdCAgICBcblx0XHRcdCAgICB9IGVsc2Uge1x0XHRcdCAgICBcblx0XHRcdCAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1c1RleHQpO1x0XHRcdCAgICBcblx0XHRcdCAgICB9XG5cdFx0XHQgIH1cblx0XHRcdH07XG5cdFx0XHRyZXEub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHQgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1c1RleHQpO1xuXHRcdFx0fTtcblx0XHRcdHJlcS5zZW5kKG51bGwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGhyZWY7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdE5ld1BhZ2U6IGluaXROZXdQYWdlXG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFBhZ2VNb2RlbCgpO1xuXG4iLCIvKiBcblx0R2FsbGVyeSBWaWV3XG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRSZW5kZXJzIFZpZXcgb2YgcHJvamVjdHMgTGlzdCAoQS1aIGdhbGxlcmllcylcbiovXG5cbnZhciBHYWxsZXJ5VmlldyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XG5cdFx0dmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHJvamVjdFwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuXHRcdFx0cFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIGUudGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1ocmVmXCIpKTtcblx0XHRcdH0pOyBcblx0XHR9XG5cdFx0XHRcdFxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBHYWxsZXJ5VmlldygpOyIsIi8qIFxuXHRIb21lIFBhZ2UgVmlld1xuXHQtLS0tLS0tLS0tLS0tLSBcblx0UmVuZGVycyBIb21lIFBhZ2UgVmlld1xuKi9cbnZhciBIb21lcGFnZVZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cdFxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpe1xuXG5cdFx0Y29uc29sZS5sb2coJ0hvbWVwYWdlVmlldyBpbml0Jyk7XG5cblx0XHR2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcXVhcmVcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJob21lUmVxdWVzdE5ld1BhZ2VcIiwgZSk7XG5cdFx0XHR9KTsgXG5cdFx0fVxuXHR9O1xuXG5cdHZhciBmYWRlT3V0ID0gZnVuY3Rpb24oKXtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGFpbmVyLWhvbWVcIilbMF0uY2xhc3NOYW1lICs9IFwiIGZhZGUtb3V0LWhvbWVcIjtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0ZmFkZU91dDogZmFkZU91dFx0XHRcblx0fTtcblx0XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBIb21lcGFnZVZpZXc7IiwiLyogXG5cdFByb2plY3QgVmlld1xuXHQtLS0tLS0tLS0tLS0tLSBcblx0UmVuZGVycyBWaWV3IG9mIHByb2plY3RzIChpbml0aWFsaXplcyBnYWxsZXJpZXMpXG4qL1xudmFyXHRTY3JvbGxDb250cm9sbGVyID0gcmVxdWlyZSgnLi4vY29udHJvbGxlcnMvc2Nyb2xsLWNvbnRyb2xsZXInKTtcblxudmFyIFByb2plY3RWaWV3ID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBfZ2FsbGVyaWVzID0gbmV3IEFycmF5KCk7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XG5cdFx0Ly9pbml0IFNjcm9sbCBjb250cm9sbGVyXG5cdFx0U2Nyb2xsQ29udHJvbGxlci5pbml0KFwicmVsYXRlZC1wb3N0c1wiKTtcblxuXHRcdC8vaW5pdCB0aGUgZ2FsbGVyaWVzXG5cdFx0dmFyIGdhbGxlcmllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJnYWxsZXJ5XCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBnYWxsZXJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdF9pbml0R2FsbGVyeShnYWxsZXJpZXNbaV0pO1xuXHRcdH1cblxuXHRcdC8vYWRkIGZ1bmN0aW9uYWxpdHkgdG8gcmVsYXRlZCBwb3N0c1xuXHRcdHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInByb2plY3RcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBlLnRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSk7XG5cdFx0XHR9KTsgXG5cdFx0fVxuXHR9O1xuXG5cdHZhciBfaW5pdEdhbGxlcnkgPSBmdW5jdGlvbihnYWxsZXJ5KXtcblx0XHRcblx0XHR2YXIgZ2FsbGVyeSA9IG5ldyBHYWxsZXJ5KGdhbGxlcnkpO1xuXHRcdGdhbGxlcnkuaW5pdCgpO1xuXHRcdFxuXG5cdH07XG5cblx0ZnVuY3Rpb24gR2FsbGVyeShnYWxsZXJ5KXtcblxuXHRcdHRoaXMucGhvdG9zID0gZ2FsbGVyeS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FsbGVyeS1pdGVtXCIpO1xuXHRcdHRoaXMuY3VycmVudFBob3RvID0gdGhpcy5waG90b3MubGVuZ3RoLTE7O1xuXHRcdHRoaXMuRE9NT2JqZWN0ID0gZ2FsbGVyeTtcblxuXHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRfZ2FsbGVyaWVzLnB1c2godGhpcyk7XG5cdFx0XHR2YXIgdGhpc0dhbGxlcnkgPSB0aGlzO1xuXHRcdFx0dGhpcy5fbkludGVydklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhpc0dhbGxlcnkuX2ZhZGVQaG90bygpO1xuXHRcdFx0fSwgMzAwMCk7XG5cdFx0fTtcblxuXHRcdHRoaXMuX2ZhZGVQaG90byA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5jdXJyZW50UGhvdG8hPTApe1xuXHRcdFx0XHR0aGlzLnBob3Rvc1t0aGlzLmN1cnJlbnRQaG90b10uY2xhc3NOYW1lID0gdGhpcy5waG90b3NbdGhpcy5jdXJyZW50UGhvdG9dLmNsYXNzTmFtZSArIFwiIGZhZGUtb3V0XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL1NURUYgTUVKT1JBUjogc2UgcHVlZGUgbWVqb3JhciBoYWNpZW5kbyBmYWRlLWluIHByaW1lcm8gZGUgbGEgcHJpbWVyYSBmb3RvIHkgbHVlZ28gZGVsIHJlc3RvIFx0XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5waG90b3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR0aGlzLnBob3Rvc1tpXS5jbGFzc05hbWUgPSB0aGlzLnBob3Rvc1tpXS5jbGFzc05hbWUucmVwbGFjZShcIiBmYWRlLW91dFwiLCBcIlwiKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5jdXJyZW50UGhvdG8gPT0gMCA/IHRoaXMuY3VycmVudFBob3RvID0gdGhpcy5waG90b3MubGVuZ3RoLTEgOiB0aGlzLmN1cnJlbnRQaG90by0tO1xuXG5cdFx0fVxuXG5cdH1cblxuXHR2YXIgY2xlYXJUaGVJbnRlcnZhbCA9IGZ1bmN0aW9uKCl7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IF9nYWxsZXJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwoX2dhbGxlcmllc1tpXS5fbkludGVydklkKTtcblx0XHR9XG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRjbGVhclRoZUludGVydmFsIDogY2xlYXJUaGVJbnRlcnZhbFxuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUHJvamVjdFZpZXcoKTsiXX0=
