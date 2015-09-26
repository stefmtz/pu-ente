(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* 
	Menu Controller
	-------------- 
	Gives behavior to Menu elements
*/
var projectView	= require('../views/project-view'),
	menuView = require('../views/menu-view')
;


var MenuController = function () {

	var prod = "/_test";
	var prod = "";
	var cat, lang, lastPage;

	var init = function (lp) {
		console.log('MenuController');

		lang = WPGlobus.language != "es" ? "/"+WPGlobus.language : ""; 
		lastPage = typeof lp !== 'undefined' ? lp : "/a/";

		console.log("init lastPage="+lastPage);
		menuView.initSubMenu();
		_initMainMenu();
		_initSubMenu();

	};

	var _initMainMenu = function(){

		console.log("_initMainMenu lastPage="+lastPage);

		cat = _getCat();

		if(document.getElementById("menuRight")!== null){
			document.getElementById("menuRight").addEventListener("click", function(e){
				projectView.clearTheInterval();
				if(window.location.href.indexOf("/a/")!=-1){
					emitter.emit("requestNewPage", prod+lang+"/z/");
				} else {
					menuView.showSubMenu();
				}			
			}, false);
		}

		if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					if(window.location.href.indexOf("/a/")!=-1){
						menuView.showSubMenu();
					} else {
						emitter.emit("requestNewPage", prod+lang+"/a/");
					}
				}, false);
		}	

		if(document.getElementById("crossMenu")!== null){
			console.log("crossMenu");
			document.getElementById("crossMenu").addEventListener("click", function(e){
				projectView.clearTheInterval();
				console.log("allá vamos-->"+prod+lang+"/"+cat+"/");
				emitter.emit("requestNewPage", prod+lang+"/"+cat+"/");
			}, false);
		}

	}

	var _initSubMenu = function(){

		var ul = document.getElementById("sub-sections");
		var lis = ul.getElementsByTagName("li");
		var overlay = document.getElementById("overlay");

		for (var i = 0; i < lis.length; i++) {
			lis[i].addEventListener("click", function(e){
				e.stopPropagation();
				menuView.hideSubMenu(false);
				emitter.emit("requestNewPage", prod+lang+e.target.getAttribute("data-href"));
			}); 
		}

		overlay.addEventListener("click", function(e){
			menuView.hideSubMenu(true);
		});
	}

	function _getCat(){

		console.log("getcat lastPage="+lastPage);
		if(window.location.href.indexOf("/z/")!=-1){
			return "z";
		} else if(window.location.href.indexOf("/a/")!=-1) {
			return "a";
		} else if(lastPage.indexOf("/z/") !=-1){
			return "z";
		} else if(lastPage.indexOf("/a/") !=-1){
			return "a";
		} else {
			return "a";
		}
	}

	return {
		init: init
	};

};

