define(function(require, exports, module) {
  var
    Backbone = require('backbone'),
    io = require('io'),
    Message = require('models/message'),
    MessageView = require('views/message');

  var ChatView = Backbone.View.extend({
    el: '#chatbox',
    events: {
      'click form button': 'send'
    },
    initialize: function() {
      this.on('message:read', function(model) {
        //var view = new MessageView({model: new Message(
      });
      this.collection.on('add', this.add, this);

      console.log('initialize');
    },
    render: function() {
      console.log('render');
    },
    send: function() {
      var text = this.$el.find('form textarea').val();
      var message = new Message({
        message: text,
        player: {
          id: 1
        }
      });
      message.save();
      console.log('send');
      return false;
    },
    add: function(model) {
      var messageView = new MessageView({model: model});
      var scroll = this.$el.find('.scrollable');
      messageView.render();

      scroll
        .append(messageView.el)
        .animate({scrollTop: (scroll.prop('scrollHeight') - scroll.innerHeight())}, 'fast');
    }
  });

  return ChatView;
});
