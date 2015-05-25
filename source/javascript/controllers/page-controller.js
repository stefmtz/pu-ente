/* Page Controller */
var HomepageController 	= require('./homepage-controller'),
	MenuController 		= require('./menu-controller'),
	GalleryController	= require('./gallery-controller')
;



var PageController = function() {

	var init = function () {
		console.log('PageController');

		if(document.getElementById("primary").className.match(/homepage/)){
			HomepageController.init();
		} else {
			MenuController.init();
		}

		if(document.getElementById("primary").className.match(/single-project/)){
			GalleryController.init();
		}

	};


	return {
		init: init
	};

};

module.exports = new PageController();