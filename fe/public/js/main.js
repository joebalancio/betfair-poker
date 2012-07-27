define.amd.jQuery = true;

require.config({
  paths: {
    jquery: 'libs/jquery/jquery-1.7.2',
    backbone: 'libs/backbone/backbone',
    underscore: 'libs/underscore/underscore',
    kinetic: 'libs/kinetic/kinetic'
  }
});

require([
  'app'
], function(App) {
  App.initialize();
});
