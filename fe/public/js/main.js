define.amd.jQuery = true;

require.config({
  paths: {
    jquery: 'libs/jquery/jquery-1.7.2',
    backbone: 'libs/backbone/backbone',
    backbone_lib: 'libs/backbone',
    underscore: 'libs/underscore/underscore',
    kinetic: 'libs/kinetic/kinetic',
    jade: 'libs/jade/runtime',
    bf: 'libs/betfair'
  }
});

require([
  'app', 'backbone', 'bf/io'
], function(App, Backbone, bfio) {
  var
    endpoint,
    app,
    real = false;

  function connect() {
    if (!app) app = new App();
  }

  function disconnect() {
    console.log('disconnected, we should do something here');
  }

  if (real) {
    endpoint = 'ws://poker1.cp.sfo.us.betfair:9292';
    window.socket = bfio.connect('ws://poker1.cp.sfo.us.betfair:9292/poker');
    window.socket.on('connect', connect);
    window.socket.on('disconnect', disconnect);
  } else {
    endpoint = window.location.protocol + '//' + window.location.host;
    window.socket = io.connect(endpoint);
    window.socket.on('connect', connect);
    window.socket.on('disconnect', disconnect);
  }



});

// defining module for socket.io
define('io', function(require, exports, module) {
  module.exports = io;
});

