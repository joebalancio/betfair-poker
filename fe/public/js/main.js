define.amd.jQuery = true;

require.config({
  paths: {
    jquery: 'libs/jquery/jquery-1.7.2',
    backbone: 'libs/backbone/backbone',
    underscore: 'libs/underscore/underscore',
    create: 'libs/create/create',
    templates: '../templates'
  }
});

require([
  'app'
], function(App) {
  App.initialize();
});
