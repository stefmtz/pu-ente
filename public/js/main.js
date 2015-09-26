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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvY29udHJvbGxlcnMvbWVudS1jb250cm9sbGVyLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3BhZ2UtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC9mYWtlX2EyYTI4ZjViLmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L21hbmFnZXJzL2VtaXR0ZXIuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvbW9kZWxzL3BhZ2UtbW9kZWwuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvZ2FsbGVyeS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL2hvbWVwYWdlLXZpZXcuanMiLCIvVXNlcnMvU3RlZi9TaXRlcy9wdS1lbnRlL190ZXN0L3dwLWNvbnRlbnQvdGhlbWVzL3B1LWVudGUvc291cmNlL2phdmFzY3JpcHQvdmlld3MvbWVudS12aWV3LmpzIiwiL1VzZXJzL1N0ZWYvU2l0ZXMvcHUtZW50ZS9fdGVzdC93cC1jb250ZW50L3RoZW1lcy9wdS1lbnRlL3NvdXJjZS9qYXZhc2NyaXB0L3ZpZXdzL3Byb2plY3Qtdmlldy5qcyIsIi9Vc2Vycy9TdGVmL1NpdGVzL3B1LWVudGUvX3Rlc3Qvd3AtY29udGVudC90aGVtZXMvcHUtZW50ZS9zb3VyY2UvamF2YXNjcmlwdC92aWV3cy9wdWVudGUtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuXHRNZW51IENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdEdpdmVzIGJlaGF2aW9yIHRvIE1lbnUgZWxlbWVudHNcbiovXG52YXIgcHJvamVjdFZpZXdcdD0gcmVxdWlyZSgnLi4vdmlld3MvcHJvamVjdC12aWV3JyksXG5cdG1lbnVWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvbWVudS12aWV3JylcbjtcblxuXG52YXIgTWVudUNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIHByb2QgPSBcIi9fdGVzdFwiO1xuXHR2YXIgcHJvZCA9IFwiXCI7XG5cdHZhciBjYXQsIGxhbmcsIGxhc3RQYWdlO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKGxwKSB7XG5cdFx0Y29uc29sZS5sb2coJ01lbnVDb250cm9sbGVyJyk7XG5cblx0XHRsYW5nID0gV1BHbG9idXMubGFuZ3VhZ2UgIT0gXCJlc1wiID8gXCIvXCIrV1BHbG9idXMubGFuZ3VhZ2UgOiBcIlwiOyBcblx0XHRsYXN0UGFnZSA9IHR5cGVvZiBscCAhPT0gJ3VuZGVmaW5lZCcgPyBscCA6IFwiL2EvXCI7XG5cblx0XHRjb25zb2xlLmxvZyhcImluaXQgbGFzdFBhZ2U9XCIrbGFzdFBhZ2UpO1xuXHRcdG1lbnVWaWV3LmluaXRTdWJNZW51KCk7XG5cdFx0X2luaXRNYWluTWVudSgpO1xuXHRcdF9pbml0U3ViTWVudSgpO1xuXG5cdH07XG5cblx0dmFyIF9pbml0TWFpbk1lbnUgPSBmdW5jdGlvbigpe1xuXG5cdFx0Y29uc29sZS5sb2coXCJfaW5pdE1haW5NZW51IGxhc3RQYWdlPVwiK2xhc3RQYWdlKTtcblxuXHRcdGNhdCA9IF9nZXRDYXQoKTtcblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudVJpZ2h0XCIpIT09IG51bGwpe1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51UmlnaHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRwcm9qZWN0Vmlldy5jbGVhclRoZUludGVydmFsKCk7XG5cdFx0XHRcdGlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCIvYS9cIikhPS0xKXtcblx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBwcm9kK2xhbmcrXCIvei9cIik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudVZpZXcuc2hvd1N1Yk1lbnUoKTtcblx0XHRcdFx0fVx0XHRcdFxuXHRcdFx0fSwgZmFsc2UpO1xuXHRcdH1cblxuXHRcdGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudUxlZnRcIikhPT0gbnVsbCl7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudUxlZnRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdHByb2plY3RWaWV3LmNsZWFyVGhlSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL2EvXCIpIT0tMSl7XG5cdFx0XHRcdFx0XHRtZW51Vmlldy5zaG93U3ViTWVudSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBwcm9kK2xhbmcrXCIvYS9cIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0fVx0XG5cblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyb3NzTWVudVwiKSE9PSBudWxsKXtcblx0XHRcdGNvbnNvbGUubG9nKFwiY3Jvc3NNZW51XCIpO1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcm9zc01lbnVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRwcm9qZWN0Vmlldy5jbGVhclRoZUludGVydmFsKCk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiYWxsw6EgdmFtb3MtLT5cIitwcm9kK2xhbmcrXCIvXCIrY2F0K1wiL1wiKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgcHJvZCtsYW5nK1wiL1wiK2NhdCtcIi9cIik7XG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fVxuXG5cdH1cblxuXHR2YXIgX2luaXRTdWJNZW51ID0gZnVuY3Rpb24oKXtcblxuXHRcdHZhciB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3ViLXNlY3Rpb25zXCIpO1xuXHRcdHZhciBsaXMgPSB1bC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpXCIpO1xuXHRcdHZhciBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5XCIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxpc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdG1lbnVWaWV3LmhpZGVTdWJNZW51KGZhbHNlKTtcblx0XHRcdFx0ZW1pdHRlci5lbWl0KFwicmVxdWVzdE5ld1BhZ2VcIiwgcHJvZCtsYW5nK2UudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSk7XG5cdFx0XHR9KTsgXG5cdFx0fVxuXG5cdFx0b3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRtZW51Vmlldy5oaWRlU3ViTWVudSh0cnVlKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9nZXRDYXQoKXtcblxuXHRcdGNvbnNvbGUubG9nKFwiZ2V0Y2F0IGxhc3RQYWdlPVwiK2xhc3RQYWdlKTtcblx0XHRpZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL3ovXCIpIT0tMSl7XG5cdFx0XHRyZXR1cm4gXCJ6XCI7XG5cdFx0fSBlbHNlIGlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCIvYS9cIikhPS0xKSB7XG5cdFx0XHRyZXR1cm4gXCJhXCI7XG5cdFx0fSBlbHNlIGlmKGxhc3RQYWdlLmluZGV4T2YoXCIvei9cIikgIT0tMSl7XG5cdFx0XHRyZXR1cm4gXCJ6XCI7XG5cdFx0fSBlbHNlIGlmKGxhc3RQYWdlLmluZGV4T2YoXCIvYS9cIikgIT0tMSl7XG5cdFx0XHRyZXR1cm4gXCJhXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBcImFcIjtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWVudUNvbnRyb2xsZXIoKTsiLCIvKiBcblx0UGFnZSBDb250cm9sbGVyXG5cdC0tLS0tLS0tLS0tLS0tIFxuXHREZWNpZGVzIHdoaWNoIHZpZXdzIHNob3VsZCBiZSByZW5kZXJlZCBhbmQgbWFuYWdlcyBzb21lXG5cdGNvbW1vbiB2aWV3cyBiZWhhdmlvcnMuXG4qL1xudmFyIEhvbWVwYWdlVmlldyBcdFx0PSByZXF1aXJlKCcuLi92aWV3cy9ob21lcGFnZS12aWV3JyksXG5cdE1lbnVDb250cm9sbGVyIFx0XHQ9IHJlcXVpcmUoJy4vbWVudS1jb250cm9sbGVyJyksXG5cdFByb2plY3RWaWV3XHRcdFx0PSByZXF1aXJlKCcuLi92aWV3cy9wcm9qZWN0LXZpZXcnKSxcblx0UGFnZU1vZGVsXHRcdFx0PSByZXF1aXJlKCcuLi9tb2RlbHMvcGFnZS1tb2RlbCcpLFxuXHRHYWxsZXJ5Vmlld1x0XHRcdD0gcmVxdWlyZSgnLi4vdmlld3MvZ2FsbGVyeS12aWV3JyksXG5cdFB1ZW50ZVZpZXdcdFx0XHQ9IHJlcXVpcmUoJy4uL3ZpZXdzL3B1ZW50ZS12aWV3JylcbjtcblxudmFyIFBhZ2VDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG5cblx0dmFyIGxhc3RQYWdlO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUubG9nKCdQYWdlQ29udHJvbGxlcicpO1xuXG5cdFx0X2ZhZGVJbkNvbnRlbnQoKTtcblxuXHRcdGVtaXR0ZXIub24oXCJsb2FkTmV3UGFnZVwiLCBmdW5jdGlvbihkYXRhKXtcblx0XHRcdF9sb2FkTmV3UGFnZShkYXRhKTtcblx0XHR9KTtcblxuXHRcdGVtaXR0ZXIub24oXCJyZXF1ZXN0TmV3UGFnZVwiLCBmdW5jdGlvbihocmVmKXtcblx0XHRcdF9mYWRlT3V0Q29udGVudCgpO1xuXHRcdFx0bGFzdFBhZ2UgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdF9yZXF1ZXN0TmV3UGFnZShocmVmKTtcblx0XHR9KTtcblxuXHRcdGVtaXR0ZXIub24oXCJob21lUmVxdWVzdE5ld1BhZ2VcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRIb21lcGFnZVZpZXcuZmFkZU91dCgpO1xuXHRcdFx0X3JlcXVlc3ROZXdQYWdlKGUudGFyZ2V0LmlkK1wiL1wiLCB0cnVlKTtcblx0XHRcdFxuXHRcdH0pO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQgXHRfZmFkZU91dENvbnRlbnQoKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0UGFnZU1vZGVsLmluaXROZXdQYWdlKGV2ZW50LnN0YXRlLCBmYWxzZSk7XG5cdFx0XHR9LCAxMDAwKTsgIFxuXHRcdH0pO1xuXG5cdFx0X3NldFZpZXdzKCk7XG5cdH07XG5cblx0dmFyIF9yZXF1ZXN0TmV3UGFnZSA9IGZ1bmN0aW9uKGhyZWYpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFBhZ2VNb2RlbC5pbml0TmV3UGFnZShocmVmKTtcblx0XHR9LCAxMDAwKTtcblx0fVxuXG5cdHZhciBfc2V0Vmlld3MgPSBmdW5jdGlvbigpe1xuXG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvcGFnZS1wdWVudGUvKSl7XG5cdFx0XHRQdWVudGVWaWV3LmluaXQobGFzdFBhZ2UpO1x0XHRcblx0XHR9XG5cdFx0XG5cdFx0aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5tYXRjaCgvaG9tZXBhZ2UvKSl7XG5cdFx0XHRIb21lcGFnZVZpZXcuaW5pdCgpO1x0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBJbml0aWFsaXplIE1lbnUgb25seSB3aGVuIGlzIG5vdCB0aGUgaG9tZXBhZ2UuXG5cdFx0XHRNZW51Q29udHJvbGxlci5pbml0KGxhc3RQYWdlKTtcblx0XHR9XG5cblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lLm1hdGNoKC9zaW5nbGUtcHJvamVjdC8pKXtcblx0XHRcdFByb2plY3RWaWV3LmluaXQoKTtcdFx0XHRcblx0XHR9XG5cblx0XHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lLm1hdGNoKC9wYWdlLWdhbGxlcnkvKSl7XG5cdFx0XHRHYWxsZXJ5Vmlldy5pbml0KCk7XHRcdFxuXHRcdH1cblx0XHRcblx0fTtcblxuXHR2YXIgX2ZhZGVPdXRDb250ZW50ID0gZnVuY3Rpb24oKXtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5yZXBsYWNlKFwiZmFkZS1pbi1wYWdlXCIsICdmYWRlLW91dC1wYWdlJyk7XG5cdFx0fSwgNTAwKTtcblx0XHRzZXRUaW1lb3V0KF9zY3JvbGxUb1RvcCwgMTUwMCk7XG5cdH07XG5cblx0dmFyIF9mYWRlSW5Db250ZW50ID0gZnVuY3Rpb24oKXtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByaW1hcnlcIikuY2xhc3NOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmltYXJ5XCIpLmNsYXNzTmFtZS5yZXBsYWNlKFwiZmFkZS1vdXRcIiwgJ2ZhZGUtaW4tcGFnZScpO1xuXHRcdH0sIDUwMCk7XG5cdH07XG5cblx0dmFyIF9sb2FkTmV3UGFnZSA9IGZ1bmN0aW9uIChkYXRhKXtcblx0XHRjb25zb2xlLmxvZyhcIl9sb2FkTmV3UGFnZVwiKTtcblxuXHRcdHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cdFx0dmFyIGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoZGF0YSwgXCJ0ZXh0L2h0bWxcIik7XG5cdFx0XG5cdFx0ZG9jdW1lbnQudGl0bGUgPSBkb2MudGl0bGU7XG5cblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvYy5ib2R5LmNsYXNzTmFtZTtcblx0XHRcblx0XHRkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IGRvYy5ib2R5LmlubmVySFRNTDtcblx0XHRfZmFkZUluQ29udGVudCgpO1xuXHRcdF9zZXRWaWV3cygpO1xuXHR9O1xuXG5cdHZhciBfc2Nyb2xsVG9Ub3AgPSBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQYWdlQ29udHJvbGxlcjsiLCIvKiBcblx0U2Nyb2xsIENvbnRyb2xsZXJcblx0LS0tLS0tLS0tLS0tLS0gXG5cdEdpdmVuIGFuIGVsZW1lbnQsIGNoZWNrcyBpZiBpdCBpcyBpbnNpZGUgdGhlIHZpZXcgb2YgdGhlIHVzZXJcbiovXG52YXIgU2Nyb2xsQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciBlbGVtZW50O1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKGVsZSkge1xuXHRcdGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGUpO1xuXHRcdF9vblNjcm9sbGluZygpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIF9vblNjcm9sbGluZyk7XG5cblx0fTtcblxuXHR2YXIgX29uU2Nyb2xsaW5nID0gZnVuY3Rpb24oKXtcblxuXHRcdGlmIChfaXNTY3JvbGxlZEludG9WaWV3KCkpe1xuICAgIFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBfb25TY3JvbGxpbmcpO1xuICAgIFx0XHRfc2hvd0VsZW1lbnQoZWxlbWVudCk7XG4gICAgXHR9XHRcblx0fTtcblxuXG5cdHZhciBfaXNTY3JvbGxlZEludG9WaWV3ID0gZnVuY3Rpb24oKXtcblxuXHRcdHZhciBlbGVtZW50VG9wICAgID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AsXG4gICAgICAgIGVsZW1lbnRCb3R0b20gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnRyb2xvIHF1ZSBhbCBtZW5vcyBzZSB2ZWFuIDEwMHB4IGRlbCBlbGVtZW50b1xuXHRcdHJldHVybiBlbGVtZW50VG9wID49IDAgJiYgKGVsZW1lbnRUb3AgKyAxMDApIDw9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHR9O1xuXG5cdC8vIFNURUY6IGVzdG8gdGVuZHLDrWEgcXVlIGVzdGFyIGVuIGxhIHZpc3RhXG5cdHZhciBfc2hvd0VsZW1lbnQgPSBmdW5jdGlvbigpe1xuXHRcdGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUgKyBcIiBmYWRlLWluXCI7IFx0XHRcblx0fTtcblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTY3JvbGxDb250cm9sbGVyKCk7IiwiLyogXG5cdE1haW5cblx0LS0tLS0tLS0tLS0tLS0gXG5cdE1haW4gc2NyaXB0IG9mIHRoZSBBcHAgLSBpbml0aWFsIGZpbGVcbiovXG52YXIgUGFnZUNvbnRyb2xsZXIgXHQ9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcGFnZS1jb250cm9sbGVyJyksXG5cdEVtaXR0ZXJcdFx0XHQ9IHJlcXVpcmUoJy4vbWFuYWdlcnMvZW1pdHRlcicpXG47XG5cblxudmFyIE1haW5BcHAgPSBmdW5jdGlvbiAoKSB7XG5cdGNvbnNvbGUubG9nKFwiTWFpbkFwcFwiKTtcblx0ZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cdFBhZ2VDb250cm9sbGVyLmluaXQoKTtcbn07XG5cbk1haW5BcHAoKTsiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICBmdW5jdGlvbiBvbigpIHtcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCIvKiBSb3V0ZSBNYW5hZ2VyIC0gUGFnZSBNb2RlbCAqL1xuXG52YXIgUGFnZU1vZGVsID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBpbml0TmV3UGFnZSA9IGZ1bmN0aW9uIChuZXdQYWdlLCBudWV2bykge1xuXHRcdGNvbnNvbGUubG9nKFwiUGFnZU1vZGVsIGluaXRcIik7XG5cdFx0XG5cdFx0bnVldm8gPSB0eXBlb2YgbnVldm8gIT09ICd1bmRlZmluZWQnID8gbnVldm8gOiB0cnVlO1xuXG5cdFx0aWYgKCFuZXdQYWdlKXtcblx0XHRcdG5ld1BhZ2UgPSBcIlwiO1xuXHRcdH1cblxuXHRcdGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkge1x0XHRcdFxuXHRcdFx0X3JlcXVlc3RQYWdlKG5ld1BhZ2UsIG51ZXZvKTtcdFx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9CYWNrdXAgc29sdXRpb24gZm9yIG9sZCBicm93c2Vycy5cblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZS50YXJnZXQuaWQrXCIvXCI7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBfcmVxdWVzdFBhZ2UgPSBmdW5jdGlvbiByZXF1ZXN0UGFnZShocmVmLCBudWV2byl7XG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIl9yZXF1ZXN0UGFnZVwiKTtcblx0XHRcdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHJlcS5vcGVuKFwiR0VUXCIsIGhyZWYsIHRydWUpO1xuXHRcdFx0cmVxLm9ubG9hZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0ICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdCAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHQgICAgXHRpZiAobnVldm89PXRydWUpe1xuXHRcdFx0ICAgIFx0XHRoaXN0b3J5LnB1c2hTdGF0ZShocmVmLCBcIlwiLCBocmVmKTtcdFxuXHRcdFx0ICAgIFx0fVxuXHRcdFx0ICAgIFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0ZW1pdHRlci5lbWl0KFwibG9hZE5ld1BhZ2VcIiwgcmVxLnJlc3BvbnNlVGV4dCk7XG5cdFx0XHRcdFx0fSwgNTAwKTtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgICBcblx0XHRcdCAgICB9IGVsc2Uge1x0XHRcdCAgICBcblx0XHRcdCAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1c1RleHQpO1x0XHRcdCAgICBcblx0XHRcdCAgICB9XG5cdFx0XHQgIH1cblx0XHRcdH07XG5cdFx0XHRyZXEub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHQgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1c1RleHQpO1xuXHRcdFx0fTtcblx0XHRcdHJlcS5zZW5kKG51bGwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGhyZWY7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdE5ld1BhZ2U6IGluaXROZXdQYWdlXG5cdH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFBhZ2VNb2RlbCgpO1xuXG4iLCIvKiBcblx0R2FsbGVyeSBWaWV3XG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRSZW5kZXJzIFZpZXcgb2YgcHJvamVjdHMgTGlzdCAoQS1aIGdhbGxlcmllcylcbiovXG52YXJcdFNjcm9sbENvbnRyb2xsZXIgPSByZXF1aXJlKCcuLi9jb250cm9sbGVycy9zY3JvbGwtY29udHJvbGxlcicpO1xuXG5cbnZhciBHYWxsZXJ5VmlldyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XG5cdFx0U2Nyb2xsQ29udHJvbGxlci5pbml0KFwiZ2FsbGVyeS1wYWdpbmF0aW9uXCIpO1xuXHRcdFxuXHRcdHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInByb2plY3RcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCBlLnRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSk7XG5cdFx0XHR9KTsgXG5cdFx0fVx0XHRcdFx0XG5cdH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEdhbGxlcnlWaWV3KCk7IiwiLyogXG5cdEhvbWUgUGFnZSBWaWV3XG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRSZW5kZXJzIEhvbWUgUGFnZSBWaWV3XG4qL1xudmFyIEhvbWVwYWdlVmlldyA9IGZ1bmN0aW9uICgpIHtcblx0XG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCl7XG5cblx0XHRjb25zb2xlLmxvZygnSG9tZXBhZ2VWaWV3IGluaXQnKTtcblxuXHRcdHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNxdWFyZVwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcImhvbWVSZXF1ZXN0TmV3UGFnZVwiLCBlKTtcblx0XHRcdH0pOyBcblx0XHR9XG5cblx0XHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBfaW5pdEJlaGF2aW9yLCBmYWxzZSk7XG5cdH07XG5cblx0dmFyIGZhZGVPdXQgPSBmdW5jdGlvbigpe1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb250YWluZXItaG9tZVwiKVswXS5jbGFzc05hbWUgKz0gXCIgZmFkZS1vdXQtaG9tZVwiO1xuXHR9O1xuXG5cdHZhciBfY2hhbmdlQ29sb3IgPSBmdW5jdGlvbihlbCxvLG4pe1xuXHRcdGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKG8sbik7XG5cdH1cblxuXHR2YXIgX2luaXRCZWhhdmlvciA9IGZ1bmN0aW9uKGUpe1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRjb25zb2xlLmxvZyhcImNsaWNrXCIpO1xuXHRcdFxuXHRcdHZhciBsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsaWdodFwiKTtcblx0XHR2YXIgbWlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1pZFwiKTtcblx0XHR2YXIgZGFyayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJkYXJrXCIpO1xuXHRcdFxuXHRcdGxpZ2h0ID0gbGlnaHRbMF07XG5cdFx0bWlkID0gbWlkWzBdO1xuXHRcdGRhcmsgPSBkYXJrWzBdO1xuXHRcdFxuXHRcdF9jaGFuZ2VDb2xvcihkYXJrLCBcImRhcmtcIiwgXCJtaWRcIik7XG5cdFx0X2NoYW5nZUNvbG9yKG1pZCwgXCJtaWRcIiwgXCJsaWdodFwiKTtcblx0XHRfY2hhbmdlQ29sb3IobGlnaHQsIFwibGlnaHRcIiwgXCJkYXJrXCIpO1x0XHRcdFx0XG5cdH1cdFxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRmYWRlT3V0OiBmYWRlT3V0XHRcdFxuXHR9O1xuXHRcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEhvbWVwYWdlVmlldzsiLCIvKiBcblx0TWVudSBWaWV3XG5cdC0tLS0tLS0tLS0tLS0tIFxuXHRSZW5kZXJzIFZpZXcgb2YgTWFpbiAmIFN1YiBNZW51c1xuKi9cblxudmFyIE1lbnVWaWV3ID0gZnVuY3Rpb24gKCkge1xuXHRcblx0dmFyIG8sIHM7XG5cblx0dmFyIGluaXRTdWJNZW51ID0gZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKFwiaW5pdFN1Yk1lbnVcIilcblx0XHRvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5XCIpO1xuXHRcdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1lbnVcIik7XG5cblx0XHRcdFx0XHRcdFxuXHR9O1xuXG5cdHZhciBzaG93U3ViTWVudSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcblx0XHRvLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcblx0XHRzLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcblxuXHRcdG8uY2xhc3NOYW1lID0gby5jbGFzc05hbWUgKyBcIiBmYWRlLWluXCI7XG5cdFx0cy5jbGFzc05hbWUgPSBzLmNsYXNzTmFtZSArIFwiIGZhZGUtaW5cIjtcblx0fVxuXG5cdHZhciBoaWRlU3ViTWVudSA9IGZ1bmN0aW9uICh2aXNpYmlsaXR5SGlkZGVuKSB7XG5cdFx0cy5jbGFzc05hbWUgPSBzLmNsYXNzTmFtZS5yZXBsYWNlKFwiZmFkZS1pblwiLCBcImZhZGUtb3V0XCIpO1xuXHRcdGlmKHZpc2liaWxpdHlIaWRkZW49PT10cnVlKXtcblx0XHRcdG8uY2xhc3NOYW1lID0gby5jbGFzc05hbWUucmVwbGFjZShcImZhZGUtaW5cIiwgXCJmYWRlLW91dFwiKTtcblx0XHRcdG8uc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0XHRzLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdH1cblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0U3ViTWVudTogaW5pdFN1Yk1lbnUsXG5cdFx0c2hvd1N1Yk1lbnU6IHNob3dTdWJNZW51LFxuXHRcdGhpZGVTdWJNZW51OiBoaWRlU3ViTWVudVxuXHR9O1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IE1lbnVWaWV3KCk7IiwiLyogXG5cdFByb2plY3QgVmlld1xuXHQtLS0tLS0tLS0tLS0tLSBcblx0UmVuZGVycyBWaWV3IG9mIHByb2plY3RzIChpbml0aWFsaXplcyBnYWxsZXJpZXMpXG4qL1xudmFyXHRTY3JvbGxDb250cm9sbGVyID0gcmVxdWlyZSgnLi4vY29udHJvbGxlcnMvc2Nyb2xsLWNvbnRyb2xsZXInKTtcblxudmFyIFByb2plY3RWaWV3ID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBfZ2FsbGVyaWVzID0gbmV3IEFycmF5KCk7XG5cdHZhciBsYW5nO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0V1BHbG9idXMubGFuZ3VhZ2UgIT0gXCJlc1wiID8gbGFuZyA9IFdQR2xvYnVzLmxhbmd1YWdlIDogbGFuZz1cIlwiOyBcblxuXHRcdC8vaW5pdCBTY3JvbGwgY29udHJvbGxlclxuXHRcdFNjcm9sbENvbnRyb2xsZXIuaW5pdChcInJlbGF0ZWQtcG9zdHNcIik7XG5cblx0XHQvL2luaXQgUGFnaW5hdGlvbiBNZW51XG5cdFx0X3BhZ2luYXRpb25NZW51KCk7IFxuXG5cdFx0Ly9pbml0IHRoZSBnYWxsZXJpZXNcblx0XHR2YXIgZ2FsbGVyaWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbGxlcnlcIik7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGdhbGxlcmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0X2luaXRHYWxsZXJ5KGdhbGxlcmllc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly9hZGQgZnVuY3Rpb25hbGl0eSB0byByZWxhdGVkIHBvc3RzXG5cdFx0dmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHJvamVjdFwiKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuXHRcdFx0cFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIGxhbmcrZS50YXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIikpO1xuXHRcdFx0fSk7IFxuXHRcdH1cblx0fTtcblxuXHR2YXIgX2luaXRHYWxsZXJ5ID0gZnVuY3Rpb24oZ2FsbGVyeSl7XHRcdFxuXHRcdHZhciBnYWxsZXJ5ID0gbmV3IEdhbGxlcnkoZ2FsbGVyeSk7XG5cdFx0Z2FsbGVyeS5pbml0KCk7XG5cdH07XG5cblx0ZnVuY3Rpb24gR2FsbGVyeShnYWxsZXJ5KXtcblxuXHRcdHRoaXMucGhvdG9zID0gZ2FsbGVyeS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ2FsbGVyeS1pdGVtXCIpO1xuXHRcdHRoaXMuY3VycmVudFBob3RvID0gdGhpcy5waG90b3MubGVuZ3RoLTE7O1xuXHRcdHRoaXMuRE9NT2JqZWN0ID0gZ2FsbGVyeTtcblx0XHR0aGlzLnRpbWUgPSBnYWxsZXJ5LmdldEF0dHJpYnV0ZShcImRhdGEtdGltZVwiKTtcblxuXHRcdHRoaXMudGltZSA9PSB1bmRlZmluZWQgPyB0aGlzLnRpbWUgPSAyMDAwIDogdGhpcy50aW1lID0gdGhpcy50aW1lKjEwMDA7XG5cblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbigpe1xuXHRcdFx0X2dhbGxlcmllcy5wdXNoKHRoaXMpO1xuXHRcdFx0dmFyIHRoaXNHYWxsZXJ5ID0gdGhpcztcblx0XHRcdHRoaXMuX25JbnRlcnZJZCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHRoaXNHYWxsZXJ5Ll9mYWRlUGhvdG8oKTtcblx0XHRcdH0sIHRoaXMudGltZSk7XG5cdFx0fTtcblxuXHRcdHRoaXMuX2ZhZGVQaG90byA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5jdXJyZW50UGhvdG8hPTApe1xuXHRcdFx0XHR0aGlzLnBob3Rvc1t0aGlzLmN1cnJlbnRQaG90b10uY2xhc3NOYW1lID0gdGhpcy5waG90b3NbdGhpcy5jdXJyZW50UGhvdG9dLmNsYXNzTmFtZSArIFwiIGZhZGUtb3V0XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL1NURUYgTUVKT1JBUjogc2UgcHVlZGUgbWVqb3JhciBoYWNpZW5kbyBmYWRlLWluIHByaW1lcm8gZGUgbGEgcHJpbWVyYSBmb3RvIHkgbHVlZ28gZGVsIHJlc3RvIFx0XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5waG90b3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR0aGlzLnBob3Rvc1tpXS5jbGFzc05hbWUgPSB0aGlzLnBob3Rvc1tpXS5jbGFzc05hbWUucmVwbGFjZShcIiBmYWRlLW91dFwiLCBcIlwiKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHRoaXMuY3VycmVudFBob3RvID09IDAgPyB0aGlzLmN1cnJlbnRQaG90byA9IHRoaXMucGhvdG9zLmxlbmd0aC0xIDogdGhpcy5jdXJyZW50UGhvdG8tLTtcblx0XHR9XG5cdH1cblxuXHR2YXIgY2xlYXJUaGVJbnRlcnZhbCA9IGZ1bmN0aW9uKCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBfZ2FsbGVyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjbGVhckludGVydmFsKF9nYWxsZXJpZXNbaV0uX25JbnRlcnZJZCk7XG5cdFx0fVxuXHR9XG5cblx0Ly9TVEVGOiBtb3ZlIHRvIGZ1bmN0aW9uc1xuXHR2YXIgX2ZpbmRBbmNlc3Ryb3IgPSBmdW5jdGlvbihlbCwgY2xzKXtcblx0XHR3aGlsZSAoKGVsID0gZWwucGFyZW50RWxlbWVudCkgJiYgIWVsLmNsYXNzTGlzdC5jb250YWlucyhjbHMpKTtcblx0XHRyZXR1cm4gZWw7XHRcdFxuXHR9XG5cblx0dmFyIF9wYWdpbmF0aW9uTWVudSA9IGZ1bmN0aW9uKCl7XG5cblx0XHR2YXIgdGFyZ2V0O1xuXG5cdFx0aWYgKGRvY3VtZW50LmNvbnRhaW5zKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3F1YXJlLXByZXZpb3VzXCIpKSkge1xuXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxdWFyZS1wcmV2aW91c1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGNsZWFyVGhlSW50ZXJ2YWwoKTtcdFxuXHRcdFx0XHR0YXJnZXQgPSBfZmluZEFuY2VzdHJvcihlLnRhcmdldCwgXCJjbGlja2FibGUtc3F1YXJlXCIpO1xuXHRcdFx0XHRlbWl0dGVyLmVtaXQoXCJyZXF1ZXN0TmV3UGFnZVwiLCB0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1ocmVmXCIpKTtcdFxuXHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0fVxuXG5cdFx0aWYgKGRvY3VtZW50LmNvbnRhaW5zKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3F1YXJlLW5leHRcIikpKSB7XG5cblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3F1YXJlLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRjbGVhclRoZUludGVydmFsKCk7XHRcdFx0XG5cdFx0XHRcdHRhcmdldCA9IF9maW5kQW5jZXN0cm9yKGUudGFyZ2V0LCBcImNsaWNrYWJsZS1zcXVhcmVcIik7XG5cdFx0XHRcdGVtaXR0ZXIuZW1pdChcInJlcXVlc3ROZXdQYWdlXCIsIHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIikpO1x0XHRcblx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdH1cblxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nyb2xsLXVwXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRcdC8vU1RFRiBtb3ZlIHRvIGZ1bmN0aW9uc1xuXHRcdFx0KGZ1bmN0aW9uIHNtb290aHNjcm9sbCgpe1xuXHRcdFx0ICAgIHZhciBjdXJyZW50U2Nyb2xsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblx0XHRcdCAgICBpZiAoY3VycmVudFNjcm9sbCA+IDApIHtcblx0XHRcdCAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc21vb3Roc2Nyb2xsKTtcblx0XHRcdCAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyAoMCxjdXJyZW50U2Nyb2xsIC0gKGN1cnJlbnRTY3JvbGwvMjUpKTtcblx0XHRcdCAgICB9XG5cdFx0XHR9KSgpO1x0XHRcdFxuXHRcdH0sIGZhbHNlKTtcblxuXHR9XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0Y2xlYXJUaGVJbnRlcnZhbCA6IGNsZWFyVGhlSW50ZXJ2YWxcblx0fTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFByb2plY3RWaWV3KCk7IiwiLyogXG5cdHB1LWVudGUgVmlld1xuXHQtLS0tLS0tLS0tLS0tLSBcblx0UmVuZGVycyBWaWV3IG9mIHB1LWVudGUgcGFnZVxuKi9cblxudmFyIFB1ZW50ZVZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cblx0XG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKGxhc3RQYWdlKSB7XG5cdFx0XG5cdFx0Y29uc29sZS5sb2coXCJpbml0IFB1ZW50ZVZpZXdcIik7XG5cdFx0bGFzdFBhZ2UgPSB0eXBlb2YgbGFzdFBhZ2UgIT09ICd1bmRlZmluZWQnID8gbGFzdFBhZ2UgOiBcIi9hL1wiO1xuXG5cblx0XHRjb25zb2xlLmxvZyhcImxhc3RQYWdlID0gXCIrbGFzdFBhZ2UpO1xuXG5cdFx0aWYgKGxhc3RQYWdlLmluZGV4T2YoXCIvYS9cIikhPS0xKXtcblxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51XCIpLmlubmVySFRNTCA9ICc8ZGl2IGlkPVwiY3Jvc3NNZW51XCIgY2xhc3M9XCJjcm9zcy1tZW51IGxlZnRcIj48L2Rpdj48IS0tPGRpdiBpZD1cIm1lbnVSaWdodFwiIGNsYXNzPVwic3F1YXJlLW1lbnUgcmlnaHRcIj48L2Rpdj4tLT4nO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudVwiKS5pbm5lckhUTUwgPSAnPCEtLTxkaXYgaWQ9XCJtZW51TGVmdFwiIGNsYXNzPVwic3F1YXJlLW1lbnUgbGVmdFwiPjwvZGl2Pi0tPjxkaXYgaWQ9XCJjcm9zc01lbnVcIiBjbGFzcz1cImNyb3NzLW1lbnUgcmlnaHRcIj48L2Rpdj4nO1xuXHRcdH1cblxuXHR9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBQdWVudGVWaWV3KCk7Il19
