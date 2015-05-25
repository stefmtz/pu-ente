/* Main Script of the web */

//var PageManager = require('./managers/page-manager');

var testModule = function() {  
  

  return {
    init: function() {
      console.log("init");
    }
  };
};

module.exports = new testModule();
