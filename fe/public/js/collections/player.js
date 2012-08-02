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

    initialize: function() {
      this.ioBind('read', this.read, this);
    },
    read: function(models) {
      console.log('creating data');
      console.log(this.user);
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
    }
  });
  return Players;
});