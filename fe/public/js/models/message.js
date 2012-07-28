define(function(require, exports, modules) {
	var Backbone = require('backbone');
	var Message = Backbone.Model.extend({
    url: 'message',
		defaults: {
			timestamp: null,
			message: null,
			player: null
		},
		initialize: function() {

    }
	});
	return Message;
});
