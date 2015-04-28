 /*Manage the change of pages */

var RouteManager = function(e){

	console.log('RouteManager');

	function init(e){
		e.stopPropagation();

		if (history.pushState) {
			// FADE OUT
			document.getElementById("primary").className += " disappear";
			//no es la solucion ideal - REVISAR	
			document.getElementsByClassName("container-home")[0].className += " disappear";

			history.pushState(e.target.id, "", e.target.id+"/");
			requestPage(e.target.id+"/");
		} else {
			//Backup solution for old browsers.
			window.location.href = e.target.id+"/";
		}		
	}

	function requestPage(href){
		if (window.XMLHttpRequest){
			console.log("requestPage");
			var req = new XMLHttpRequest();
			req.open("GET", href, true);
			req.onload = function(e){
			  if (req.readyState === 4) {
			    if (req.status === 200) {

			    	loadNewPage(req.responseText);

								    
			    } else {			    
			      console.error(req.statusText);			    
			    }
			  }
			};
			req.onerror = function (e) {
			  console.error(req.statusText);
			};
			req.send(null);
		} else {
			window.location.href = href;
		}
	}

	function loadNewPage(data){
		console.log("loadNewPage");
		
		var parser = new DOMParser();
		var doc = parser.parseFromString(data, "text/html");
		console.log(doc);
		document.body = doc.body;
		document.title = doc.title;

	}

	init(e);
};

module.exports = RouteManager;