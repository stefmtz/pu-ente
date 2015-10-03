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
			this._setTime(this.time);
		};

		this._setTime = function(t){
			var thisGallery = this;
			this._nIntervId = setTimeout(function(){
				thisGallery._fadePhoto();
			}, t );
		};

		/*This function is responsible for the fade-outs of each one of the images in the gallery*/
		this._fadePhoto = function(){
			clearTimeout(this._timeoutID);
			if (this.currentPhoto!=0){
				this.photos[this.currentPhoto].className = this.photos[this.currentPhoto].className + " fade-out";
				this._setTime(this.time);

			} else {
				this.photos[this.currentPhoto].className = this.photos[this.currentPhoto].className + " fade-out";
				this.photos[this.photos.length-1].className = this.photos[this.photos.length-1].className.replace(" fade-out", "");
								
				var that = this;
				this._timeoutID = setTimeout(function(){
					for (var i = 0; i < that.photos.length; i++) {
						that.photos[i].className = that.photos[i].className.replace(" fade-out", "");
					};
				}, 800 );
				
				var t = this.time >=1000 ? this.time+1000 : this.time; 
				this._setTime(t);	
			}

			this.currentPhoto == 0 ? this.currentPhoto = this.photos.length-1 : this.currentPhoto--;
			
		}
	}

	var clearTheInterval = function(){
		for (var i = 0; i < _galleries.length; i++) {
			clearTimeout(_galleries[i]._nIntervId);
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