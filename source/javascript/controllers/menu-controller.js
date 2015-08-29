/* 
	Menu Controller
	-------------- 
	Gives behavior to Menu elements
*/
var projectView	= require('../views/project-view')
;


var MenuController = function () {

	//var prod = "/_test";
	var prod = "";
	var cat;

	var init = function () {
		console.log('MenuController');
	
		var m = document.getElementById("menu");

		cat = _getCat();

		if(document.getElementById("menuRight")!== null){
			document.getElementById("menuRight").addEventListener("click", function(e){
				projectView.clearTheInterval();
				if(window.location.href.indexOf("/a/")!=-1){
					emitter.emit("requestNewPage", prod+"/z/");
				} else {
					emitter.emit("requestNewPage", prod+"/pu-ente/");
				}			
			}, false);
		}

		if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					if(window.location.href.indexOf("/a/")!=-1){
						emitter.emit("requestNewPage", prod+"/pu-ente/");
					} else {
						emitter.emit("requestNewPage", prod+"/a/");
					}
				}, false);
		}	

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				projectView.clearTheInterval();
				emitter.emit("requestNewPage", prod+"/"+cat+"/");
			}, false);
		}

	};

	function _getCat(){
		var ret = "";
		
		if(window.location.href.indexOf("/z/")!=-1){
			ret="z";
		} else if(window.location.href.indexOf("/a/")!=-1){
			ret="a";
		}		
		return ret;
	}

	return {
		init: init
	};

};

module.exports = new MenuController();