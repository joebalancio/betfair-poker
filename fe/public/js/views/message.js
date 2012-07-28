define(function(require, exports, module) {
  var
    Backbone = require('backbone'),
    MessageModel = require('models/message'),
    template = require('templates/message');

  var MessageView = Backbone.View.extend({
    model: MessageModel,
    render: function() {
      this.$el = $(template(this.model.toJSON()));
      this.el = this.$el[0];
    }
  });

  return MessageView;
});
