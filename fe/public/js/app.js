define([
  'jquery',
  'backbone',
  'underscore',
  'kinetic',
  'views/table'
], function($, Backbone, Underscore, Kinetic, TableView) {
  return {
    initialize: function() {
      var myStage = new Kinetic.Stage ({
        container: "pokerTable",
        height: 600,
        width: 1000
      });

     var table = new TableView({stage: myStage});
     table.render(); 
     }
  };
});
