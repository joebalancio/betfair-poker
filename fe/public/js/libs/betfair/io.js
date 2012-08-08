define(function(require, exports, module) {
  var
    Backbone = require('backbone'),
    _ = require('underscore'),
    BetfairIO = {};

  BetfairIO = _.extend({}, Backbone.Events, {
    socket: null,

    connect: function(endpoint) {
      var self = this;
      this.socket = new WebSocket(endpoint);
      this.socket.onmessage = function(event) {
        var packet = JSON.parse(event.data);
        self.trigger(packet.name, packet.args[0]);
      };
      this.socket.onopen = function(event) {
        self.trigger('connect');
      };
      this.socket.onclose = function(event) {
        self.trigger('disconnect');
      };
      return this;
    },
    emit: function(event, data, next) {
      var
        packet = {
          name: event,
          args: [data]
        };

      this.socket.send(JSON.stringify(packet));
    },
    handleMessage: function(event) {
      var packet = JSON.parse(event.data);
      this.trigger(packet.name, packet.args[0]);
    }
  });


  return BetfairIO;
});
