/* Sets behavior of Home Page */
var	routeManager = require('../managers/route-manager')
;

var HPController = function(){

	console.log('HPController');

	var s = document.getElementsByClassName("square");

	for (var i = 0; i < s.length; i++) {
		s[i].addEventListener("click", routeManager, false); 
	}
};

module.exports = HPController;