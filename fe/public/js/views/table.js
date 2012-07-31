define(function(require,exports,modules) {
	var Backbone = require('backbone');
	var Kinetic = require('kinetic');
	var CardView = require('views/card');
	var TableView = Backbone.View.extend({
		initialize: function() {
		
		},
		//Returns a TableView Object
		render: function() {
			//create a new layer to manage our table, will contain community cards, as well
			var tabletopLayer = new Kinetic.Layer();


			//So, tabletopImage becomes a new JS image object that Kinetic will manipulate
			var tabletopImage = new Image();
			tabletopImage.src = "/img/tabletop.jpg";

			//Give us context to the stage within our onload function
			var self = this;

			tabletopImage.onload = function() {
				//tabletop becomes a Kinetic Image Object
				var tabletop = new Kinetic.Image({
					x: 0,
					y: 0,
					image: tabletopImage,
					width: self.options.stage.attrs.width - 50,
					height: self.options.stage.attrs.height
				});

				//draw it!
				tabletopLayer.add(tabletop);
				self.options.stage.add(tabletopLayer);
			}
		},
		//The table view will manage teh community cards on a seperate layer
		cardLayer: new Kinetic.Layer(),

		addCard: function() {
			var card = new CardView({stage: this.options.stage, layer: this.cardLayer});
			card.render();
		}

	});
	return TableView;
});

// new Table({stage: myStage, model: table, collection: mycollection});

