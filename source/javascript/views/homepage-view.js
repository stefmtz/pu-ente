/* 
	Home Page View
	-------------- 
	Renders Home Page View
*/
var HomepageView = function () {
	
	var init = function (){

		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", function(e){
				e.stopPropagation();
				emitter.emit("homeRequestNewPage", e);
			}); 
		}

		document.body.addEventListener("click", _initBehavior, false);
	};

	var fadeOut = function(){
		document.getElementsByClassName("container-home")[0].className += " fade-out-home";
	};

	var _changeColor = function(el,o,n){
		el.className = el.className.replace(o,n);
	}

	var _initBehavior = function(e){
		e.stopPropagation();
	
		var light = document.getElementsByClassName("light");
		var mid = document.getElementsByClassName("mid");
		var dark = document.getElementsByClassName("dark");
		
		light = light[0];
		mid = mid[0];
		dark = dark[0];
		
		_changeColor(dark, "dark", "mid");
		_changeColor(mid, "mid", "light");
		_changeColor(light, "light", "dark");				
	}	

	return {
		init: init,
		fadeOut: fadeOut		
	};
	
};

module.exports = new HomepageView;