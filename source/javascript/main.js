/* Main Script of the web */

var pageManager = require('./managers/page-manager');


var mainApp = function () {
	console.log("mainApp");
	//console.log(pageManager);
	pageManager.init();

};

module.exports = new mainApp();

