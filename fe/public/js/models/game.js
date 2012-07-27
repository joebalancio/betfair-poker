define(function(require,exports,modules){
	var Backbone = require('backbone').Backbone;
	var Player = require('models/player').Player;
	var Game = Backbone.Model.extend({
		defaults: {
			id: null,
			community_cards: {},
			pot: null,
			dealer: null,
			turn: null,
			player_id: null
		},
		initialize: function() {}
	});
	return Game;
});