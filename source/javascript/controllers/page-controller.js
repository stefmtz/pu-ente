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
			if (e.target.id){
				_requestNewPage(e.target.id+"/", true);
			} else {
				var el = _findAncestor(e.target, "square");
				_requestNewPage(el.id+"/", true);
			}
		});

		window.addEventListener('popstate', function(event) {
		 	_fadeOutContent();
			setTimeout(function(){
				PageModel.initNewPage(event.state, false);
			}, 1000);  
		});

		_setViews();
	};

	var _findAncestor = function (el, cls) {
	    while ((el = el.parentElement) && !el.classList.contains(cls));
	    return el;
	}

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