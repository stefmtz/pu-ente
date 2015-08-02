/* 
	Home Page View
	-------------- 
	Renders Home Page View
*/
var HomepageView = function () {
	
	var init = function (){

		console.log('HomepageView init');

		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", function(e){
				e.stopPropagation();
				emitter.emit("homeRequestNewPage", e);
			}); 
		}
	};

	var fadeOut = function(){
		document.getElementsByClassName("container-home")[0].className += " fade-out-home";
	};

	return {
		init: init,
		fadeOut: fadeOut		
	};
	
};

module.exports = new HomepageView;