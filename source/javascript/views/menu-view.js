/* 
	Menu View
	-------------- 
	Renders View of Main & Sub Menus
*/

var MenuView = function () {
	
	var o, s;

	var initSubMenu = function () {
		
		o = document.getElementById("overlay");
		s = document.getElementById("submenu");						
	};

	var showSubMenu = function () {
		
		o.style.visibility = "visible";
		s.style.visibility = "visible";

		o.className = o.className + " fade-in";
		s.className = s.className + " fade-in";
	}

	var hideSubMenu = function (visibilityHidden) {
		s.className = s.className.replace("fade-in", "fade-out");
		if(visibilityHidden===true){
			o.className = o.className.replace("fade-in", "fade-out");
			o.style.visibility = "hidden";
			s.style.visibility = "hidden";
		}
	}


	return {
		initSubMenu: initSubMenu,
		showSubMenu: showSubMenu,
		hideSubMenu: hideSubMenu
	};
};



module.exports = new MenuView();