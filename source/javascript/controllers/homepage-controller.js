/* Sets behavior of Home Page */

var classUtil = require('classUtil'),
	routeManager = require('../managers/route-manager')
;

var HPController = classUtil.newclass({

	constructor: function() {

		console.log('HPController.constructor');
	},

	init: function(){

		console.log('HPController.init');

		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", routeManager.init(), false); 
		}
		
	}
});

module.exports = new HPController();