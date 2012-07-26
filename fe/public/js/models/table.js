define(function(require,exports,modules) {
	var Backbone = require('backbone').Backbone;
	var Table = Backbone.Model.extend({
		defaults: {
			id: null,
			seats: {},
			player_id: null,
			desired_seat: null,
			action: null
		},
		initialize: function() {}
	});
	return Table;
})