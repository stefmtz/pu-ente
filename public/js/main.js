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
	//var prod = "";
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
			    	setTimeout(function(){
						emitter.emit("loadNewPage", req.responseText);
					}, 500);													    
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

		document.body.addEventListener("click", _initBehavior, false);
	};

	var fadeOut = function(){
		document.getElementsByClassName("container-home")[0].className += " fade-out-home";
	};

	var _changeColor = function(el,o,n){
		el.className = el.className.replace(o,n);
	}

	var _initBehavior = function(e){
		e.stopPropagation();

		console.log("click");
		
		var light = document.getElementsByClassName("light");
		var mid = document.getElementsByClassName("mid");
		var dark = document.getElementsByClassName("dark");
		
		light = light[0];
		mid = mid[0];
		dark = dark[0];
		
		_changeColor(dark, "dark", "mid");
		_changeColor(mid, "mid", "light");
		_changeColor(light, "light", "dark");				
	}	

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvbWVudS1jb250cm9sbGVyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3BhZ2UtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9mYWtlX2E1MTQxOTgyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L21hbmFnZXJzL2VtaXR0ZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvbW9kZWxzL3BhZ2UtbW9kZWwuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvZ2FsbGVyeS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL2hvbWVwYWdlLXZpZXcuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvbWVudS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL3Byb2plY3Qtdmlldy5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC92aWV3cy9wdWVudGUtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuXHRNZW51IENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdEdpdmVzIGJlaGF2aW9yIHRvIE1lbnUgZWxlbWVudHNcbiovXG52YXIgcHJvamVjdFZpZXdcdD0gcmVxdWlyZSgnLi4vdmlld3MvcHJvamVjdC12aWV3JyksXG5cdG1lbnVWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvbWVudS12aWV3JylcbjtcblxuXG52YXIgTWVudUNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIHByb2QgPSBcIi9fdGVzdFwiO1xuXHQvL3ZhciBwcm9kID0gXCJcIjtcblx0dmFyIGNhdCwgbGFuZywgbGFzdFBhZ2U7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAobHApIHtcblx0XHRjb25zb2xlLmxvZygnTWVudUNvbnRyb2xsZXInKTtcblxuXHRcdGxhbmcgPSBXUEdsb2J1cy5sYW5ndWFnZSAhPSBcImVzXCIgPyBcIi9cIitXUEdsb2J1cy5sYW5ndWFnZSA6IFwiXCI7IFxuXHRcdGxhc3RQYWdlID0gdHlwZW9mIGxwICE9PSAndW5kZWZpbmVkJyA/IGxwIDogXCIvYS9cIjtcblxuXHRcdGNvbnNvbGUubG9nKFwiaW5pdCBsYXN0UGFnZT1cIitsYXN0UGFnZSk7XG5cdFx0bWVudVZpZXcuaW5pdFN1Yk1lbnUoKTtcblx0XHRfaW5pdE1haW5NZW51KCk7XG5cdFx0X2luaXRTdWJNZW51KCk7XG5cblx0fTtcblxuXHR2YXIgX2luaXRNYWluTWVudSA9IGZ1bmN0aW9uKCl7XG5cblx0XHRjb25zb2xlLmxvZyhcIl9pbml0TWFpbk1lbnUgbGFzdFBhZ2U9XCIrbGFzdFBhZ2UpO1xuXG5cdFx0Y2F0ID0gX2dldENhdCgpO1xuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51UmlnaHRcIikhPT0gbnVsbCl7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVSaWdodFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi9hL1wiKSE9LTEpe1xuXHRcdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIHByb2QrbGFuZytcIi96L1wiKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZW51Vmlldy5zaG93U3ViTWVudSgpO1xuXHRcdFx0XHR9XHRcdFx0XG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fVxuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51TGVmdFwiKSE9PSBudWxsKXtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51TGVmdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0cHJvamVjdFZpZXcuY2xlYXJUaGVJbnRlcnZhbCgpO1xuXHRcdFx0XHRcdGlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCIvYS9cIikhPS0xKXtcblx0XHRcdFx0XHRcdG1lbnVWaWV3LnNob3dTdWJNZW51KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIHByb2QrbGFuZytcIi9hL1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGZhbHNlKTtcblx0XHR9XHRcblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3Jvc3NNZW51XCIpIT09IG51bGwpe1xuXHRcdFx0Y29uc29sZS5sb2coXCJjcm9zc01lbnVcIik7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyb3NzTWVudVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJhbGzDoSB2YW1vcy0tPlwiK3Byb2QrbGFuZytcIi9cIitjYXQrXCIvXCIpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBwcm9kK2xhbmcrXCIvXCIrY2F0K1wiL1wiKTtcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9XG5cblx0fVxuXG5cdHZhciBfaW5pdFN1Yk1lbnUgPSBmdW5jdGlvbigpe1xuXG5cdFx0dmFyIHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWItc2VjdGlvbnNcIik7XG5cdFx0dmFyIGxpcyA9IHVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlcIik7XG5cdFx0dmFyIG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXlcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGlzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0bWVudVZpZXcuaGlkZVN1Yk1lbnUoZmFsc2UpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBwcm9kK2xhbmcrZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1ocmVmXCIpKTtcblx0XHRcdH0pOyBcblx0XHR9XG5cblx0XHRvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdG1lbnVWaWV3LmhpZGVTdWJNZW51KHRydWUpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2dldENhdCgpe1xuXG5cdFx0Y29uc29sZS5sb2coXCJnZXRjYXQgbGFzdFBhZ2U9XCIrbGFzdFBhZ2UpO1xuXHRcdGlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCIvei9cIikhPS0xKXtcblx0XHRcdHJldHVybiBcInpcIjtcblx0XHR9IGVsc2UgaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi9hL1wiKSE9LTEpIHtcblx0XHRcdHJldHVybiBcImFcIjtcblx0XHR9IGVsc2UgaWYobGFzdFBhZ2UuaW5kZXhPZihcIi96L1wiKSAhPS0xKXtcblx0XHRcdHJldHVybiBcInpcIjtcblx0XHR9IGVsc2UgaWYobGFzdFBhZ2UuaW5kZXhPZihcIi9hL1wiKSAhPS0xKXtcblx0XHRcdHJldHVybiBcImFcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFwiYVwiO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNZW51Q29udHJvbGxlcigpOyIsIi8qIFxuXHRQYWdlIENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdERlY2lkZXMgd2hpY2ggdmlld3Mgc2hvdWxkIGJlIHJlbmRlcmVkIGFuZCBtYW5hZ2VzIHNvbWVcblx0Y29tbW9uIHZpZXdzIGJlaGF2aW9ycy5cbiovXG52YXIgSG9tZXBhZ2VWaWV3IFx0XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL2hvbWVwYWdlLXZpZXcnKSxcblx0TWVudUNvbnRyb2xsZXIgXHRcdD0gcmVxdWlyZSgnLi9tZW51LWNvbnRyb2xsZXInKSxcblx0UHJvamVjdFZpZXdcdFx0XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL3Byb2plY3QtdmlldycpLFxuXHRQYWdlTW9kZWxcdFx0XHQ9IHJlcXVpcmUoJy4uL21vZGVscy9wYWdlLW1vZGVsJyksXG5cdEdhbGxlcnlWaWV3XHRcdFx0PSByZXF1aXJlKCcuLi92aWV3cy9nYWxsZXJ5LXZpZXcnKSxcblx0UHVlbnRlVmlld1x0XHRcdD0gcmVxdWlyZSgnLi4vdmlld3MvcHVlbnRlLXZpZXcnKVxuO1xuXG52YXIgUGFnZUNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcblxuXHR2YXIgbGFzdFBhZ2U7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coJ1BhZ2VDb250cm9sbGVyJyk7XG5cblx0XHRfZmFkZUluQ29udGVudCgpO1xuXG5cdFx0ZW1pdHRlci5vbihcImxvYWROZXdQYWdlXCIsIGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0X2xvYWROZXdQYWdlKGRhdGEpO1xuXHRcdH0pO1xuXG5cdFx0ZW1pdHRlci5vbihcInJlcXVlc3ROZXdQYWdlXCIsIGZ1bmN0aW9uKGhyZWYpe1xuXHRcdFx0X2ZhZGVPdXRDb250ZW50KCk7XG5cdFx0XHRsYXN0UGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0X3JlcXVlc3ROZXdQYWdlKGhyZWYpO1xuXHRcdH0pO1xuXG5cdFx0ZW1pdHRlci5vbihcImhvbWVSZXF1ZXN0TmV3UGFnZVwiLCBmdW5jdGlvbihlKXtcblx0XHRcdEhvbWVwYWdlVmlldy5mYWRlT3V0KCk7XG5cdFx0XHRfcmVxdWVzdE5ld1BhZ2UoZS50YXJnZXQuaWQrXCIvXCIsIHRydWUpO1xuXHRcdFx0XG5cdFx0fSk7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdCBcdF9mYWRlT3V0Q29udGVudCgpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRQYWdlTW9kZWwuaW5pdE5ld1BhZ2UoZXZlbnQuc3RhdGUsIGZhbHNlKTtcblx0XHRcdH0sIDEwMDApOyAgXG5cdFx0fSk7XG5cblx0XHRfc2V0Vmlld3MoKTtcblx0fTtcblxuXHR2YXIgX3JlcXVlc3ROZXdQYWdlID0gZnVuY3Rpb24oaHJlZil7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0UGFnZU1vZGVsLmluaXROZXdQYWdlKGhyZWYpO1xuXHRcdH0sIDEwMDApO1xuXHR9XG5cblx0dmFyIF9zZXRWaWV3cyA9IGZ1bmN0aW9uKCl7XG5cblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lLm1hdGNoKC9wYWdlLXB1ZW50ZS8pKXtcblx0XHRcdFB1ZW50ZVZpZXcuaW5pdChsYXN0UGFnZSk7XHRcdFxuXHRcdH1cblx0XHRcblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lLm1hdGNoKC9ob21lcGFnZS8pKXtcblx0XHRcdEhvbWVwYWdlVmlldy5pbml0KCk7XHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEluaXRpYWxpemUgTWVudSBvbmx5IHdoZW4gaXMgbm90IHRoZSBob21lcGFnZS5cblx0XHRcdE1lbnVDb250cm9sbGVyLmluaXQobGFzdFBhZ2UpO1xuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUubWF0Y2goL3NpbmdsZS1wcm9qZWN0Lykpe1xuXHRcdFx0UHJvamVjdFZpZXcuaW5pdCgpO1x0XHRcdFxuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUubWF0Y2goL3BhZ2UtZ2FsbGVyeS8pKXtcblx0XHRcdEdhbGxlcnlWaWV3LmluaXQoKTtcdFx0XG5cdFx0fVxuXHRcdFxuXHR9O1xuXG5cdHZhciBfZmFkZU91dENvbnRlbnQgPSBmdW5jdGlvbigpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lLnJlcGxhY2UoXCJmYWRlLWluLXBhZ2VcIiwgJ2ZhZGUtb3V0LXBhZ2UnKTtcblx0XHR9LCA1MDApO1xuXHRcdHNldFRpbWVvdXQoX3Njcm9sbFRvVG9wLCAxNTAwKTtcblx0fTtcblxuXHR2YXIgX2ZhZGVJbkNvbnRlbnQgPSBmdW5jdGlvbigpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeVwiKS5jbGFzc05hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lLnJlcGxhY2UoXCJmYWRlLW91dFwiLCAnZmFkZS1pbi1wYWdlJyk7XG5cdFx0fSwgNTAwKTtcblx0fTtcblxuXHR2YXIgX2xvYWROZXdQYWdlID0gZnVuY3Rpb24gKGRhdGEpe1xuXHRcdGNvbnNvbGUubG9nKFwiX2xvYWROZXdQYWdlXCIpO1xuXG5cdFx0dmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcblx0XHR2YXIgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhkYXRhLCBcInRleHQvaHRtbFwiKTtcblx0XHRcblx0XHRkb2N1bWVudC50aXRsZSA9IGRvYy50aXRsZTtcblxuXHRcdGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jLmJvZHkuY2xhc3NOYW1lO1xuXHRcdFxuXHRcdGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gZG9jLmJvZHkuaW5uZXJIVE1MO1xuXHRcdF9mYWRlSW5Db250ZW50KCk7XG5cdFx0X3NldFZpZXdzKCk7XG5cdH07XG5cblx0dmFyIF9zY3JvbGxUb1RvcCA9IGZ1bmN0aW9uKCl7XG5cdFx0d2luZG93LnNjcm9sbFRvKDAsIDApO1xuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFBhZ2VDb250cm9sbGVyOyIsIi8qIFxuXHRTY3JvbGwgQ29udHJvbGxlclxuXHQtLS0tLS0tLS0tLS0tLSBcblx0R2l2ZW4gYW4gZWxlbWVudCwgY2hlY2tzIGlmIGl0IGlzIGluc2lkZSB0aGUgdmlldyBvZiB0aGUgdXNlclxuKi9cbnZhciBTY3JvbGxDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG5cblx0dmFyIGVsZW1lbnQ7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoZWxlKSB7XG5cdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZSk7XG5cdFx0X29uU2Nyb2xsaW5nKCk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgX29uU2Nyb2xsaW5nKTtcblxuXHR9O1xuXG5cdHZhciBfb25TY3JvbGxpbmcgPSBmdW5jdGlvbigpe1xuXG5cdFx0aWYgKF9pc1Njcm9sbGVkSW50b1ZpZXcoKSl7XG4gICAgXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIF9vblNjcm9sbGluZyk7XG4gICAgXHRcdF9zaG93RWxlbWVudChlbGVtZW50KTtcbiAgICBcdH1cdFxuXHR9O1xuXG5cblx0dmFyIF9pc1Njcm9sbGVkSW50b1ZpZXcgPSBmdW5jdGlvbigpe1xuXG5cdFx0dmFyIGVsZW1lbnRUb3AgICAgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCxcbiAgICAgICAgZWxlbWVudEJvdHRvbSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tO1xuICAgICAgICBcbiAgICAgICAgLy8gY29udHJvbG8gcXVlIGFsIG1lbm9zIHNlIHZlYW4gMTAwcHggZGVsIGVsZW1lbnRvXG5cdFx0cmV0dXJuIGVsZW1lbnRUb3AgPj0gMCAmJiAoZWxlbWVudFRvcCArIDEwMCkgPD0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdH07XG5cblx0Ly8gU1RFRjogZXN0byB0ZW5kcsOtYSBxdWUgZXN0YXIgZW4gbGEgdmlzdGFcblx0dmFyIF9zaG93RWxlbWVudCA9IGZ1bmN0aW9uKCl7XG5cdFx0ZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZSArIFwiIGZhZGUtaW5cIjsgXHRcdFxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNjcm9sbENvbnRyb2xsZXIoKTsiLCIvKiBcblx0TWFpblxuXHQtLS0tLS0tLS0tLS0tLSBcblx0TWFpbiBzY3JpcHQgb2YgdGhlIEFwcCAtIGluaXRpYWwgZmlsZVxuKi9cbnZhciBQYWdlQ29udHJvbGxlciBcdD0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9wYWdlLWNvbnRyb2xsZXInKSxcblx0RW1pdHRlclx0XHRcdD0gcmVxdWlyZSgnLi9tYW5hZ2Vycy9lbWl0dGVyJylcbjtcblxuXG52YXIgTWFpbkFwcCA9IGZ1bmN0aW9uICgpIHtcblx0Y29uc29sZS5sb2coXCJNYWluQXBwXCIpO1xuXHRlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblx0UGFnZUNvbnRyb2xsZXIuaW5pdCgpO1xufTtcblxuTWFpbkFwcCgpOyIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHRoaXMub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIi8qIFJvdXRlIE1hbmFnZXIgLSBQYWdlIE1vZGVsICovXG5cbnZhciBQYWdlTW9kZWwgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIGluaXROZXdQYWdlID0gZnVuY3Rpb24gKG5ld1BhZ2UsIG51ZXZvKSB7XG5cdFx0Y29uc29sZS5sb2coXCJQYWdlTW9kZWwgaW5pdFwiKTtcblx0XHRcblx0XHRudWV2byA9IHR5cGVvZiBudWV2byAhPT0gJ3VuZGVmaW5lZCcgPyBudWV2byA6IHRydWU7XG5cblx0XHRpZiAoIW5ld1BhZ2Upe1xuXHRcdFx0bmV3UGFnZSA9IFwiXCI7XG5cdFx0fVxuXG5cdFx0aWYgKGhpc3RvcnkucHVzaFN0YXRlKSB7XHRcdFx0XG5cdFx0XHRfcmVxdWVzdFBhZ2UobmV3UGFnZSwgbnVldm8pO1x0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL0JhY2t1cCBzb2x1dGlvbiBmb3Igb2xkIGJyb3dzZXJzLlxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBlLnRhcmdldC5pZCtcIi9cIjtcblx0XHR9XG5cdH07XG5cblx0dmFyIF9yZXF1ZXN0UGFnZSA9IGZ1bmN0aW9uIHJlcXVlc3RQYWdlKGhyZWYsIG51ZXZvKXtcblx0XHRpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KXtcblx0XHRcdGNvbnNvbGUubG9nKFwiX3JlcXVlc3RQYWdlXCIpO1xuXHRcdFx0dmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdFx0cmVxLm9wZW4oXCJHRVRcIiwgaHJlZiwgdHJ1ZSk7XG5cdFx0XHRyZXEub25sb2FkID0gZnVuY3Rpb24oZSl7XG5cdFx0XHQgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0ICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcblx0XHRcdCAgICBcdGlmIChudWV2bz09dHJ1ZSl7XG5cdFx0XHQgICAgXHRcdGhpc3RvcnkucHVzaFN0YXRlKGhyZWYsIFwiXCIsIGhyZWYpO1x0XG5cdFx0XHQgICAgXHR9XG5cdFx0XHQgICAgXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJsb2FkTmV3UGFnZVwiLCByZXEucmVzcG9uc2VUZXh0KTtcblx0XHRcdFx0XHR9LCA1MDApO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgIFxuXHRcdFx0ICAgIH0gZWxzZSB7XHRcdFx0ICAgIFxuXHRcdFx0ICAgICAgY29uc29sZS5lcnJvcihyZXEuc3RhdHVzVGV4dCk7XHRcdFx0ICAgIFxuXHRcdFx0ICAgIH1cblx0XHRcdCAgfVxuXHRcdFx0fTtcblx0XHRcdHJlcS5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdCAgY29uc29sZS5lcnJvcihyZXEuc3RhdHVzVGV4dCk7XG5cdFx0XHR9O1xuXHRcdFx0cmVxLnNlbmQobnVsbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gaHJlZjtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0TmV3UGFnZTogaW5pdE5ld1BhZ2Vcblx0fTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUGFnZU1vZGVsKCk7XG5cbiIsIi8qIFxuXHRHYWxsZXJ5IFZpZXdcblx0LS0tLS0tLS0tLS0tLS0gXG5cdFJlbmRlcnMgVmlldyBvZiBwcm9qZWN0cyBMaXN0IChBLVogZ2FsbGVyaWVzKVxuKi9cbnZhclx0U2Nyb2xsQ29udHJvbGxlciA9IHJlcXVpcmUoJy4uL2NvbnRyb2xsZXJzL3Njcm9sbC1jb250cm9sbGVyJyk7XG5cblxudmFyIEdhbGxlcnlWaWV3ID0gZnVuY3Rpb24gKCkge1xuXG5cdFxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcblx0XHRTY3JvbGxDb250cm9sbGVyLmluaXQoXCJnYWxsZXJ5LXBhZ2luYXRpb25cIik7XG5cdFx0XG5cdFx0dmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHJvamVjdFwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuXHRcdFx0cFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIGUudGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1ocmVmXCIpKTtcblx0XHRcdH0pOyBcblx0XHR9XHRcdFx0XHRcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgR2FsbGVyeVZpZXcoKTsiLCIvKiBcblx0SG9tZSBQYWdlIFZpZXdcblx0LS0tLS0tLS0tLS0tLS0gXG5cdFJlbmRlcnMgSG9tZSBQYWdlIFZpZXdcbiovXG52YXIgSG9tZXBhZ2VWaWV3ID0gZnVuY3Rpb24gKCkge1xuXHRcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKXtcblxuXHRcdGNvbnNvbGUubG9nKCdIb21lcGFnZVZpZXcgaW5pdCcpO1xuXG5cdFx0dmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3F1YXJlXCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwiaG9tZVJlcXVlc3ROZXdQYWdlXCIsIGUpO1xuXHRcdFx0fSk7IFxuXHRcdH1cblxuXHRcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF9pbml0QmVoYXZpb3IsIGZhbHNlKTtcblx0fTtcblxuXHR2YXIgZmFkZU91dCA9IGZ1bmN0aW9uKCl7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRhaW5lci1ob21lXCIpWzBdLmNsYXNzTmFtZSArPSBcIiBmYWRlLW91dC1ob21lXCI7XG5cdH07XG5cblx0dmFyIF9jaGFuZ2VDb2xvciA9IGZ1bmN0aW9uKGVsLG8sbil7XG5cdFx0ZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UobyxuKTtcblx0fVxuXG5cdHZhciBfaW5pdEJlaGF2aW9yID0gZnVuY3Rpb24oZSl7XG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdGNvbnNvbGUubG9nKFwiY2xpY2tcIik7XG5cdFx0XG5cdFx0dmFyIGxpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxpZ2h0XCIpO1xuXHRcdHZhciBtaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibWlkXCIpO1xuXHRcdHZhciBkYXJrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImRhcmtcIik7XG5cdFx0XG5cdFx0bGlnaHQgPSBsaWdodFswXTtcblx0XHRtaWQgPSBtaWRbMF07XG5cdFx0ZGFyayA9IGRhcmtbMF07XG5cdFx0XG5cdFx0X2NoYW5nZUNvbG9yKGRhcmssIFwiZGFya1wiLCBcIm1pZFwiKTtcblx0XHRfY2hhbmdlQ29sb3IobWlkLCBcIm1pZFwiLCBcImxpZ2h0XCIpO1xuXHRcdF9jaGFuZ2VDb2xvcihsaWdodCwgXCJsaWdodFwiLCBcImRhcmtcIik7XHRcdFx0XHRcblx0fVx0XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdGZhZGVPdXQ6IGZhZGVPdXRcdFx0XG5cdH07XG5cdFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgSG9tZXBhZ2VWaWV3OyIsIi8qIFxuXHRNZW51IFZpZXdcblx0LS0tLS0tLS0tLS0tLS0gXG5cdFJlbmRlcnMgVmlldyBvZiBNYWluICYgU3ViIE1lbnVzXG4qL1xuXG52YXIgTWVudVZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cdFxuXHR2YXIgbywgcztcblxuXHR2YXIgaW5pdFN1Yk1lbnUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XG5cdFx0Y29uc29sZS5sb2coXCJpbml0U3ViTWVudVwiKVxuXHRcdG8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXlcIik7XG5cdFx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VibWVudVwiKTtcblxuXHRcdFx0XHRcdFx0XG5cdH07XG5cblx0dmFyIHNob3dTdWJNZW51ID0gZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdG8uc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXHRcdHMuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXG5cdFx0by5jbGFzc05hbWUgPSBvLmNsYXNzTmFtZSArIFwiIGZhZGUtaW5cIjtcblx0XHRzLmNsYXNzTmFtZSA9IHMuY2xhc3NOYW1lICsgXCIgZmFkZS1pblwiO1xuXHR9XG5cblx0dmFyIGhpZGVTdWJNZW51ID0gZnVuY3Rpb24gKHZpc2liaWxpdHlIaWRkZW4pIHtcblx0XHRzLmNsYXNzTmFtZSA9IHMuY2xhc3NOYW1lLnJlcGxhY2UoXCJmYWRlLWluXCIsIFwiZmFkZS1vdXRcIik7XG5cdFx0aWYodmlzaWJpbGl0eUhpZGRlbj09PXRydWUpe1xuXHRcdFx0by5jbGFzc05hbWUgPSBvLmNsYXNzTmFtZS5yZXBsYWNlKFwiZmFkZS1pblwiLCBcImZhZGUtb3V0XCIpO1xuXHRcdFx0by5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblx0XHRcdHMuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0fVxuXHR9XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXRTdWJNZW51OiBpbml0U3ViTWVudSxcblx0XHRzaG93U3ViTWVudTogc2hvd1N1Yk1lbnUsXG5cdFx0aGlkZVN1Yk1lbnU6IGhpZGVTdWJNZW51XG5cdH07XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWVudVZpZXcoKTsiLCIvKiBcblx0UHJvamVjdCBWaWV3XG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRSZW5kZXJzIFZpZXcgb2YgcHJvamVjdHMgKGluaXRpYWxpemVzIGdhbGxlcmllcylcbiovXG52YXJcdFNjcm9sbENvbnRyb2xsZXIgPSByZXF1aXJlKCcuLi9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlcicpO1xuXG52YXIgUHJvamVjdFZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIF9nYWxsZXJpZXMgPSBuZXcgQXJyYXkoKTtcblx0dmFyIGxhbmc7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRXUEdsb2J1cy5sYW5ndWFnZSAhPSBcImVzXCIgPyBsYW5nID0gV1BHbG9idXMubGFuZ3VhZ2UgOiBsYW5nPVwiXCI7IFxuXG5cdFx0Ly9pbml0IFNjcm9sbCBjb250cm9sbGVyXG5cdFx0U2Nyb2xsQ29udHJvbGxlci5pbml0KFwicmVsYXRlZC1wb3N0c1wiKTtcblxuXHRcdC8vaW5pdCBQYWdpbmF0aW9uIE1lbnVcblx0XHRfcGFnaW5hdGlvbk1lbnUoKTsgXG5cblx0XHQvL2luaXQgdGhlIGdhbGxlcmllc1xuXHRcdHZhciBnYWxsZXJpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FsbGVyeVwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZ2FsbGVyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRfaW5pdEdhbGxlcnkoZ2FsbGVyaWVzW2ldKTtcblx0XHR9XG5cblx0XHQvL2FkZCBmdW5jdGlvbmFsaXR5IHRvIHJlbGF0ZWQgcG9zdHNcblx0XHR2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcm9qZWN0XCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgbGFuZytlLnRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSk7XG5cdFx0XHR9KTsgXG5cdFx0fVxuXHR9O1xuXG5cdHZhciBfaW5pdEdhbGxlcnkgPSBmdW5jdGlvbihnYWxsZXJ5KXtcdFx0XG5cdFx0dmFyIGdhbGxlcnkgPSBuZXcgR2FsbGVyeShnYWxsZXJ5KTtcblx0XHRnYWxsZXJ5LmluaXQoKTtcblx0fTtcblxuXHRmdW5jdGlvbiBHYWxsZXJ5KGdhbGxlcnkpe1xuXG5cdFx0dGhpcy5waG90b3MgPSBnYWxsZXJ5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJnYWxsZXJ5LWl0ZW1cIik7XG5cdFx0dGhpcy5jdXJyZW50UGhvdG8gPSB0aGlzLnBob3Rvcy5sZW5ndGgtMTs7XG5cdFx0dGhpcy5ET01PYmplY3QgPSBnYWxsZXJ5O1xuXHRcdHRoaXMudGltZSA9IGdhbGxlcnkuZ2V0QXR0cmlidXRlKFwiZGF0YS10aW1lXCIpO1xuXG5cdFx0dGhpcy50aW1lID09IHVuZGVmaW5lZCA/IHRoaXMudGltZSA9IDIwMDAgOiB0aGlzLnRpbWUgPSB0aGlzLnRpbWUqMTAwMDtcblxuXHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRfZ2FsbGVyaWVzLnB1c2godGhpcyk7XG5cdFx0XHR2YXIgdGhpc0dhbGxlcnkgPSB0aGlzO1xuXHRcdFx0dGhpcy5fbkludGVydklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhpc0dhbGxlcnkuX2ZhZGVQaG90bygpO1xuXHRcdFx0fSwgdGhpcy50aW1lKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5fZmFkZVBob3RvID0gZnVuY3Rpb24oKXtcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRQaG90byE9MCl7XG5cdFx0XHRcdHRoaXMucGhvdG9zW3RoaXMuY3VycmVudFBob3RvXS5jbGFzc05hbWUgPSB0aGlzLnBob3Rvc1t0aGlzLmN1cnJlbnRQaG90b10uY2xhc3NOYW1lICsgXCIgZmFkZS1vdXRcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vU1RFRiBNRUpPUkFSOiBzZSBwdWVkZSBtZWpvcmFyIGhhY2llbmRvIGZhZGUtaW4gcHJpbWVybyBkZSBsYSBwcmltZXJhIGZvdG8geSBsdWVnbyBkZWwgcmVzdG8gXHRcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBob3Rvcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHRoaXMucGhvdG9zW2ldLmNsYXNzTmFtZSA9IHRoaXMucGhvdG9zW2ldLmNsYXNzTmFtZS5yZXBsYWNlKFwiIGZhZGUtb3V0XCIsIFwiXCIpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5jdXJyZW50UGhvdG8gPT0gMCA/IHRoaXMuY3VycmVudFBob3RvID0gdGhpcy5waG90b3MubGVuZ3RoLTEgOiB0aGlzLmN1cnJlbnRQaG90by0tO1xuXHRcdH1cblx0fVxuXG5cdHZhciBjbGVhclRoZUludGVydmFsID0gZnVuY3Rpb24oKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IF9nYWxsZXJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwoX2dhbGxlcmllc1tpXS5fbkludGVydklkKTtcblx0XHR9XG5cdH1cblxuXHQvL1NURUY6IG1vdmUgdG8gZnVuY3Rpb25zXG5cdHZhciBfZmluZEFuY2VzdHJvciA9IGZ1bmN0aW9uKGVsLCBjbHMpe1xuXHRcdHdoaWxlICgoZWwgPSBlbC5wYXJlbnRFbGVtZW50KSAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNscykpO1xuXHRcdHJldHVybiBlbDtcdFx0XG5cdH1cblxuXHR2YXIgX3BhZ2luYXRpb25NZW51ID0gZnVuY3Rpb24oKXtcblxuXHRcdHZhciB0YXJnZXQ7XG5cblx0XHRpZiAoZG9jdW1lbnQuY29udGFpbnMoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcXVhcmUtcHJldmlvdXNcIikpKSB7XG5cblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3F1YXJlLXByZXZpb3VzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0Y2xlYXJUaGVJbnRlcnZhbCgpO1x0XG5cdFx0XHRcdHRhcmdldCA9IF9maW5kQW5jZXN0cm9yKGUudGFyZ2V0LCBcImNsaWNrYWJsZS1zcXVhcmVcIik7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIikpO1x0XG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHR9XG5cblx0XHRpZiAoZG9jdW1lbnQuY29udGFpbnMoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcXVhcmUtbmV4dFwiKSkpIHtcblxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcXVhcmUtbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGNsZWFyVGhlSW50ZXJ2YWwoKTtcdFx0XHRcblx0XHRcdFx0dGFyZ2V0ID0gX2ZpbmRBbmNlc3Ryb3IoZS50YXJnZXQsIFwiY2xpY2thYmxlLXNxdWFyZVwiKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSk7XHRcdFxuXHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0fVxuXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3JvbGwtdXBcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0Ly9TVEVGIG1vdmUgdG8gZnVuY3Rpb25zXG5cdFx0XHQoZnVuY3Rpb24gc21vb3Roc2Nyb2xsKCl7XG5cdFx0XHQgICAgdmFyIGN1cnJlbnRTY3JvbGwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXHRcdFx0ICAgIGlmIChjdXJyZW50U2Nyb2xsID4gMCkge1xuXHRcdFx0ICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzbW9vdGhzY3JvbGwpO1xuXHRcdFx0ICAgICAgICAgd2luZG93LnNjcm9sbFRvICgwLGN1cnJlbnRTY3JvbGwgLSAoY3VycmVudFNjcm9sbC8yNSkpO1xuXHRcdFx0ICAgIH1cblx0XHRcdH0pKCk7XHRcdFx0XG5cdFx0fSwgZmFsc2UpO1xuXG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRjbGVhclRoZUludGVydmFsIDogY2xlYXJUaGVJbnRlcnZhbFxuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUHJvamVjdFZpZXcoKTsiLCIvKiBcblx0cHUtZW50ZSBWaWV3XG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRSZW5kZXJzIFZpZXcgb2YgcHUtZW50ZSBwYWdlXG4qL1xuXG52YXIgUHVlbnRlVmlldyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAobGFzdFBhZ2UpIHtcblx0XHRcblx0XHRjb25zb2xlLmxvZyhcImluaXQgUHVlbnRlVmlld1wiKTtcblx0XHRsYXN0UGFnZSA9IHR5cGVvZiBsYXN0UGFnZSAhPT0gJ3VuZGVmaW5lZCcgPyBsYXN0UGFnZSA6IFwiL2EvXCI7XG5cblxuXHRcdGNvbnNvbGUubG9nKFwibGFzdFBhZ2UgPSBcIitsYXN0UGFnZSk7XG5cblx0XHRpZiAobGFzdFBhZ2UuaW5kZXhPZihcIi9hL1wiKSE9LTEpe1xuXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lbnVcIikuaW5uZXJIVE1MID0gJzxkaXYgaWQ9XCJjcm9zc01lbnVcIiBjbGFzcz1cImNyb3NzLW1lbnUgbGVmdFwiPjwvZGl2PjwhLS08ZGl2IGlkPVwibWVudVJpZ2h0XCIgY2xhc3M9XCJzcXVhcmUtbWVudSByaWdodFwiPjwvZGl2Pi0tPic7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51XCIpLmlubmVySFRNTCA9ICc8IS0tPGRpdiBpZD1cIm1lbnVMZWZ0XCIgY2xhc3M9XCJzcXVhcmUtbWVudSBsZWZ0XCI+PC9kaXY+LS0+PGRpdiBpZD1cImNyb3NzTWVudVwiIGNsYXNzPVwiY3Jvc3MtbWVudSByaWdodFwiPjwvZGl2Pic7XG5cdFx0fVxuXG5cdH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFB1ZW50ZVZpZXcoKTsiXX0=
