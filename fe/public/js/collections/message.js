define(function(require, exports, modules) {
	var Backbone = require('backbone');
	var Message = require('models/message');
	var Messages = Backbone.Collection.extend({
    model: Message,
    url: 'messages',
    socket: window.socket,
    initialize: function() {
      this.ioBind('read', this.read, this);
    },
    read: function(data) {
      this.add(data);
    }
	});
	return Messages;
});
