define([
  'jquery',
  'backbone',
  'underscore',
  'kinetic',
  'views/table',
  'views/chat',
  'collections/message',
  'backbone_lib/backbone.iosync',
  'backbone_lib/backbone.iobind'
], function($, Backbone, Underscore, Kinetic, TableView, ChatView, Messages) {
  window.socket = io.connect('http://localhost:3000');
  return {
    initialize: function() {
      var myStage = new Kinetic.Stage ({
        container: "pokerTable",
        height: 600,
        width: $('#pokerTable').width()
      });

      var table = new TableView({stage: myStage});
      table.render();

      var chatView = new ChatView({collection: new Messages()});
      chatView.render();
    }
  };
});
