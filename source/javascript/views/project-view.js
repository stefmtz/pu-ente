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

	//STEF: move to functions
	var _findAncestror = function(el, cls){
		while ((el = el.parentElement) && !el.classList.contains(cls));
		return el;		
	}

	var _paginationMenu = function(){

		var target;

		document.getElementById("square-previous").addEventListener("click", function(e){
			clearTheInterval();	
			target = _findAncestror(e.target, "clickable-square");
			emitter.emit("requestNewPage", target.getAttribute("data-href"));	
		}, false);

		document.getElementById("square-next").addEventListener("click", function(e){
			clearTheInterval();			
			target = _findAncestror(e.target, "clickable-square");
			emitter.emit("requestNewPage", target.getAttribute("data-href"));		
		}, false);

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