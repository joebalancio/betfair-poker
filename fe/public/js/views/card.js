define(function(require,exports,modules) {
	var Backbone = require('backbone');
	var KineticJS = require('kinetic');

	var CardView = Backbone.View.extend({
		//Initialize should read the message dictating the value of the card
		initialize: function() {
			this.value = 'as';
		},
		//Renders a Card Image Object
		render: function() {
			//Create a standard JS image object and define a source
			var cardImage = new Image();
			cardImage.src = "/img/cards/" + this.value + ".png";

			//Give us access to this inside onload
			var self = this;

			//After loading the image, convert it to a kineticJS object
			cardImage.onload = function() {
				var card = new Kinetic.Image({
					x: Math.random() * 400,
					y: Math.random() * 150,
					image: cardImage,
				});

				self.options.layer.add(card);
				self.options.stage.add(self.options.layer);
			}
		},

		//So I'm thinking that this will be bound to a 'flipped' property 
		//change event in the card model
		flip: function() {

		}
	});
	return CardView;
});