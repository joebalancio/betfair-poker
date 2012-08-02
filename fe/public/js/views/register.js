define([
  'jquery',
  'backbone',
  'models/player',
], function($, Backbone, PlayerModel) {
  var RegisterView = Backbone.View.extend({
    /*
     * Properties
     */
    el: '#register',
    events: {
      'click button#join': 'join'
    },
    images: null,
    sprites: null,

    /*
     * Functions
     */
    initialize: function() {
      this.images = this.options.images;
      this.sprites = this.options.sprites;
    },

    render: function() {
      if (this.model.isNew()) this.$el.show();
    },

    join: function(event) {
      var
        name = this.$('input').val(),
        avatars = _.keys(this.images.avatars);

      if (name == '') {
        name = 'guest' + (1000 + parseInt(Math.random() * 999, 10));
      }

      this.model.set({
        name: name,
        avatar: avatars[parseInt(Math.random() * avatars.length, 10)],
      }).save();

      this.remove();
      return false;
    }


  });
  return RegisterView;
});
