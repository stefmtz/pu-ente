/* Manage the change of pages */

var classUtil = require('classUtil')
;

var RouteManager = classUtil.newclass({

	constructor: function() {

		console.log('RouteManager.constructor');
	},

	init: function(){

		console.log('RouteManager.init');	
		this.loadPage();

	},

	loadPage: function(href){

		console.log("loadPage");
		/*var req = new XMLHttpRequest();
		req.onload = RouteManager.processData;
		req.open("GET", href , true);
		req.send();*/
	},

	processData: function(){
		/*if (this.status == 200) {
			newContent = this.responseText;
			var parser = new DOMParser();
			var doc = parser.parseFromString(newContent, "text/html");

			document.body = doc.body;
			document.title = doc.title;
		}*/
	}

});

module.exports = new RouteManager();