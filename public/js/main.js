(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* 
	Menu Controller
	-------------- 
	Gives behavior to Menu elements
*/
var projectView	= require('../views/project-view')
;


var MenuController = function () {

	var prod = "/_test";
	//var prod = "";

	var init = function () {
		console.log('MenuController');
	
		var m = document.getElementById("menu"),
			cat, newPage;

		if(window.location.href.indexOf("/a/")!=-1){
			cat = "a";
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", prod+"/z/");
				}, false);
			}
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", prod+"/contacto/");
				}, false);
			}			

		} else if(window.location.href.indexOf("/z/")!=-1){
			cat = "z";
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", prod+"/a/");
				}, false);
			}
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", prod+"/contacto/");
				}, false);
			}	
		}

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				projectView.clearTheInterval();
				typeof(cat) == "undefined" ? cat="a" : cat=cat;
				emitter.emit("requestNewPage", prod+"/"+cat+"/");
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
			document.getElementById("primary").className = document.getElementById("primary").className.replace("fade-in-page", 'fade-out-page');				
		}, 500);

		setTimeout(_scrollToTop, 1500);

	};

	var _fadeInContent = function(){
		setTimeout(function(){
			document.getElementById("primary").className = document.getElementById("primary").className.replace("fade-out", 'fade-in-page');
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

	var _scrollToTop = function(){
		window.scrollTo(0, 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvbWVudS1jb250cm9sbGVyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3BhZ2UtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9mYWtlX2ExMGRmNWNhLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L21hbmFnZXJzL2VtaXR0ZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvbW9kZWxzL3BhZ2UtbW9kZWwuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvZ2FsbGVyeS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL2hvbWVwYWdlLXZpZXcuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvcHJvamVjdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBcblx0TWVudSBDb250cm9sbGVyXG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRHaXZlcyBiZWhhdmlvciB0byBNZW51IGVsZW1lbnRzXG4qL1xudmFyIHByb2plY3RWaWV3XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL3Byb2plY3QtdmlldycpXG47XG5cblxudmFyIE1lbnVDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBwcm9kID0gXCIvX3Rlc3RcIjtcblx0Ly92YXIgcHJvZCA9IFwiXCI7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coJ01lbnVDb250cm9sbGVyJyk7XG5cdFxuXHRcdHZhciBtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51XCIpLFxuXHRcdFx0Y2F0LCBuZXdQYWdlO1xuXG5cdFx0aWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi9hL1wiKSE9LTEpe1xuXHRcdFx0Y2F0ID0gXCJhXCI7XG5cdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVSaWdodFwiKSE9PSBudWxsKXtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51UmlnaHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBwcm9kK1wiL3ovXCIpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVMZWZ0XCIpIT09IG51bGwpe1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVMZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRwcm9qZWN0Vmlldy5jbGVhclRoZUludGVydmFsKCk7XG5cdFx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgcHJvZCtcIi9jb250YWN0by9cIik7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdH1cdFx0XHRcblxuXHRcdH0gZWxzZSBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL3ovXCIpIT0tMSl7XG5cdFx0XHRjYXQgPSBcInpcIjtcblx0XHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudUxlZnRcIikhPT0gbnVsbCl7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudUxlZnRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBwcm9kK1wiL2EvXCIpO1xuXHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVSaWdodFwiKSE9PSBudWxsKXtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51UmlnaHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBwcm9kK1wiL2NvbnRhY3RvL1wiKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0fVx0XG5cdFx0fVxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcm9zc01lbnVcIikhPT0gbnVsbCl7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyb3NzTWVudVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0dHlwZW9mKGNhdCkgPT0gXCJ1bmRlZmluZWRcIiA/IGNhdD1cImFcIiA6IGNhdD1jYXQ7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIHByb2QrXCIvXCIrY2F0K1wiL1wiKTtcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9XHRcdFxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNZW51Q29udHJvbGxlcigpOyIsIi8qIFxuXHRQYWdlIENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdERlY2lkZXMgd2hpY2ggcGFnZXMgYW5kL29yIGNvbXBvbmVudHMgc2hvdWxkIGJlIHJlbmRlcmVkXG4qL1xudmFyIEhvbWVwYWdlVmlldyBcdFx0PSByZXF1aXJlKCcuLi92aWV3cy9ob21lcGFnZS12aWV3JyksXG5cdE1lbnVDb250cm9sbGVyIFx0XHQ9IHJlcXVpcmUoJy4vbWVudS1jb250cm9sbGVyJyksXG5cdFByb2plY3RWaWV3XHRcdFx0PSByZXF1aXJlKCcuLi92aWV3cy9wcm9qZWN0LXZpZXcnKSxcblx0UGFnZU1vZGVsXHRcdFx0PSByZXF1aXJlKCcuLi9tb2RlbHMvcGFnZS1tb2RlbCcpLFxuXHRHYWxsZXJ5Vmlld1x0XHRcdD0gcmVxdWlyZSgnLi4vdmlld3MvZ2FsbGVyeS12aWV3JylcbjtcblxudmFyIFBhZ2VDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coJ1BhZ2VDb250cm9sbGVyJyk7XG5cblx0XHRfZmFkZUluQ29udGVudCgpO1xuXG5cdFx0ZW1pdHRlci5vbihcImxvYWROZXdQYWdlXCIsIGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0X2xvYWROZXdQYWdlKGRhdGEpO1xuXHRcdH0pO1xuXG5cdFx0ZW1pdHRlci5vbihcInJlcXVlc3ROZXdQYWdlXCIsIGZ1bmN0aW9uKGhyZWYpe1xuXHRcdFx0Ly9yZXF1c3QgbmV3IHBhZ2VlXG5cdFx0XHRfZmFkZU91dENvbnRlbnQoKTtcblx0XHRcdF9yZXF1ZXN0TmV3UGFnZShocmVmKTtcblx0XHR9KTtcblxuXHRcdGVtaXR0ZXIub24oXCJob21lUmVxdWVzdE5ld1BhZ2VcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHQvL2ZhZGUgb3V0IGN1cnJlbnQgY29udGVudFxuXHRcdFx0SG9tZXBhZ2VWaWV3LmZhZGVPdXQoKTtcblx0XHRcdC8vcmVxdWVzdCBuZXcgcGFnZVxuXHRcdFx0X3JlcXVlc3ROZXdQYWdlKGUudGFyZ2V0LmlkKTtcblx0XHRcdFxuXHRcdH0pO1xuXG5cdFx0X3NldFZpZXdzKCk7XG5cdH07XG5cblx0dmFyIF9yZXF1ZXN0TmV3UGFnZSA9IGZ1bmN0aW9uKGhyZWYpe1xuXHRcdC8vZmFkZSBvdXQgY3VycmVudCBjb250ZW50XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0UGFnZU1vZGVsLmluaXROZXdQYWdlKGhyZWYpO1xuXHRcdH0sIDEwMDApO1xuXHR9XG5cblx0dmFyIF9zZXRWaWV3cyA9IGZ1bmN0aW9uKCl7XG5cblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lLm1hdGNoKC9ob21lcGFnZS8pKXtcblx0XHRcdEhvbWVwYWdlVmlldy5pbml0KCk7XHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEluaXRpYWxpemUgTWVudSB3aGVuIGlzIG5vdCB0aGUgaG9tZXBhZ2UuXG5cdFx0XHRNZW51Q29udHJvbGxlci5pbml0KCk7XG5cdFx0fVxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvc2luZ2xlLXByb2plY3QvKSl7XG5cdFx0XHRQcm9qZWN0Vmlldy5pbml0KCk7XHRcdFx0XG5cdFx0fVxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvcGFnZS1nYWxsZXJ5Lykpe1xuXHRcdFx0R2FsbGVyeVZpZXcuaW5pdCgpO1x0XHRcblx0XHR9XG5cdH07XG5cblx0dmFyIF9mYWRlT3V0Q29udGVudCA9IGZ1bmN0aW9uKCl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUucmVwbGFjZShcImZhZGUtaW4tcGFnZVwiLCAnZmFkZS1vdXQtcGFnZScpO1x0XHRcdFx0XG5cdFx0fSwgNTAwKTtcblxuXHRcdHNldFRpbWVvdXQoX3Njcm9sbFRvVG9wLCAxNTAwKTtcblxuXHR9O1xuXG5cdHZhciBfZmFkZUluQ29udGVudCA9IGZ1bmN0aW9uKCl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUucmVwbGFjZShcImZhZGUtb3V0XCIsICdmYWRlLWluLXBhZ2UnKTtcblx0XHR9LCA1MDApO1xuXHR9O1xuXG5cdHZhciBfbG9hZE5ld1BhZ2UgPSBmdW5jdGlvbiAoZGF0YSl7XG5cdFx0Y29uc29sZS5sb2coXCJfbG9hZE5ld1BhZ2VcIik7XG5cblx0XHR2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRcdHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGRhdGEsIFwidGV4dC9odG1sXCIpO1xuXHRcdFxuXHRcdGRvY3VtZW50LnRpdGxlID0gZG9jLnRpdGxlO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2MuYm9keS5jbGFzc05hbWU7XG5cdFx0XG5cdFx0ZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBkb2MuYm9keS5pbm5lckhUTUw7XG5cdFx0X2ZhZGVJbkNvbnRlbnQoKTtcblxuXHRcdF9zZXRWaWV3cygpO1xuXG5cdH07XG5cblx0dmFyIF9zY3JvbGxUb1RvcCA9IGZ1bmN0aW9uKCl7XG5cdFx0d2luZG93LnNjcm9sbFRvKDAsIDApO1xuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFBhZ2VDb250cm9sbGVyOyIsIi8qIFxuXHRTY3JvbGwgQ29udHJvbGxlclxuXHQtLS0tLS0tLS0tLS0tLSBcblx0R2l2ZW4gYW4gZWxlbWVudCwgY2hlY2tzIGlmIGl0IGlzIGluc2lkZSB0aGUgdmlldyBvZiB0aGUgdXNlclxuKi9cbnZhciBTY3JvbGxDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG5cblx0dmFyIGVsZW1lbnQ7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoZWxlKSB7XG5cblx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlKTtcblx0XHRvblNjcm9sbGluZygpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uU2Nyb2xsaW5nKTtcblxuXHR9O1xuXG5cdHZhciBvblNjcm9sbGluZyA9IGZ1bmN0aW9uKCl7XG5cblx0XHRpZiAoaXNTY3JvbGxlZEludG9WaWV3KCkpe1xuICAgIFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbGluZyk7XG4gICAgXHRcdHNob3dFbGVtZW50KGVsZW1lbnQpO1xuICAgIFx0fVx0XHRcblx0fTtcblxuXG5cdHZhciBpc1Njcm9sbGVkSW50b1ZpZXcgPSBmdW5jdGlvbigpe1xuXG5cdFx0dmFyIGVsZW1lbnRUb3AgICAgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCxcbiAgICAgICAgZWxlbWVudEJvdHRvbSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tO1xuICAgICAgICBcbiAgICAgICAgLy8gY29udHJvbG8gcXVlIGFsIG1lbm9zIHNlIHZlYW4gMTAwcHggZGVsIGVsZW1lbnRvXG5cdFx0cmV0dXJuIGVsZW1lbnRUb3AgPj0gMCAmJiAoZWxlbWVudFRvcCArIDEwMCkgPD0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdH07XG5cblx0Ly8gU1RFRjogZXN0byB0ZW5kcsOtYSBxdWUgZXN0YXIgZW4gbGEgdmlzdGFcblx0dmFyIHNob3dFbGVtZW50ID0gZnVuY3Rpb24oKXtcblxuXHRcdGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUgKyBcIiBmYWRlLWluXCI7IFxuXHRcdFxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNjcm9sbENvbnRyb2xsZXIoKTsiLCIvKiBcblx0TWFpblxuXHQtLS0tLS0tLS0tLS0tLSBcblx0TWFpbiBzY3JpcHQgb2YgdGhlIEFwcCAtIGluaXRpYWwgZmlsZVxuKi9cbnZhciBQYWdlQ29udHJvbGxlciBcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wYWdlLWNvbnRyb2xsZXInKSxcblx0RW1pdHRlclx0XHRcdD0gcmVxdWlyZSgnLi9tYW5hZ2Vycy9lbWl0dGVyJylcbjtcblxuXG52YXIgTWFpbkFwcCA9IGZ1bmN0aW9uICgpIHtcblx0Y29uc29sZS5sb2coXCJNYWluQXBwXCIpO1xuXHRlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblx0UGFnZUNvbnRyb2xsZXIuaW5pdCgpO1xufTtcblxuTWFpbkFwcCgpOyIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHRoaXMub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIi8qIFJvdXRlIE1hbmFnZXIgLSBQYWdlIE1vZGVsICovXG5cbnZhciBQYWdlTW9kZWwgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIGluaXROZXdQYWdlID0gZnVuY3Rpb24gKG5ld1BhZ2UpIHtcblx0XHRjb25zb2xlLmxvZyhcIlBhZ2VNb2RlbCBpbml0XCIpO1xuXG5cdFx0aWYgKGhpc3RvcnkucHVzaFN0YXRlKSB7XHRcdFx0XG5cdFx0XHRfcmVxdWVzdFBhZ2UobmV3UGFnZSk7XHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vQmFja3VwIHNvbHV0aW9uIGZvciBvbGQgYnJvd3NlcnMuXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGUudGFyZ2V0LmlkK1wiL1wiO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgX3JlcXVlc3RQYWdlID0gZnVuY3Rpb24gcmVxdWVzdFBhZ2UoaHJlZil7XG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIl9yZXF1ZXN0UGFnZVwiKTtcblx0XHRcdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHJlcS5vcGVuKFwiR0VUXCIsIGhyZWYsIHRydWUpO1xuXHRcdFx0cmVxLm9ubG9hZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdCAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHQgICAgXHRoaXN0b3J5LnB1c2hTdGF0ZShocmVmLCBcIlwiLCBocmVmKTtcblx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJsb2FkTmV3UGFnZVwiLCByZXEucmVzcG9uc2VUZXh0KTtcdFx0XHRcdFx0XHRcdFx0ICAgIFxuXHRcdFx0ICAgIH0gZWxzZSB7XHRcdFx0ICAgIFxuXHRcdFx0ICAgICAgY29uc29sZS5lcnJvcihyZXEuc3RhdHVzVGV4dCk7XHRcdFx0ICAgIFxuXHRcdFx0ICAgIH1cblx0XHRcdCAgfVxuXHRcdFx0fTtcblx0XHRcdHJlcS5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdCAgY29uc29sZS5lcnJvcihyZXEuc3RhdHVzVGV4dCk7XG5cdFx0XHR9O1xuXHRcdFx0cmVxLnNlbmQobnVsbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gaHJlZjtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0TmV3UGFnZTogaW5pdE5ld1BhZ2Vcblx0fTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUGFnZU1vZGVsKCk7XG5cbiIsIi8qIFxuXHRHYWxsZXJ5IFZpZXdcblx0LS0tLS0tLS0tLS0tLS0gXG5cdFJlbmRlcnMgVmlldyBvZiBwcm9qZWN0cyBMaXN0IChBLVogZ2FsbGVyaWVzKVxuKi9cblxudmFyIEdhbGxlcnlWaWV3ID0gZnVuY3Rpb24gKCkge1xuXG5cdFxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcblx0XHR2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcm9qZWN0XCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgZS50YXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIikpO1xuXHRcdFx0fSk7IFxuXHRcdH1cblx0XHRcdFx0XG5cdH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEdhbGxlcnlWaWV3KCk7IiwiLyogXG5cdEhvbWUgUGFnZSBWaWV3XG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRSZW5kZXJzIEhvbWUgUGFnZSBWaWV3XG4qL1xudmFyIEhvbWVwYWdlVmlldyA9IGZ1bmN0aW9uICgpIHtcblx0XG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCl7XG5cblx0XHRjb25zb2xlLmxvZygnSG9tZXBhZ2VWaWV3IGluaXQnKTtcblxuXHRcdHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNxdWFyZVwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcImhvbWVSZXF1ZXN0TmV3UGFnZVwiLCBlKTtcblx0XHRcdH0pOyBcblx0XHR9XG5cdH07XG5cblx0dmFyIGZhZGVPdXQgPSBmdW5jdGlvbigpe1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb250YWluZXItaG9tZVwiKVswXS5jbGFzc05hbWUgKz0gXCIgZmFkZS1vdXQtaG9tZVwiO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRmYWRlT3V0OiBmYWRlT3V0XHRcdFxuXHR9O1xuXHRcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEhvbWVwYWdlVmlldzsiLCIvKiBcblx0UHJvamVjdCBWaWV3XG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRSZW5kZXJzIFZpZXcgb2YgcHJvamVjdHMgKGluaXRpYWxpemVzIGdhbGxlcmllcylcbiovXG52YXJcdFNjcm9sbENvbnRyb2xsZXIgPSByZXF1aXJlKCcuLi9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlcicpO1xuXG52YXIgUHJvamVjdFZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIF9nYWxsZXJpZXMgPSBuZXcgQXJyYXkoKTtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcblx0XHQvL2luaXQgU2Nyb2xsIGNvbnRyb2xsZXJcblx0XHRTY3JvbGxDb250cm9sbGVyLmluaXQoXCJyZWxhdGVkLXBvc3RzXCIpO1xuXG5cdFx0Ly9pbml0IHRoZSBnYWxsZXJpZXNcblx0XHR2YXIgZ2FsbGVyaWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbGxlcnlcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGdhbGxlcmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0X2luaXRHYWxsZXJ5KGdhbGxlcmllc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly9hZGQgZnVuY3Rpb25hbGl0eSB0byByZWxhdGVkIHBvc3RzXG5cdFx0dmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHJvamVjdFwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuXHRcdFx0cFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIGUudGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1ocmVmXCIpKTtcblx0XHRcdH0pOyBcblx0XHR9XG5cdH07XG5cblx0dmFyIF9pbml0R2FsbGVyeSA9IGZ1bmN0aW9uKGdhbGxlcnkpe1xuXHRcdFxuXHRcdHZhciBnYWxsZXJ5ID0gbmV3IEdhbGxlcnkoZ2FsbGVyeSk7XG5cdFx0Z2FsbGVyeS5pbml0KCk7XG5cdFx0XG5cblx0fTtcblxuXHRmdW5jdGlvbiBHYWxsZXJ5KGdhbGxlcnkpe1xuXG5cdFx0dGhpcy5waG90b3MgPSBnYWxsZXJ5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJnYWxsZXJ5LWl0ZW1cIik7XG5cdFx0dGhpcy5jdXJyZW50UGhvdG8gPSB0aGlzLnBob3Rvcy5sZW5ndGgtMTs7XG5cdFx0dGhpcy5ET01PYmplY3QgPSBnYWxsZXJ5O1xuXG5cdFx0dGhpcy5pbml0ID0gZnVuY3Rpb24oKXtcblx0XHRcdF9nYWxsZXJpZXMucHVzaCh0aGlzKTtcblx0XHRcdHZhciB0aGlzR2FsbGVyeSA9IHRoaXM7XG5cdFx0XHR0aGlzLl9uSW50ZXJ2SWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGlzR2FsbGVyeS5fZmFkZVBob3RvKCk7XG5cdFx0XHR9LCAzMDAwKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5fZmFkZVBob3RvID0gZnVuY3Rpb24oKXtcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRQaG90byE9MCl7XG5cdFx0XHRcdHRoaXMucGhvdG9zW3RoaXMuY3VycmVudFBob3RvXS5jbGFzc05hbWUgPSB0aGlzLnBob3Rvc1t0aGlzLmN1cnJlbnRQaG90b10uY2xhc3NOYW1lICsgXCIgZmFkZS1vdXRcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vU1RFRiBNRUpPUkFSOiBzZSBwdWVkZSBtZWpvcmFyIGhhY2llbmRvIGZhZGUtaW4gcHJpbWVybyBkZSBsYSBwcmltZXJhIGZvdG8geSBsdWVnbyBkZWwgcmVzdG8gXHRcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBob3Rvcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHRoaXMucGhvdG9zW2ldLmNsYXNzTmFtZSA9IHRoaXMucGhvdG9zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKFwiIGZhZGUtb3V0XCIsIFwiXCIpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmN1cnJlbnRQaG90byA9PSAwID8gdGhpcy5jdXJyZW50UGhvdG8gPSB0aGlzLnBob3Rvcy5sZW5ndGgtMSA6IHRoaXMuY3VycmVudFBob3RvLS07XG5cblx0XHR9XG5cblx0fVxuXG5cdHZhciBjbGVhclRoZUludGVydmFsID0gZnVuY3Rpb24oKXtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgX2dhbGxlcmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y2xlYXJJbnRlcnZhbChfZ2FsbGVyaWVzW2ldLl9uSW50ZXJ2SWQpO1xuXHRcdH1cblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdGNsZWFyVGhlSW50ZXJ2YWwgOiBjbGVhclRoZUludGVydmFsXG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQcm9qZWN0VmlldygpOyJdfQ==
