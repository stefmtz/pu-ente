/* 
	pu-ente View
	-------------- 
	Renders View of pu-ente page
*/

var PuenteView = function () {

	
	var init = function (lastPage) {
		
		console.log("init PuenteView");
		lastPage = typeof lastPage !== 'undefined' ? lastPage : "/a/";


		console.log("lastPage = "+lastPage);

		if (lastPage.indexOf("/a/")!=-1){

			document.getElementById("menu").innerHTML = '<div id="crossMenu" class="cross-menu left"></div><!--<div id="menuRight" class="square-menu right"></div>-->';
		} else {

			document.getElementById("menu").innerHTML = '<!--<div id="menuLeft" class="square-menu left"></div>--><div id="crossMenu" class="cross-menu right"></div>';
		}

	};


	return {
		init: init
	};
};

module.exports = new PuenteView();