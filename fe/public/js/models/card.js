define(function(require,exports,modules) {
	var Backbone = require('backbone').Backbone;
	var Card = Backbone.Model.extend({
		defaults: {
			value: null,
			suit: null,
			image: null
		},
		initialize: function() {}
	});
	return Card;
});