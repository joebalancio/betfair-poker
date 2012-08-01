define.amd.jQuery = true;

require.config({
  paths: {
    jquery: 'libs/jquery/jquery-1.7.2',
    backbone: 'libs/backbone/backbone',
    backbone_lib: 'libs/backbone',
    underscore: 'libs/underscore/underscore',
    kinetic: 'libs/kinetic/kinetic',
    jade: 'libs/jade/runtime'
  }
});

require([
  'app'
], function(App) {
  var endpoint = window.location.protocol + '//' + window.location.host;
  var app;

  window.socket = io.connect(endpoint);

  window.socket.on('connect', function() {
    if (!app) app = new App();
  });

  window.socket.on('disconnect', function() {
    console.log('disconnected, we should do something here');
  });

});

define('io', function(require, exports, module) {
  module.exports = io;
});
