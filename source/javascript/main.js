/* 
	Main
	-------------- 
	Main script of the App - initial file
*/
var PageController 	= require('./controllers/page-controller'),
	Emitter			= require('./managers/emitter')
;


var MainApp = function () {
	emitter = new Emitter();
	PageController.init();
};

MainApp();