/* 
	Menu Controller
	-------------- 
	Gives behavior to Menu elements
*/
var projectView	= require('../views/project-view')
;


var MenuController = function () {

	var init = function () {
		console.log('MenuController');
	
		var m = document.getElementById("menu"),
			cat;

		if(window.location.href.indexOf("/a/")!=-1){
			cat = "a";
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", "/z");
				}, false);
			}		

		} else if(window.location.href.indexOf("/z/")!=-1){
			cat = "z";
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", "/a");
				}, false);
			}			
		} else {
			console.log("error");
		}

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				console.log(projectView);

				projectView.clearTheInterval();
				emitter.emit("requestNewPage", "/"+cat);
			}, false);
		}		
	};

	return {
		init: init
	};

};

module.exports = new MenuController();