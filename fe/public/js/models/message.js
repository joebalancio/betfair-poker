define(function(require,exports,modules){
	var Backbone = require('backbone').Backbone;
	var Message = Backbone.Model.extend({
		defaults: {
			id: null,
			timestamp: null,
			message: null,
			player_id: null
		},
		initialize: function() {}
	});
	return Message;
});