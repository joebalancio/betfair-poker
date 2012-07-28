define(function(require, exports, modules) {
	var Backbone = require('backbone');
	var Message = require('models/message');
	var Messages = Backbone.Collection.extend({
    model: Message,
    url: 'messages',
    socket: window.socket,
    initialize: function() {
      this.ioBind('create', this.create, this);
    },
    create: function(data) {
      console.log('creating data');
      this.add(data);
    }
	});
	return Messages;
});
