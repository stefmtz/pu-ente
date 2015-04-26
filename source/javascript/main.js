var HPControler	= require('./controllers/homepage-controller')
;

var Main = function() {

	HPControler.init();

};

module.exports = new Main();