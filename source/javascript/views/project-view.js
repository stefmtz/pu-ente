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

	var _initGallery = function(galleryHTML){
		var gallery = new Gallery(galleryHTML);
		gallery.init();
	};

	function Gallery(galleryHTML){

		this.photos = galleryHTML.getElementsByClassName("gallery-item");
		this.currentPhoto = this.photos.length-1;;
		this.DOMObject = galleryHTML;
		this.time = galleryHTML.getAttribute("data-time");

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