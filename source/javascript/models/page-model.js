/* Route Manager - Page Model */

var PageModel = function () {

	var initNewPage = function (newPage, nuevo) {
		console.log("PageModel init");
		
		nuevo = typeof nuevo !== 'undefined' ? nuevo : true;

		if (!newPage){
			newPage = "";
		}

		if (history.pushState) {			
			_requestPage(newPage, nuevo);			
		} else {
			//Backup solution for old browsers.
			window.location.href = e.target.id+"/";
		}
	};

	var _requestPage = function requestPage(href, nuevo){
		if (window.XMLHttpRequest){
			console.log("_requestPage");
			var req = new XMLHttpRequest();
			req.open("GET", href, true);
			req.onload = function(e){
			  if (req.readyState === 4) {
			    if (req.status === 200) {
			    	if (nuevo==true){
			    		history.pushState(href, "", href);	
			    	}
			    	setTimeout(function(){
						emitter.emit("loadNewPage", req.responseText);
					}, 500);													    
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

	return {
		initNewPage: initNewPage
	};

};

module.exports = new PageModel();