module.exports = new MenuController();
},{"../views/menu-view":9,"../views/project-view":10}],2:[function(require,module,exports){
/* 
	Page Controller
	-------------- 
	Decides which views should be rendered and manages some
	common views behaviors.
*/
var HomepageView 		= require('../views/homepage-view'),
	MenuController 		= require('./menu-controller'),
	ProjectView			= require('../views/project-view'),
	PageModel			= require('../models/page-model'),
	GalleryView			= require('../views/gallery-view'),
	PuenteView			= require('../views/puente-view')
;

var PageController = function() {

	var lastPage;

	var init = function () {
		console.log('PageController');

		_fadeInContent();

		emitter.on("loadNewPage", function(data){
			_loadNewPage(data);
		});

		emitter.on("requestNewPage", function(href){
			_fadeOutContent();
			lastPage = window.location.href;
			_requestNewPage(href);
		});

		emitter.on("homeRequestNewPage", function(e){
			HomepageView.fadeOut();
			_requestNewPage(e.target.id+"/", true);
			
		});

		window.addEventListener('popstate', function(event) {
		 	_fadeOutContent();
			setTimeout(function(){
				PageModel.initNewPage(event.state, false);
			}, 1000);  
		});

		_setViews();
	};

	var _requestNewPage = function(href){
		setTimeout(function(){
			PageModel.initNewPage(href);
		}, 1000);
	}

	var _setViews = function(){

		if(document.getElementById("primary").className.match(/page-puente/)){
			PuenteView.init(lastPage);		
		}
		
		if(document.getElementById("primary").className.match(/homepage/)){
			HomepageView.init();			
		} else {
			// Initialize Menu only when is not the homepage.
			MenuController.init(lastPage);
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
},{"../models/page-model":6,"../views/gallery-view":7,"../views/homepage-view":8,"../views/project-view":10,"../views/puente-view":11,"./menu-controller":1}],3:[function(require,module,exports){
/* 
	Scroll Controller
	-------------- 
	Given an element, checks if it is inside the view of the user
*/
var ScrollController = function() {

	var element;

	var init = function (ele) {
		element = document.getElementById(ele);
		_onScrolling();
		window.addEventListener("scroll", _onScrolling);

	};

	var _onScrolling = function(){

		if (_isScrolledIntoView()){
    		window.removeEventListener("scroll", _onScrolling);
    		_showElement(element);
    	}	
	};


	var _isScrolledIntoView = function(){

		var elementTop    = element.getBoundingClientRect().top,
        elementBottom = element.getBoundingClientRect().bottom;
        
        // controlo que al menos se vean 100px del elemento
		return elementTop >= 0 && (elementTop + 100) <= window.innerHeight;

	};

	// STEF: esto tendría que estar en la vista
	var _showElement = function(){
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

	var initNewPage = function (newPage, nuevo) {
		console.log("PageModel init");
		
		nuevo = typeof nuevo !== 'undefined' ? nuevo : true;

		if (!newPage){
			newPage = "";
		}

		if (history.pushState) {			
			_requestPage(newPage, nuevo);			
		} else {
			//Backup solution for old browsers.
			window.location.href = e.target.id+"/";
		}
	};

	var _requestPage = function requestPage(href, nuevo){
		if (window.XMLHttpRequest){
			console.log("_requestPage");
			var req = new XMLHttpRequest();
			req.open("GET", href, true);
			req.onload = function(e){
			  if (req.readyState === 4) {
			    if (req.status === 200) {
			    	if (nuevo==true){
			    		history.pushState(href, "", href);	
			    	}
			    	
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
var	ScrollController = require('../controllers/scroll-controller');


var GalleryView = function () {

	
	var init = function () {
		
		ScrollController.init("gallery-pagination");
		
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
},{"../controllers/scroll-controller":3}],8:[function(require,module,exports){
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
	Menu View
	-------------- 
	Renders View of Main & Sub Menus
*/

var MenuView = function () {
	
	var o, s;

	var initSubMenu = function () {
		
		console.log("initSubMenu")
		o = document.getElementById("overlay");
		s = document.getElementById("submenu");

						
	};

	var showSubMenu = function () {
		
		o.style.visibility = "visible";
		s.style.visibility = "visible";

		o.className = o.className + " fade-in";
		s.className = s.className + " fade-in";
	}

	var hideSubMenu = function (visibilityHidden) {
		s.className = s.className.replace("fade-in", "fade-out");
		if(visibilityHidden===true){
			o.className = o.className.replace("fade-in", "fade-out");
			o.style.visibility = "hidden";
			s.style.visibility = "hidden";
		}
	}


	return {
		initSubMenu: initSubMenu,
		showSubMenu: showSubMenu,
		hideSubMenu: hideSubMenu
	};
};



module.exports = new MenuView();
},{}],10:[function(require,module,exports){
/* 
	Project View
	-------------- 
	Renders View of projects (initializes galleries)
*/
var	ScrollController = require('../controllers/scroll-controller');

var ProjectView = function () {

	var _galleries = new Array();
	var lang;

	var init = function () {

		WPGlobus.language != "es" ? lang = WPGlobus.language : lang=""; 

		//init Scroll controller
		ScrollController.init("related-posts");

		//init Pagination Menu
		_paginationMenu(); 

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
				emitter.emit("requestNewPage", lang+e.target.parentNode.getAttribute("data-href"));
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
		this.time = gallery.getAttribute("data-time");

		this.time == undefined ? this.time = 2000 : this.time = this.time*1000;

		this.init = function(){
			_galleries.push(this);
			var thisGallery = this;
			this._nIntervId = setInterval(function(){
				thisGallery._fadePhoto();
			}, this.time);
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

	//STEF: move to functions
	var _findAncestror = function(el, cls){
		while ((el = el.parentElement) && !el.classList.contains(cls));
		return el;		
	}

	var _paginationMenu = function(){

		var target;

		if (document.contains(document.getElementById("square-previous"))) {

			document.getElementById("square-previous").addEventListener("click", function(e){
				clearTheInterval();	
				target = _findAncestror(e.target, "clickable-square");
				emitter.emit("requestNewPage", target.getAttribute("data-href"));	
			}, false);

		}

		if (document.contains(document.getElementById("square-next"))) {

			document.getElementById("square-next").addEventListener("click", function(e){
				clearTheInterval();			
				target = _findAncestror(e.target, "clickable-square");
				emitter.emit("requestNewPage", target.getAttribute("data-href"));		
			}, false);

		}

		document.getElementById("scroll-up").addEventListener("click", function(e){
			//STEF move to functions
			(function smoothscroll(){
			    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
			    if (currentScroll > 0) {
			         window.requestAnimationFrame(smoothscroll);
			         window.scrollTo (0,currentScroll - (currentScroll/25));
			    }
			})();			
		}, false);

	}


	return {
		init: init,
		clearTheInterval : clearTheInterval
	};
};

module.exports = new ProjectView();
},{"../controllers/scroll-controller":3}],11:[function(require,module,exports){
/* 
	pu-ente View
	-------------- 
	Renders View of pu-ente page
*/

var PuenteView = function () {

	
	var init = function (lastPage) {
		
		console.log("init PuenteView");
		lastPage = typeof lastPage !== 'undefined' ? lastPage : "/a/";


		console.log("lastPage = "+lastPage);

		if (lastPage.indexOf("/a/")!=-1){

			document.getElementById("menu").innerHTML = '<div id="crossMenu" class="cross-menu left"></div><!--<div id="menuRight" class="square-menu right"></div>-->';
		} else {

			document.getElementById("menu").innerHTML = '<!--<div id="menuLeft" class="square-menu left"></div>--><div id="crossMenu" class="cross-menu right"></div>';
		}

	};


	return {
		init: init
	};
};

module.exports = new PuenteView();
},{}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvbWVudS1jb250cm9sbGVyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3BhZ2UtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9mYWtlX2JjOTYxNTUzLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L21hbmFnZXJzL2VtaXR0ZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvbW9kZWxzL3BhZ2UtbW9kZWwuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvZ2FsbGVyeS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL2hvbWVwYWdlLXZpZXcuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvbWVudS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL3Byb2plY3Qtdmlldy5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC92aWV3cy9wdWVudGUtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBcblx0TWVudSBDb250cm9sbGVyXG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRHaXZlcyBiZWhhdmlvciB0byBNZW51IGVsZW1lbnRzXG4qL1xudmFyIHByb2plY3RWaWV3XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL3Byb2plY3QtdmlldycpLFxuXHRtZW51VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL21lbnUtdmlldycpXG47XG5cblxudmFyIE1lbnVDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBwcm9kID0gXCIvX3Rlc3RcIjtcblx0dmFyIHByb2QgPSBcIlwiO1xuXHR2YXIgY2F0LCBsYW5nLCBsYXN0UGFnZTtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uIChscCkge1xuXHRcdGNvbnNvbGUubG9nKCdNZW51Q29udHJvbGxlcicpO1xuXG5cdFx0bGFuZyA9IFdQR2xvYnVzLmxhbmd1YWdlICE9IFwiZXNcIiA/IFwiL1wiK1dQR2xvYnVzLmxhbmd1YWdlIDogXCJcIjsgXG5cdFx0bGFzdFBhZ2UgPSB0eXBlb2YgbHAgIT09ICd1bmRlZmluZWQnID8gbHAgOiBcIi9hL1wiO1xuXG5cdFx0Y29uc29sZS5sb2coXCJpbml0IGxhc3RQYWdlPVwiK2xhc3RQYWdlKTtcblx0XHRtZW51Vmlldy5pbml0U3ViTWVudSgpO1xuXHRcdF9pbml0TWFpbk1lbnUoKTtcblx0XHRfaW5pdFN1Yk1lbnUoKTtcblxuXHR9O1xuXG5cdHZhciBfaW5pdE1haW5NZW51ID0gZnVuY3Rpb24oKXtcblxuXHRcdGNvbnNvbGUubG9nKFwiX2luaXRNYWluTWVudSBsYXN0UGFnZT1cIitsYXN0UGFnZSk7XG5cblx0XHRjYXQgPSBfZ2V0Q2F0KCk7XG5cblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVSaWdodFwiKSE9PSBudWxsKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudVJpZ2h0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0cHJvamVjdFZpZXcuY2xlYXJUaGVJbnRlcnZhbCgpO1xuXHRcdFx0XHRpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL2EvXCIpIT0tMSl7XG5cdFx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgcHJvZCtsYW5nK1wiL3ovXCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lbnVWaWV3LnNob3dTdWJNZW51KCk7XG5cdFx0XHRcdH1cdFx0XHRcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9XG5cblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVMZWZ0XCIpIT09IG51bGwpe1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVMZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRwcm9qZWN0Vmlldy5jbGVhclRoZUludGVydmFsKCk7XG5cdFx0XHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi9hL1wiKSE9LTEpe1xuXHRcdFx0XHRcdFx0bWVudVZpZXcuc2hvd1N1Yk1lbnUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgcHJvZCtsYW5nK1wiL2EvXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdH1cdFxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcm9zc01lbnVcIikhPT0gbnVsbCl7XG5cdFx0XHRjb25zb2xlLmxvZyhcImNyb3NzTWVudVwiKTtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3Jvc3NNZW51XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0cHJvamVjdFZpZXcuY2xlYXJUaGVJbnRlcnZhbCgpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcImFsbMOhIHZhbW9zLS0+XCIrcHJvZCtsYW5nK1wiL1wiK2NhdCtcIi9cIik7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIHByb2QrbGFuZytcIi9cIitjYXQrXCIvXCIpO1xuXHRcdFx0fSwgZmFsc2UpO1xuXHRcdH1cblxuXHR9XG5cblx0dmFyIF9pbml0U3ViTWVudSA9IGZ1bmN0aW9uKCl7XG5cblx0XHR2YXIgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Yi1zZWN0aW9uc1wiKTtcblx0XHR2YXIgbGlzID0gdWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaVwiKTtcblx0XHR2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsaXNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRtZW51Vmlldy5oaWRlU3ViTWVudShmYWxzZSk7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIHByb2QrbGFuZytlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIikpO1xuXHRcdFx0fSk7IFxuXHRcdH1cblxuXHRcdG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0bWVudVZpZXcuaGlkZVN1Yk1lbnUodHJ1ZSk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBfZ2V0Q2F0KCl7XG5cblx0XHRjb25zb2xlLmxvZyhcImdldGNhdCBsYXN0UGFnZT1cIitsYXN0UGFnZSk7XG5cdFx0aWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi96L1wiKSE9LTEpe1xuXHRcdFx0cmV0dXJuIFwielwiO1xuXHRcdH0gZWxzZSBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL2EvXCIpIT0tMSkge1xuXHRcdFx0cmV0dXJuIFwiYVwiO1xuXHRcdH0gZWxzZSBpZihsYXN0UGFnZS5pbmRleE9mKFwiL3ovXCIpICE9LTEpe1xuXHRcdFx0cmV0dXJuIFwielwiO1xuXHRcdH0gZWxzZSBpZihsYXN0UGFnZS5pbmRleE9mKFwiL2EvXCIpICE9LTEpe1xuXHRcdFx0cmV0dXJuIFwiYVwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCJhXCI7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IE1lbnVDb250cm9sbGVyKCk7IiwiLyogXG5cdFBhZ2UgQ29udHJvbGxlclxuXHQtLS0tLS0tLS0tLS0tLSBcblx0RGVjaWRlcyB3aGljaCB2aWV3cyBzaG91bGQgYmUgcmVuZGVyZWQgYW5kIG1hbmFnZXMgc29tZVxuXHRjb21tb24gdmlld3MgYmVoYXZpb3JzLlxuKi9cbnZhciBIb21lcGFnZVZpZXcgXHRcdD0gcmVxdWlyZSgnLi4vdmlld3MvaG9tZXBhZ2UtdmlldycpLFxuXHRNZW51Q29udHJvbGxlciBcdFx0PSByZXF1aXJlKCcuL21lbnUtY29udHJvbGxlcicpLFxuXHRQcm9qZWN0Vmlld1x0XHRcdD0gcmVxdWlyZSgnLi4vdmlld3MvcHJvamVjdC12aWV3JyksXG5cdFBhZ2VNb2RlbFx0XHRcdD0gcmVxdWlyZSgnLi4vbW9kZWxzL3BhZ2UtbW9kZWwnKSxcblx0R2FsbGVyeVZpZXdcdFx0XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL2dhbGxlcnktdmlldycpLFxuXHRQdWVudGVWaWV3XHRcdFx0PSByZXF1aXJlKCcuLi92aWV3cy9wdWVudGUtdmlldycpXG47XG5cbnZhciBQYWdlQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciBsYXN0UGFnZTtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnUGFnZUNvbnRyb2xsZXInKTtcblxuXHRcdF9mYWRlSW5Db250ZW50KCk7XG5cblx0XHRlbWl0dGVyLm9uKFwibG9hZE5ld1BhZ2VcIiwgZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRfbG9hZE5ld1BhZ2UoZGF0YSk7XG5cdFx0fSk7XG5cblx0XHRlbWl0dGVyLm9uKFwicmVxdWVzdE5ld1BhZ2VcIiwgZnVuY3Rpb24oaHJlZil7XG5cdFx0XHRfZmFkZU91dENvbnRlbnQoKTtcblx0XHRcdGxhc3RQYWdlID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRfcmVxdWVzdE5ld1BhZ2UoaHJlZik7XG5cdFx0fSk7XG5cblx0XHRlbWl0dGVyLm9uKFwiaG9tZVJlcXVlc3ROZXdQYWdlXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0SG9tZXBhZ2VWaWV3LmZhZGVPdXQoKTtcblx0XHRcdF9yZXF1ZXN0TmV3UGFnZShlLnRhcmdldC5pZCtcIi9cIiwgdHJ1ZSk7XG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0IFx0X2ZhZGVPdXRDb250ZW50KCk7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFBhZ2VNb2RlbC5pbml0TmV3UGFnZShldmVudC5zdGF0ZSwgZmFsc2UpO1xuXHRcdFx0fSwgMTAwMCk7ICBcblx0XHR9KTtcblxuXHRcdF9zZXRWaWV3cygpO1xuXHR9O1xuXG5cdHZhciBfcmVxdWVzdE5ld1BhZ2UgPSBmdW5jdGlvbihocmVmKXtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRQYWdlTW9kZWwuaW5pdE5ld1BhZ2UoaHJlZik7XG5cdFx0fSwgMTAwMCk7XG5cdH1cblxuXHR2YXIgX3NldFZpZXdzID0gZnVuY3Rpb24oKXtcblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUubWF0Y2goL3BhZ2UtcHVlbnRlLykpe1xuXHRcdFx0UHVlbnRlVmlldy5pbml0KGxhc3RQYWdlKTtcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUubWF0Y2goL2hvbWVwYWdlLykpe1xuXHRcdFx0SG9tZXBhZ2VWaWV3LmluaXQoKTtcdFx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBNZW51IG9ubHkgd2hlbiBpcyBub3QgdGhlIGhvbWVwYWdlLlxuXHRcdFx0TWVudUNvbnRyb2xsZXIuaW5pdChsYXN0UGFnZSk7XG5cdFx0fVxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvc2luZ2xlLXByb2plY3QvKSl7XG5cdFx0XHRQcm9qZWN0Vmlldy5pbml0KCk7XHRcdFx0XG5cdFx0fVxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvcGFnZS1nYWxsZXJ5Lykpe1xuXHRcdFx0R2FsbGVyeVZpZXcuaW5pdCgpO1x0XHRcblx0XHR9XG5cdFx0XG5cdH07XG5cblx0dmFyIF9mYWRlT3V0Q29udGVudCA9IGZ1bmN0aW9uKCl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUucmVwbGFjZShcImZhZGUtaW4tcGFnZVwiLCAnZmFkZS1vdXQtcGFnZScpO1xuXHRcdH0sIDUwMCk7XG5cdFx0c2V0VGltZW91dChfc2Nyb2xsVG9Ub3AsIDE1MDApO1xuXHR9O1xuXG5cdHZhciBfZmFkZUluQ29udGVudCA9IGZ1bmN0aW9uKCl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUucmVwbGFjZShcImZhZGUtb3V0XCIsICdmYWRlLWluLXBhZ2UnKTtcblx0XHR9LCA1MDApO1xuXHR9O1xuXG5cdHZhciBfbG9hZE5ld1BhZ2UgPSBmdW5jdGlvbiAoZGF0YSl7XG5cdFx0Y29uc29sZS5sb2coXCJfbG9hZE5ld1BhZ2VcIik7XG5cblx0XHR2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRcdHZhciBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGRhdGEsIFwidGV4dC9odG1sXCIpO1xuXHRcdFxuXHRcdGRvY3VtZW50LnRpdGxlID0gZG9jLnRpdGxlO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2MuYm9keS5jbGFzc05hbWU7XG5cdFx0XG5cdFx0ZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBkb2MuYm9keS5pbm5lckhUTUw7XG5cdFx0X2ZhZGVJbkNvbnRlbnQoKTtcblx0XHRfc2V0Vmlld3MoKTtcblx0fTtcblxuXHR2YXIgX3Njcm9sbFRvVG9wID0gZnVuY3Rpb24oKXtcblx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG5cdH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUGFnZUNvbnRyb2xsZXI7IiwiLyogXG5cdFNjcm9sbCBDb250cm9sbGVyXG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRHaXZlbiBhbiBlbGVtZW50LCBjaGVja3MgaWYgaXQgaXMgaW5zaWRlIHRoZSB2aWV3IG9mIHRoZSB1c2VyXG4qL1xudmFyIFNjcm9sbENvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcblxuXHR2YXIgZWxlbWVudDtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uIChlbGUpIHtcblx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlKTtcblx0XHRfb25TY3JvbGxpbmcoKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBfb25TY3JvbGxpbmcpO1xuXG5cdH07XG5cblx0dmFyIF9vblNjcm9sbGluZyA9IGZ1bmN0aW9uKCl7XG5cblx0XHRpZiAoX2lzU2Nyb2xsZWRJbnRvVmlldygpKXtcbiAgICBcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgX29uU2Nyb2xsaW5nKTtcbiAgICBcdFx0X3Nob3dFbGVtZW50KGVsZW1lbnQpO1xuICAgIFx0fVx0XG5cdH07XG5cblxuXHR2YXIgX2lzU2Nyb2xsZWRJbnRvVmlldyA9IGZ1bmN0aW9uKCl7XG5cblx0XHR2YXIgZWxlbWVudFRvcCAgICA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wLFxuICAgICAgICBlbGVtZW50Qm90dG9tID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b207XG4gICAgICAgIFxuICAgICAgICAvLyBjb250cm9sbyBxdWUgYWwgbWVub3Mgc2UgdmVhbiAxMDBweCBkZWwgZWxlbWVudG9cblx0XHRyZXR1cm4gZWxlbWVudFRvcCA+PSAwICYmIChlbGVtZW50VG9wICsgMTAwKSA8PSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0fTtcblxuXHQvLyBTVEVGOiBlc3RvIHRlbmRyw61hIHF1ZSBlc3RhciBlbiBsYSB2aXN0YVxuXHR2YXIgX3Nob3dFbGVtZW50ID0gZnVuY3Rpb24oKXtcblx0XHRlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lICsgXCIgZmFkZS1pblwiOyBcdFx0XG5cdH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2Nyb2xsQ29udHJvbGxlcigpOyIsIi8qIFxuXHRNYWluXG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRNYWluIHNjcmlwdCBvZiB0aGUgQXBwIC0gaW5pdGlhbCBmaWxlXG4qL1xudmFyIFBhZ2VDb250cm9sbGVyIFx0PSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3BhZ2UtY29udHJvbGxlcicpLFxuXHRFbWl0dGVyXHRcdFx0PSByZXF1aXJlKCcuL21hbmFnZXJzL2VtaXR0ZXInKVxuO1xuXG5cbnZhciBNYWluQXBwID0gZnVuY3Rpb24gKCkge1xuXHRjb25zb2xlLmxvZyhcIk1haW5BcHBcIik7XG5cdGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXHRQYWdlQ29udHJvbGxlci5pbml0KCk7XG59O1xuXG5NYWluQXBwKCk7IiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgdGhpcy5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwiLyogUm91dGUgTWFuYWdlciAtIFBhZ2UgTW9kZWwgKi9cblxudmFyIFBhZ2VNb2RlbCA9IGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgaW5pdE5ld1BhZ2UgPSBmdW5jdGlvbiAobmV3UGFnZSwgbnVldm8pIHtcblx0XHRjb25zb2xlLmxvZyhcIlBhZ2VNb2RlbCBpbml0XCIpO1xuXHRcdFxuXHRcdG51ZXZvID0gdHlwZW9mIG51ZXZvICE9PSAndW5kZWZpbmVkJyA/IG51ZXZvIDogdHJ1ZTtcblxuXHRcdGlmICghbmV3UGFnZSl7XG5cdFx0XHRuZXdQYWdlID0gXCJcIjtcblx0XHR9XG5cblx0XHRpZiAoaGlzdG9yeS5wdXNoU3RhdGUpIHtcdFx0XHRcblx0XHRcdF9yZXF1ZXN0UGFnZShuZXdQYWdlLCBudWV2byk7XHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vQmFja3VwIHNvbHV0aW9uIGZvciBvbGQgYnJvd3NlcnMuXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGUudGFyZ2V0LmlkK1wiL1wiO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgX3JlcXVlc3RQYWdlID0gZnVuY3Rpb24gcmVxdWVzdFBhZ2UoaHJlZiwgbnVldm8pe1xuXHRcdGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3Qpe1xuXHRcdFx0Y29uc29sZS5sb2coXCJfcmVxdWVzdFBhZ2VcIik7XG5cdFx0XHR2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHRyZXEub3BlbihcIkdFVFwiLCBocmVmLCB0cnVlKTtcblx0XHRcdHJlcS5vbmxvYWQgPSBmdW5jdGlvbihlKXtcblx0XHRcdCAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHQgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0ICAgIFx0aWYgKG51ZXZvPT10cnVlKXtcblx0XHRcdCAgICBcdFx0aGlzdG9yeS5wdXNoU3RhdGUoaHJlZiwgXCJcIiwgaHJlZik7XHRcblx0XHRcdCAgICBcdH1cblx0XHRcdCAgICBcdFxuXHRcdFx0XHRcdGVtaXR0ZXIuZW1pdChcImxvYWROZXdQYWdlXCIsIHJlcS5yZXNwb25zZVRleHQpO1x0XHRcdFx0XHRcdFx0XHQgICAgXG5cdFx0XHQgICAgfSBlbHNlIHtcdFx0XHQgICAgXG5cdFx0XHQgICAgICBjb25zb2xlLmVycm9yKHJlcS5zdGF0dXNUZXh0KTtcdFx0XHQgICAgXG5cdFx0XHQgICAgfVxuXHRcdFx0ICB9XG5cdFx0XHR9O1xuXHRcdFx0cmVxLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0ICBjb25zb2xlLmVycm9yKHJlcS5zdGF0dXNUZXh0KTtcblx0XHRcdH07XG5cdFx0XHRyZXEuc2VuZChudWxsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBocmVmO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXROZXdQYWdlOiBpbml0TmV3UGFnZVxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQYWdlTW9kZWwoKTtcblxuIiwiLyogXG5cdEdhbGxlcnkgVmlld1xuXHQtLS0tLS0tLS0tLS0tLSBcblx0UmVuZGVycyBWaWV3IG9mIHByb2plY3RzIExpc3QgKEEtWiBnYWxsZXJpZXMpXG4qL1xudmFyXHRTY3JvbGxDb250cm9sbGVyID0gcmVxdWlyZSgnLi4vY29udHJvbGxlcnMvc2Nyb2xsLWNvbnRyb2xsZXInKTtcblxuXG52YXIgR2FsbGVyeVZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cblx0XG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdFNjcm9sbENvbnRyb2xsZXIuaW5pdChcImdhbGxlcnktcGFnaW5hdGlvblwiKTtcblx0XHRcblx0XHR2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcm9qZWN0XCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgZS50YXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIikpO1xuXHRcdFx0fSk7IFxuXHRcdH1cdFx0XHRcdFxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBHYWxsZXJ5VmlldygpOyIsIi8qIFxuXHRIb21lIFBhZ2UgVmlld1xuXHQtLS0tLS0tLS0tLS0tLSBcblx0UmVuZGVycyBIb21lIFBhZ2UgVmlld1xuKi9cbnZhciBIb21lcGFnZVZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cdFxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpe1xuXG5cdFx0Y29uc29sZS5sb2coJ0hvbWVwYWdlVmlldyBpbml0Jyk7XG5cblx0XHR2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcXVhcmVcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJob21lUmVxdWVzdE5ld1BhZ2VcIiwgZSk7XG5cdFx0XHR9KTsgXG5cdFx0fVxuXHR9O1xuXG5cdHZhciBmYWRlT3V0ID0gZnVuY3Rpb24oKXtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGFpbmVyLWhvbWVcIilbMF0uY2xhc3NOYW1lICs9IFwiIGZhZGUtb3V0LWhvbWVcIjtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0ZmFkZU91dDogZmFkZU91dFx0XHRcblx0fTtcblx0XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBIb21lcGFnZVZpZXc7IiwiLyogXG5cdE1lbnUgVmlld1xuXHQtLS0tLS0tLS0tLS0tLSBcblx0UmVuZGVycyBWaWV3IG9mIE1haW4gJiBTdWIgTWVudXNcbiovXG5cbnZhciBNZW51VmlldyA9IGZ1bmN0aW9uICgpIHtcblx0XG5cdHZhciBvLCBzO1xuXG5cdHZhciBpbml0U3ViTWVudSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcblx0XHRjb25zb2xlLmxvZyhcImluaXRTdWJNZW51XCIpXG5cdFx0byA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKTtcblx0XHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJtZW51XCIpO1xuXG5cdFx0XHRcdFx0XHRcblx0fTtcblxuXHR2YXIgc2hvd1N1Yk1lbnUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XG5cdFx0by5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG5cdFx0cy5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG5cblx0XHRvLmNsYXNzTmFtZSA9IG8uY2xhc3NOYW1lICsgXCIgZmFkZS1pblwiO1xuXHRcdHMuY2xhc3NOYW1lID0gcy5jbGFzc05hbWUgKyBcIiBmYWRlLWluXCI7XG5cdH1cblxuXHR2YXIgaGlkZVN1Yk1lbnUgPSBmdW5jdGlvbiAodmlzaWJpbGl0eUhpZGRlbikge1xuXHRcdHMuY2xhc3NOYW1lID0gcy5jbGFzc05hbWUucmVwbGFjZShcImZhZGUtaW5cIiwgXCJmYWRlLW91dFwiKTtcblx0XHRpZih2aXNpYmlsaXR5SGlkZGVuPT09dHJ1ZSl7XG5cdFx0XHRvLmNsYXNzTmFtZSA9IG8uY2xhc3NOYW1lLnJlcGxhY2UoXCJmYWRlLWluXCIsIFwiZmFkZS1vdXRcIik7XG5cdFx0XHRvLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdFx0cy5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblx0XHR9XG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdFN1Yk1lbnU6IGluaXRTdWJNZW51LFxuXHRcdHNob3dTdWJNZW51OiBzaG93U3ViTWVudSxcblx0XHRoaWRlU3ViTWVudTogaGlkZVN1Yk1lbnVcblx0fTtcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNZW51VmlldygpOyIsIi8qIFxuXHRQcm9qZWN0IFZpZXdcblx0LS0tLS0tLS0tLS0tLS0gXG5cdFJlbmRlcnMgVmlldyBvZiBwcm9qZWN0cyAoaW5pdGlhbGl6ZXMgZ2FsbGVyaWVzKVxuKi9cbnZhclx0U2Nyb2xsQ29udHJvbGxlciA9IHJlcXVpcmUoJy4uL2NvbnRyb2xsZXJzL3Njcm9sbC1jb250cm9sbGVyJyk7XG5cbnZhciBQcm9qZWN0VmlldyA9IGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgX2dhbGxlcmllcyA9IG5ldyBBcnJheSgpO1xuXHR2YXIgbGFuZztcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFdQR2xvYnVzLmxhbmd1YWdlICE9IFwiZXNcIiA/IGxhbmcgPSBXUEdsb2J1cy5sYW5ndWFnZSA6IGxhbmc9XCJcIjsgXG5cblx0XHQvL2luaXQgU2Nyb2xsIGNvbnRyb2xsZXJcblx0XHRTY3JvbGxDb250cm9sbGVyLmluaXQoXCJyZWxhdGVkLXBvc3RzXCIpO1xuXG5cdFx0Ly9pbml0IFBhZ2luYXRpb24gTWVudVxuXHRcdF9wYWdpbmF0aW9uTWVudSgpOyBcblxuXHRcdC8vaW5pdCB0aGUgZ2FsbGVyaWVzXG5cdFx0dmFyIGdhbGxlcmllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJnYWxsZXJ5XCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBnYWxsZXJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdF9pbml0R2FsbGVyeShnYWxsZXJpZXNbaV0pO1xuXHRcdH1cblxuXHRcdC8vYWRkIGZ1bmN0aW9uYWxpdHkgdG8gcmVsYXRlZCBwb3N0c1xuXHRcdHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInByb2plY3RcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBsYW5nK2UudGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1ocmVmXCIpKTtcblx0XHRcdH0pOyBcblx0XHR9XG5cdH07XG5cblx0dmFyIF9pbml0R2FsbGVyeSA9IGZ1bmN0aW9uKGdhbGxlcnkpe1x0XHRcblx0XHR2YXIgZ2FsbGVyeSA9IG5ldyBHYWxsZXJ5KGdhbGxlcnkpO1xuXHRcdGdhbGxlcnkuaW5pdCgpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIEdhbGxlcnkoZ2FsbGVyeSl7XG5cblx0XHR0aGlzLnBob3RvcyA9IGdhbGxlcnkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbGxlcnktaXRlbVwiKTtcblx0XHR0aGlzLmN1cnJlbnRQaG90byA9IHRoaXMucGhvdG9zLmxlbmd0aC0xOztcblx0XHR0aGlzLkRPTU9iamVjdCA9IGdhbGxlcnk7XG5cdFx0dGhpcy50aW1lID0gZ2FsbGVyeS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRpbWVcIik7XG5cblx0XHR0aGlzLnRpbWUgPT0gdW5kZWZpbmVkID8gdGhpcy50aW1lID0gMjAwMCA6IHRoaXMudGltZSA9IHRoaXMudGltZSoxMDAwO1xuXG5cdFx0dGhpcy5pbml0ID0gZnVuY3Rpb24oKXtcblx0XHRcdF9nYWxsZXJpZXMucHVzaCh0aGlzKTtcblx0XHRcdHZhciB0aGlzR2FsbGVyeSA9IHRoaXM7XG5cdFx0XHR0aGlzLl9uSW50ZXJ2SWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGlzR2FsbGVyeS5fZmFkZVBob3RvKCk7XG5cdFx0XHR9LCB0aGlzLnRpbWUpO1xuXHRcdH07XG5cblx0XHR0aGlzLl9mYWRlUGhvdG8gPSBmdW5jdGlvbigpe1xuXHRcdFx0aWYgKHRoaXMuY3VycmVudFBob3RvIT0wKXtcblx0XHRcdFx0dGhpcy5waG90b3NbdGhpcy5jdXJyZW50UGhvdG9dLmNsYXNzTmFtZSA9IHRoaXMucGhvdG9zW3RoaXMuY3VycmVudFBob3RvXS5jbGFzc05hbWUgKyBcIiBmYWRlLW91dFwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9TVEVGIE1FSk9SQVI6IHNlIHB1ZWRlIG1lam9yYXIgaGFjaWVuZG8gZmFkZS1pbiBwcmltZXJvIGRlIGxhIHByaW1lcmEgZm90byB5IGx1ZWdvIGRlbCByZXN0byBcdFxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGhvdG9zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5waG90b3NbaV0uY2xhc3NOYW1lID0gdGhpcy5waG90b3NbaV0uY2xhc3NOYW1lLnJlcGxhY2UoXCIgZmFkZS1vdXRcIiwgXCJcIik7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmN1cnJlbnRQaG90byA9PSAwID8gdGhpcy5jdXJyZW50UGhvdG8gPSB0aGlzLnBob3Rvcy5sZW5ndGgtMSA6IHRoaXMuY3VycmVudFBob3RvLS07XG5cdFx0fVxuXHR9XG5cblx0dmFyIGNsZWFyVGhlSW50ZXJ2YWwgPSBmdW5jdGlvbigpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgX2dhbGxlcmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y2xlYXJJbnRlcnZhbChfZ2FsbGVyaWVzW2ldLl9uSW50ZXJ2SWQpO1xuXHRcdH1cblx0fVxuXG5cdC8vU1RFRjogbW92ZSB0byBmdW5jdGlvbnNcblx0dmFyIF9maW5kQW5jZXN0cm9yID0gZnVuY3Rpb24oZWwsIGNscyl7XG5cdFx0d2hpbGUgKChlbCA9IGVsLnBhcmVudEVsZW1lbnQpICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xzKSk7XG5cdFx0cmV0dXJuIGVsO1x0XHRcblx0fVxuXG5cdHZhciBfcGFnaW5hdGlvbk1lbnUgPSBmdW5jdGlvbigpe1xuXG5cdFx0dmFyIHRhcmdldDtcblxuXHRcdGlmIChkb2N1bWVudC5jb250YWlucyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxdWFyZS1wcmV2aW91c1wiKSkpIHtcblxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcXVhcmUtcHJldmlvdXNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRjbGVhclRoZUludGVydmFsKCk7XHRcblx0XHRcdFx0dGFyZ2V0ID0gX2ZpbmRBbmNlc3Ryb3IoZS50YXJnZXQsIFwiY2xpY2thYmxlLXNxdWFyZVwiKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSk7XHRcblx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdH1cblxuXHRcdGlmIChkb2N1bWVudC5jb250YWlucyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxdWFyZS1uZXh0XCIpKSkge1xuXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxdWFyZS1uZXh0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0Y2xlYXJUaGVJbnRlcnZhbCgpO1x0XHRcdFxuXHRcdFx0XHR0YXJnZXQgPSBfZmluZEFuY2VzdHJvcihlLnRhcmdldCwgXCJjbGlja2FibGUtc3F1YXJlXCIpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCB0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1ocmVmXCIpKTtcdFx0XG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHR9XG5cblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcm9sbC11cFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHQvL1NURUYgbW92ZSB0byBmdW5jdGlvbnNcblx0XHRcdChmdW5jdGlvbiBzbW9vdGhzY3JvbGwoKXtcblx0XHRcdCAgICB2YXIgY3VycmVudFNjcm9sbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cdFx0XHQgICAgaWYgKGN1cnJlbnRTY3JvbGwgPiAwKSB7XG5cdFx0XHQgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNtb290aHNjcm9sbCk7XG5cdFx0XHQgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8gKDAsY3VycmVudFNjcm9sbCAtIChjdXJyZW50U2Nyb2xsLzI1KSk7XG5cdFx0XHQgICAgfVxuXHRcdFx0fSkoKTtcdFx0XHRcblx0XHR9LCBmYWxzZSk7XG5cblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdGNsZWFyVGhlSW50ZXJ2YWwgOiBjbGVhclRoZUludGVydmFsXG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQcm9qZWN0VmlldygpOyIsIi8qIFxuXHRwdS1lbnRlIFZpZXdcblx0LS0tLS0tLS0tLS0tLS0gXG5cdFJlbmRlcnMgVmlldyBvZiBwdS1lbnRlIHBhZ2VcbiovXG5cbnZhciBQdWVudGVWaWV3ID0gZnVuY3Rpb24gKCkge1xuXG5cdFxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uIChsYXN0UGFnZSkge1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKFwiaW5pdCBQdWVudGVWaWV3XCIpO1xuXHRcdGxhc3RQYWdlID0gdHlwZW9mIGxhc3RQYWdlICE9PSAndW5kZWZpbmVkJyA/IGxhc3RQYWdlIDogXCIvYS9cIjtcblxuXG5cdFx0Y29uc29sZS5sb2coXCJsYXN0UGFnZSA9IFwiK2xhc3RQYWdlKTtcblxuXHRcdGlmIChsYXN0UGFnZS5pbmRleE9mKFwiL2EvXCIpIT0tMSl7XG5cblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudVwiKS5pbm5lckhUTUwgPSAnPGRpdiBpZD1cImNyb3NzTWVudVwiIGNsYXNzPVwiY3Jvc3MtbWVudSBsZWZ0XCI+PC9kaXY+PCEtLTxkaXYgaWQ9XCJtZW51UmlnaHRcIiBjbGFzcz1cInNxdWFyZS1tZW51IHJpZ2h0XCI+PC9kaXY+LS0+Jztcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVcIikuaW5uZXJIVE1MID0gJzwhLS08ZGl2IGlkPVwibWVudUxlZnRcIiBjbGFzcz1cInNxdWFyZS1tZW51IGxlZnRcIj48L2Rpdj4tLT48ZGl2IGlkPVwiY3Jvc3NNZW51XCIgY2xhc3M9XCJjcm9zcy1tZW51IHJpZ2h0XCI+PC9kaXY+Jztcblx0XHR9XG5cblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUHVlbnRlVmlldygpOyJdfQ==
