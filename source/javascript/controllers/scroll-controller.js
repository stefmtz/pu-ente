/* Scroll Controller */

var ScrollController = function() {

	var element;

	var init = function (ele) {

		element = document.getElementById(ele);
		window.addEventListener("scroll", onScrolling);

	};

	var onScrolling = function(){

		if (isScrolledIntoView()){
    		window.removeEventListener("scroll", onScrolling);
    		showElement(element);
    	}		
	};


	var isScrolledIntoView = function(){

		var elementTop    = element.getBoundingClientRect().top,
        elementBottom = element.getBoundingClientRect().bottom;
        
        // controlo que al menos se vean 100px del elemento
		return elementTop >= 0 && (elementTop + 100) <= window.innerHeight;

	};

	var showElement = function(){

		element.className = element.className + " appear"; 
		
	};


	return {
		init: init
	};

};

module.exports = new ScrollController();