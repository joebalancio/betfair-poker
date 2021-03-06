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
  'app', 'backbone', 'bf/io', 'config'
], function(App, Backbone, bfio, Config) {
  var
    endpoint,
    app;

  function connect() {
    if (!app) app = new App();
  }

  function disconnect() {
    console.log('disconnected, we should do something here');
  }

  // connect to backend
  if (Config.backend.mock) {
    endpoint = window.location.protocol + '//' + window.location.host;
    window.socket = io.connect(endpoint);
  } else {
    endpoint = Config.backend.uri;
    window.socket = bfio.connect(endpoint);
  }

  window.socket.on('connect', connect);
  window.socket.on('disconnect', disconnect);

  // notifications
  window.Notifications = window.webkitNotifications || false;

});

// defining module for socket.io
define('io', function(require, exports, module) {
  module.exports = io;
});

// defining module for stomp
define('stomp', function(require, exports, module) {
  require('/js/libs/stomp/stomp.js');
  module.exports = Stomp;
});
