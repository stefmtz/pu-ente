/* Home Page Controller*/
var RouteManager = require('../managers/route-manager')
;



var HomepageController = function () {

	homepageView = null;

	var init = function () {
		console.log('HomepageController');
		
		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", function(e){
				RouteManager.init(e, true, e.target.id);
			}); 
		}	

	};


	return {
		init: init
	};

};

module.exports = new HomepageController();