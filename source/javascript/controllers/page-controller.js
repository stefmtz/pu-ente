/* Page Controller */
var HomepageController 	= require('./homepage-controller'),
	MenuController 		= require('./menu-controller'),
	GalleryController	= require('./gallery-controller'),
	ScrollController	= require('./scroll-controller')
;



var PageController = function() {

	var init = function () {
		console.log('PageController');

		if(document.getElementById("primary").className.match(/homepage/)){
			HomepageController.init();
		} else {
			// Initialize Menu when is not the homepage.
			MenuController.init();
		}

		if(document.getElementById("primary").className.match(/single-project/)){
			// Initialize Photo Galleries.
			GalleryController.init();
			ScrollController.init("related-posts");
		}

	};


	return {
		init: init
	};

};

module.exports = new PageController();