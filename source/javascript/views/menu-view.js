/* 
	Menu View
	-------------- 
	Renders View of Main & Sub Menus
*/

var MenuView = function () {
	
	var o, s;

	var init = function () {
		
		console.log("MenuView init")
						
	};

	var showSubMenu = function () {
		
		o = document.getElementById("overlay");
		s = document.getElementById("sub-menu");

		o.style.visibility = "visible";

		o.className = o.className + " fade-in";
		s.className = s.className + " fade-in"; 	

	}

	var hideSubMenu = function (visibilityHidden) {
		console.log(visibilityHidden);
		s.className = s.className.replace("fade-in", "fade-out");
		if(visibilityHidden===true){
			o.className = o.className.replace("fade-in", "fade-out");
			o.style.visibility = "hidden";	
		}
	}


	return {
		showSubMenu: showSubMenu,
		hideSubMenu: hideSubMenu
	};
};



module.exports = new MenuView();