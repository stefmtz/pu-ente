(function(){

var s, i, sel, newContent;

s = document.getElementsByClassName("square");

var processData = function () {

	if (this.status == 200) {
		newContent = this.responseText;
		var parser = new DOMParser();
		var doc = parser.parseFromString(newContent, "text/html");

		document.body = doc.body;
		document.title = doc.title;
	}
};

var loadPage = function(href) {	
	var req = new XMLHttpRequest();
	req.onload = processData;
	req.open("GET", href , true);
	req.send();
};

var clickSquare = function(e){
	e.stopPropagation();

	if(Modernizr.history){

		// FADE OUT
		document.getElementById("primary").className += " disappear";
		//no es la solucion ideal - REVISAR	
		document.getElementsByClassName("container-home")[0].className += " disappear";

		history.pushState(e.target.id, "", e.target.id+"/");
		loadPage(e.target.id+"/");

	} else {
		console.log("NO history");
	}
};

window.addEventListener('popstate', function(event) {
  var state = event.state;
  console.log(event);
});

for (i = 0; i < s.length; i++) {
	s[i].addEventListener("click", clickSquare, false); 
}

document.body.className = document.body.className.replace("preload", "");

})();