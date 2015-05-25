/* Route Manager */
//var pageManager = require('../controllers/page-controller');

var routeManager = function () {

	var init = function (e, isHP, where) {
		
		e.stopPropagation();
		console.log("routeManager init");

		if (history.pushState) {
			
			//no es la solucion ideal - REVISAR	
			if(isHP===true){
				document.getElementsByClassName("container-home")[0].className += " disappear";	
			} else {
				document.getElementById("primary").className += " disappear";	
			}
			history.pushState(where, "", where+"/");
			_requestPage(where+"/");
			
			
		} else {
			//Backup solution for old browsers.
			window.location.href = e.target.id+"/";
		}
	};

	var _requestPage = function requestPage(href){
		if (window.XMLHttpRequest){
			console.log("_requestPage");
			var req = new XMLHttpRequest();
			req.open("GET", href, true);
			req.onload = function(e){
			  if (req.readyState === 4) {
			    if (req.status === 200) {
			    	_loadNewPage(req.responseText);								    
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
	};

	var _loadNewPage = function (data){
		console.log("_loadNewPage");

		var parser = new DOMParser();
		var doc = parser.parseFromString(data, "text/html");
		document.body = doc.body;
		document.title = doc.title;

	};

	return {
		init: init
	};

};

module.exports = new routeManager();