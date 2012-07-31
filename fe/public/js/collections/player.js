define(function(require, exports, modules) {
  var Backbone = require('backbone');
  var PlayerModel = require('models/player');
  var Players = Backbone.Collection.extend({
    model: PlayerModel,
    url: 'players',
    socket: window.socket,
    images: null,
    initialize: function() {
      this.ioBind('read', this.read, this);
    },
    read: function(models) {
      console.log('creating data');
      var newModels = [];

      _.each(models, function(value) {
        var model = this.get(value.id);
        value.images = this.images;
        if (model) model.set(value);
        else newModels.push(value);
      }, this);

      if (newModels.length > 0) this.add(newModels);
    }
  });
  return Players;
});
