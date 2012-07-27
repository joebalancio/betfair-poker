define([
  'jquery',
  'backbone',
  'underscore',
  'create',
  'views/table'
], function($, Backbone, Underscore, CreateJS, TableView) {

  return {
    initialize: function() {
      var canvas = $('canvas')[0];
      var myStage = new CreateJS.Stage(canvas);
      var tableView = new TableView({stage: myStage});
      tableView.render();
      CreateJS.Ticker.addListener({tick: function() {myStage.update()}});
      CreateJS.Ticker.setFPS(30);
      myStage.update();
    }
  };
});
