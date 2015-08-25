/* 
	Menu Controller
	-------------- 
	Gives behavior to Menu elements
*/
var projectView	= require('../views/project-view')
;


var MenuController = function () {

	var prod = "/_test";
	//var prod = "";

	var init = function () {
		console.log('MenuController');
	
		var m = document.getElementById("menu"),
			cat, newPage;

		if(window.location.href.indexOf("/a/")!=-1){
			cat = "a";
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", prod+"/z/");
				}, false);
			}
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", prod+"/contacto/");
				}, false);
			}			

		} else if(window.location.href.indexOf("/z/")!=-1){
			cat = "z";
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", prod+"/a/");
				}, false);
			}
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					projectView.clearTheInterval();
					emitter.emit("requestNewPage", prod+"/contacto/");
				}, false);
			}	
		}

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				projectView.clearTheInterval();
				typeof(cat) == "undefined" ? cat="a" : cat=cat;
				emitter.emit("requestNewPage", prod+"/"+cat+"/");
			}, false);
		}		
	};

	return {
		init: init
	};

};

module.exports = new MenuController();