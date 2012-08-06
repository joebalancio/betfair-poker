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
      'click form button': 'send',
      'keypress form textarea': 'send'
    },
    stomp: null,
    name: null,

    initialize: function() {
      // binds
      this.collection.on('add', this.add, this);

      // notifications alert channel
      if (Config.notifications.enable) {
        $.ajax({
          url: Config.notifications.uri,
          success: function(data) {
            console.log('loooking for channel', data);
            this.stomp = new Stomp.client(data.channel.uri);
            this.stomp.channel = data.channel;
            this.stomp.connect(null, null, _.bind(this.notificationConnect, this), _.bind(this.notificationError, this));
          },
          dataType: 'json',
          context: this
        });
      }

      // set up websocket
      if (Config.chat.enable) {
        this.socket = new WebSocket(Config.chat.uri);
        this.socket.onmessage = _.bind(this.chatMessage, this);
        this.socket.onopen = _.bind(this.chatConnect, this);
        this.socket.onclose = _.bind(this.chatDisconnect, this);
      }

      if (window.Notifications) {
        if (window.Notifications.checkPermission() === 0) {
          console.log('have permission');
        } else {
          window.Notifications.requestPermission();
        }
      }
    },

    chatMessage: function(event) {
      var
        data = event.data.split(':'),
        now = new Date(),
        minutes = now.getMinutes(),
        hours = now.getMinutes(),
        timestamp = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);

      this.collection.add(new Message({
        timestamp: timestamp,
        name: data[0],
        message: data[1]
      }));
    },

    chatConnect: function(event) {
      this.trigger('connect:chat', event);
    },

    chatDisconnect: function(event) {
      this.trigger('disconnect:chat', event);
    },

    notificationConnect: function() {
      var channel = this.stomp.channel;

      function getChannelPath(type, name) {
        return '/' + type + '/' + name;
      }

      this.stomp.subscribe(getChannelPath(channel.type, channel.channelName), _.bind(this.notificationMessage, this));
      this.stomp.subscribe(getChannelPath(channel.type, channel.heartBeats));
      console.log('connect', arguments);
    },
    notificationMessage: function(data) {
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
    notificationError: function() {
      console.error('notification error')
    },
    render: function() {
      console.log('render');
    },
    send: function(event) {
      var text, name;
      if (event.type === 'click' || (event.type === 'keypress' && event.which === 13)) {
        text = this.$el.find('form textarea').val();
        name = this.name || 'guest';
        this.socket.send(name + ':' + text);
        this.$el.find('form textarea').val('');
      } else if (event.type === 'keypress') return true;
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
