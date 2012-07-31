define([
  'jquery',
  'backbone',
  'underscore',
  'kinetic',
  'views/table',
  'views/card'
], function($, Backbone, Underscore, Kinetic, TableView, CardView) {
  return {
    initialize: function() {
      var myStage = new Kinetic.Stage ({
        container: "pokerTable",
        height: 600,
        width: 1000
      });

     var table = new TableView({stage: myStage});
     table.render();
     table.addCard();
     table.addCard();
     table.addCard();
     //var card = new CardView({stage: myStage}); 
     }
  };
});
