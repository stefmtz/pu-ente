/* Home Page Controller*/
var routeManager = require('../managers/route-manager')


var homepageController = function () {

	var init = function () {
		console.log('homepageController');
	
		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", function(e){
				routeManager.init(e, true, e.target.id);
			}); 
		}	
	};


	return {
		init: init
	};

};

module.exports = new homepageController();