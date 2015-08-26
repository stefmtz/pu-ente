/* 
	Scroll Controller
	-------------- 
	Given an element, checks if it is inside the view of the user
*/
var ScrollController = function() {

	var element;

	var init = function (ele) {
		element = document.getElementById(ele);
		_onScrolling();
		window.addEventListener("scroll", _onScrolling);

	};

	var _onScrolling = function(){

		if (_isScrolledIntoView()){
    		window.removeEventListener("scroll", _onScrolling);
    		_showElement(element);
    	}	
	};


	var _isScrolledIntoView = function(){

		var elementTop    = element.getBoundingClientRect().top,
        elementBottom = element.getBoundingClientRect().bottom;
        
        // controlo que al menos se vean 100px del elemento
		return elementTop >= 0 && (elementTop + 100) <= window.innerHeight;

	};

	// STEF: esto tendría que estar en la vista
	var _showElement = function(){
		element.className = element.className + " fade-in"; 		
	};


	return {
		init: init
	};

};

module.exports = new ScrollController();