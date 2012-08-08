define(function(require, exports, modules) {
  var Backbone = require('backbone');
  var PlayerModel = require('models/player');
  var Players = Backbone.Collection.extend({
    model: PlayerModel,
    url: 'players',
    socket: window.socket,
    images: null,
    sprites: null,
    user: null,
    queue: [],
    animating: false,

    initialize: function() {
      this.ioBind('read', this.read, this);
    },
    read: function(models) {
      this.queue.push(models);
      if (!this.animating) this.consume();
    },
    consume: function() {
      this.default(this.queue.shift());
    },
    default: function(models) {
      var newModels = [];

      _.each(models, function(value) {
        var model = this.get(value.id);
        var player;
        value.sprites = this.sprites;
        value.images = this.images;
        value.layer = this.layer;
        value.user = this.user;
        if (model) model.set(value);
        else {
          var player = new PlayerModel(value);
          player.images = this.images;
          newModels.push(player);
        }
      }, this);

      if (newModels.length > 0) this.add(newModels);
    },

    tableStatus: function(table, status) {
      var previousStatus = table.previous('status');
      var players = this;

      if (previousStatus) {
        switch (status) {
          case 'DEAL':
            //players.each(function(player) {
            //  player.hideCards(players.layer.getStage());
            //});
            break;
          case 'FLOP':
          case 'TURN':
          case 'RIVER':
          case 'SHOWDOWN':
            break;
        }

        // set the player's name labels back to their name for the next round
        this.each(function(player, index) {
          player.shapes.name.setText(player.get('name'));
        });
      }

    }
  });
  return Players;
});
