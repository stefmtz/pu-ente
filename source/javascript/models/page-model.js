/* Route Manager - Page Model */

var PageModel = function () {

	var initNewPage = function (newPage) {
		console.log("PageModel init");

		if (history.pushState) {			
			_requestPage(newPage+"/");			
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
			    	history.pushState(href, "", href);
					emitter.emit("loadNewPage", req.responseText);								    
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

