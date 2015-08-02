/* 
	Gallery View
	-------------- 
	Renders View of projects List (A-Z galleries)
*/

var GalleryView = function () {

	
	var init = function () {
		
		var p = document.getElementsByClassName("project");

		for (var i = 0; i < p.length; i++) {
			p[i].addEventListener("click", function(e){
				e.stopPropagation();
				emitter.emit("requestNewPage", e.target.parentNode.getAttribute("data-href"));
			}); 
		}
				
	};


	return {
		init: init
	};
};

module.exports = new GalleryView();