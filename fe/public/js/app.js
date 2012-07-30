define([
  'jquery',
  'backbone',
  'underscore',
  'kinetic',
  'views/table',
  'views/chat',
  'collections/message',
  'models/table',
  'collections/player',
  'backbone_lib/backbone.iosync',
  'backbone_lib/backbone.iobind'
], function($, Backbone, _, Kinetic, TableView, ChatView, Messages, TableModel, PlayerCollection) {
  var AppView = Backbone.View.extend({
    /*
     * Properties
     */
    stage: null,
    layers: {
      table: new Kinetic.Layer,
      players: new Kinetic.Layer
    },

    /*
     * Functions
     */
    initialize: function() {
      window.socket = io.connect('http://localhost:3000');

      this.stage = new Kinetic.Stage ({
        container: "pokerTable",
        height: 600,
        width: $('#pokerTable').width()
      });

      // add layers to stage
      _.each(this.layers, function(layer) {
        this.stage.add(layer);
      }, this);

      this.players = new PlayerCollection;
      this.players.on('add', this.addPlayer, this);
      this.players.on('add change', this.updateStage, this);

      this.preloadImages(function(images) {
        var table = new TableView({
          layer: this.layers.table,
          model: new TableModel(),
          images: images,
          players: new PlayerCollection
        });
        table.render();

        var chatView = new ChatView({collection: new Messages()});
        chatView.render();

        // hide the overlay
        //$('#overlay').delay(500).fadeOut();
        $('#overlay').hide();

        // signal websockets that the app is ready
        window.socket.emit('start');
      });
    },

    preloadImages: function(callback) {
      var images = {
        tabletop: '/img/tabletop.jpg',
        glyphicons_halflings_white: '/img/glyphicons-halflings-white.png',
        glyphicons_halflings: '/img/glyphicons-halflings.png',
        as: '/img/cards/as.png',
        card_back: '/img/cards/back.png'
      };
      var completed = 0;
      var len = _.size(images);
      var self = this;

      function preload(name, src, callback) {
        var i = new Image();
        i.src = src;
        i.onload = function() {
          callback.call(self, name, i);
        };
      }

      function done(name, image) {
        images[name] = image;
        completed++;
        $('#overlay .bar').css('width', (completed/len*100) + '%');
        if (completed === len) {
          callback.call(self, images);
        }
      }

      _.each(images, function(value, key) {
          preload(key, value, done);
      });

    },

    addPlayer: function(model) {
      var seat = model.get('seat');

      switch (seat) {
        case 1:
          model.group.setX(this.stage.attrs.width * .9);
          model.group.setY(this.stage.attrs.height / 2);
          break;
        case 2:
          model.group.setX(this.stage.attrs.width / 2);
          model.group.setY(this.stage.attrs.height * .9);
          break;
        case 3:
          model.group.setX(this.stage.attrs.width / 2);
          model.group.setY(this.stage.attrs.height * 0.05);
          break;
        case 4:
          model.group.setX(this.stage.attrs.width * 0.01);
          model.group.setY(this.stage.attrs.height / 2);
          break;
      }
      this.layers.players.add(model.group);
      this.stage.draw();
    },

    updateStage: function() {
      this.stage.draw();
    }

  });

  return AppView;
});
