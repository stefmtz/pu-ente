/* Main Script of the web */
/* GLOBAL VARS*/	


/* HOME PAGE */
	 function HPController(){

		console.log('HPController');

		var s = document.getElementsByClassName("square");

		for (var i = 0; i < s.length; i++) {
			s[i].addEventListener("click", function(e){
				initRouteManager(e, true, e.target.id);
			}, false); 
		}

	}


/* MENU CONTROLLER */

	 function MenuController(){

	 	console.log('MenuController');

		var m = document.getElementById("menu"),
			cat;

		if(window.location.href.indexOf("/a/")!=-1){
			cat = "a";
			if(document.getElementById("menuRight")!== null){
				document.getElementById("menuRight").addEventListener("click", function(e){
					initRouteManager(e, false, "/z");
				}, false);
			}		

		} else if(window.location.href.indexOf("/z/")!=-1){
			cat = "z";
			if(document.getElementById("menuLeft")!== null){
				document.getElementById("menuLeft").addEventListener("click", function(e){
					initRouteManager(e, false, "/a");
				}, false);
			}			
		} else {
			console.log("error");
		}

		if(document.getElementById("crossMenu")!== null){
			document.getElementById("crossMenu").addEventListener("click", function(e){
				initRouteManager(e, false, "/"+cat);
			}, false);
		}		
	}

/* ROUTE MANAGER */
	function initRouteManager(e, isHP, where){
		e.stopPropagation();
		console.log("initRouteManager");
		
		if (history.pushState) {
			
			//no es la solucion ideal - REVISAR	
			if(isHP===true){
				document.getElementsByClassName("container-home")[0].className += " disappear";	
			} else {
				document.getElementById("primary").className += " disappear";	
			}
			history.pushState(where, "", where+"/");
			requestPage(where+"/");
			
			
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
