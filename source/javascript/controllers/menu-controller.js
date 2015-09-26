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
	var cat, lang, lastPage;

	var init = function (lp) {
		console.log('MenuController');

		lang = WPGlobus.language != "es" ? "/"+WPGlobus.language : ""; 
		lastPage = typeof lp !== 'undefined' ? lp : "/a/";

		console.log("init lastPage="+lastPage);
		menuView.initSubMenu();
		_initMainMenu();
		_initSubMenu();

	};

	var _initMainMenu = function(){

		console.log("_initMainMenu lastPage="+lastPage);

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
				console.log("allá vamos-->"+prod+lang+"/"+cat+"/");
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

		console.log("getcat lastPage="+lastPage);
		if(window.location.href.indexOf("/z/")!=-1){
			return "z";
		} else if(window.location.href.indexOf("/a/")!=-1) {
			return "a";
		} else if(lastPage.indexOf("/z/") !=-1){
			return "z";
		} else if(lastPage.indexOf("/a/") !=-1){
			return "a";
		} else {
			return "a";
		}
	}

	return {
		init: init
	};

};

module.exports = new MenuController();