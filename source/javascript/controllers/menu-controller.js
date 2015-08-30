/* 
	Menu Controller
	-------------- 
	Gives behavior to Menu elements
*/
var projectView	= require('../views/project-view'),
	menuView = require('../views/menu-view')
;


var MenuController = function () {

	var prod = "/_test";
	//var prod = "";
	var cat, lang;

	var init = function () {
		console.log('MenuController');

		WPGlobus.language != "es" ? lang = "/"+WPGlobus.language : lang=""; 

		menuView.initSubMenu();
		_initMainMenu();
		_initSubMenu();

	};

	var _initMainMenu = function(){

		var m = document.getElementById("menu");

		cat = _getCat();

		if(document.getElementById("menuRight")!== null){
			document.getElementById("menuRight").addEventListener("click", function(e){
				projectView.clearTheInterval();
				if(window.location.href.indexOf("/a/")!=-1){
					emitter.emit("requestNewPage", prod+lang+"/z/");
				} else {
					menuView.showSubMenu();
				}			
			}, false);
		}

		if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					projectView.clearTheInterval();
					if(window.location.href.indexOf("/a/")!=-1){
						menuView.showSubMenu();
					} else {
						emitter.emit("requestNewPage", prod+lang+"/a/");
					}
				}, false);
		}	

		if(document.getElementById("crossMenu")!== null){
			console.log("crossMenu");
			document.getElementById("crossMenu").addEventListener("click", function(e){
				projectView.clearTheInterval();
				console.log(prod+lang+"/"+cat+"/");
				emitter.emit("requestNewPage", prod+lang+"/"+cat+"/");
			}, false);
		}

	}

	var _initSubMenu = function(){

		var ul = document.getElementById("sub-sections");
		var lis = ul.getElementsByTagName("li");
		var overlay = document.getElementById("overlay");

		for (var i = 0; i < lis.length; i++) {
			lis[i].addEventListener("click", function(e){
				e.stopPropagation();
				menuView.hideSubMenu(false);
				emitter.emit("requestNewPage", prod+lang+e.target.getAttribute("data-href"));
			}); 
		}

		overlay.addEventListener("click", function(e){
			menuView.hideSubMenu(true);
		});


	}

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