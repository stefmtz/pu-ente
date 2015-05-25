/* Page Manager*/
var homepageController 	= require('../controllers/homepage-controller')
	menuController 	= require('../controllers/menu-controller');



var pageManager = function() {

	var init = function () {
		console.log('pageManager');

		if(document.getElementById("primary").className.match(/homepage/)){
			homepageController.init();
		} else {
			menuController.init();
		}				
	};


	return {
		init: init
	};

};

module.exports = new pageManager();