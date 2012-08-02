define(function(require,exports,modules) {
	var Backbone = require('backbone').Backbone;
	var Card = Backbone.Model.extend({
		defaults: {
			value: null,
			suit: null,
			image: null,
			flipped: 0,
		},
		initialize: function() {}
	});
	return Card;
});