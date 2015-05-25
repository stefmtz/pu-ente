/* Main Script of the web */

var PageController = require('./controllers/page-controller')
;


var MainApp = function () {
	console.log("MainApp");
	PageController.init();
};

module.exports = new MainApp();

