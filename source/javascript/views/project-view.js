/* 
	Project View
	-------------- 
	Renders View of projects (initializes galleries)
*/
var	ScrollController = require('../controllers/scroll-controller');

var ProjectView = function () {

	var _galleries = new Array();

	var init = function () {
		
		ScrollController.init("related-posts");

		var galleries = document.getElementsByClassName("gallery");

		for (var i = 0; i < galleries.length; i++) {
			_initGallery(galleries[i]);
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