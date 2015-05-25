/* Home Page Controller */
var routeManager = require('../managers/route-manager');


var menuController = function () {

	var init = function () {
		console.log('menuController');
	
		var m = document.getElementById("menu"),
			cat;

		if(window.location.href.indexOf("/a/")!=-1){
			cat = "a";
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					routeManager.init(e, false, "/z");
				}, false);
			}		

		} else if(window.location.href.indexOf("/z/")!=-1){
			cat = "z";
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					routeManager.init(e, false, "/a");
				}, false);
			}			
		} else {
			console.log("error");
		}

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				routeManager.init(e, false, "/"+cat);
			}, false);
		}		
	};

	return {
		init: init
	};

};

module.exports = new menuController();