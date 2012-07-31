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
  var app = new App();
});

define('io', function(require, exports, module) {
  module.exports = io;
});
