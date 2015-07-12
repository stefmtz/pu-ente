/* Photo Gallery Controller*/

var GalleryController = function () {

	var _photos = null;
	var _currentPhoto;
	var _nIntervId;

	var init = function () {
		
		var galleries = document.getElementsByClassName("gallery");

		for (var i = 0; i < galleries.length; i++) {
			_initGallery(galleries[i]);
		}
	};

	var _initGallery = function(gallery){

		_photos = document.getElementsByClassName("gallery-item");

		_currentPhoto = _photos.length-1;
		_nIntervId = setInterval(_fadePhoto, 3000);

	};

	var _fadePhoto = function(){

		if (_currentPhoto!=0){
			_photos[_currentPhoto].className = _photos[_currentPhoto].className + " fade-out";
		} else {
			/*STEF MEJORAR: se puede mejorar haciendo fade-in primero de la primera foto y luego del resto */	
			for (var i = 0; i < _photos.length; i++) {
				_photos[i].className = _photos[i].className.replace(" fade-out", "");
			};			
		}

		_currentPhoto == 0 ? _currentPhoto = _photos.length-1 : _currentPhoto--;

	}


	return {
		init: init
	};

};

module.exports = new GalleryController();