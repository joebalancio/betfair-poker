define(function(require, exports, module) {
  var
    Backbone = require('backbone'),
    io = require('io'),
    Message = require('models/message'),
    MessageView = require('views/message'),
    Stomp = require('stomp'),
    Config = require('config');

  var ChatView = Backbone.View.extend({
    el: '#chatbox',
    events: {
      'click form button': 'send'
    },
    stomp: null,

    initialize: function() {
      // binds
      this.connect = _.bind(this.connect, this);
      this.notification = _.bind(this.notification, this);

      this.collection.on('add', this.add, this);

      // get alert channel

      if (Config.notifications.enable) {
        $.ajax({
          url: Config.notifications.uri,
          success: function(data) {
            console.log('loooking for channel', data);
            this.stomp = new Stomp.client(data.channel.uri, this.connect);
            this.stomp.channel = data.channel;
            this.stomp.connect(null, null, this.connect, this.error);
          },
          dataType: 'json',
          context: this
        });
      }

      if (window.Notifications) {
        if (window.Notifications.checkPermission() === 0) {
          console.log('have permission');
        } else {
          window.Notifications.requestPermission();
        }
      }
    },
    connect: function() {
      var parts = [
        '/',
        this.stomp.channel.type,
        '/',
        this.stomp.channel.channelName
      ];
      this.stomp.subscribe(parts.join(''), this.notification);
      console.log('connect', arguments);
    },
    notification: function(data) {
      var
        deserialized = JSON.parse(data.body),
        now = new Date(),
        minutes = now.getMinutes(),
        hours = now.getMinutes(),
        timestamp = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);

      this.collection.add(new Message({
        timestamp: timestamp,
        name: 'sentinel',
        message: deserialized.message
      }));

    },
    error: function() {
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
