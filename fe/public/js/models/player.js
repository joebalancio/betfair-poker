define(function(require,exports,modules) {
	var Backbone = require('backbone').Backbone;
	var Player = Backbone.model.extend({
		defaults: {
			id: null,
			name: 'Player '+this.id,
			status: null,
			cards: null,
			stack: null,
			position: null,
			action: null,
			amount: null
		},
		initialize: function(name) {
			Player.name = name;
		}
	});
	return Player;
});