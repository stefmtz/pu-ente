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