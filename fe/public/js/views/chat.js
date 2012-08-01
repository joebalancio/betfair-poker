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
    sessionPlayer: null,

    initialize: function() {
      this.collection.on('add', this.add, this);
      console.log('initialize');
    },
    render: function() {
      console.log('render');
    },
    send: function() {
      var text = this.$el.find('form textarea').val();
      var name = this.player ? this.player.get('name') : 'guest';
      this.sendMessage(name, text);
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
    },
    sendMessage: function(name, text) {
      var data = { message: text };
      if (name) data.name = name;
      new Message(data).save();
    }
  });

  return ChatView;
});
