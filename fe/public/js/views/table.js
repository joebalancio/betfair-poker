define(function(require,exports,modules) {
	var Backbone = require('backbone');
	var KineticJS = require('kinetic');

	var TableView = Backbone.View.extend({
		initialize: function() {

		},
		//Returns an Easel Shape / Display Object
		render: function() {
			//create a new layer to manage our table, will contain community cards, as well
			var tabletopLayer = new Kinetic.Layer();

			//So, tabletopImage becomes a new JS image object that Kinetic will manipulate
			var tabletopImage = new Image();
			tabletopImage.src = "/img/tabletop.jpg";

			//Give us context to the stage within our onload function
			var self = this;

			tabletopImage.onload = function() {
        var ratio = tabletopImage.height / tabletopImage.width;

        tabletopImage.width = self.options.stage.attrs.width;
        tabletopImage.height = self.options.stage.attrs.height = self.options.stage.attrs.width * ratio;

				//tabletop becomes a Kinetic Image Object
				var tabletop = new Kinetic.Image({
					x: 0,
					y: 0,
					image: tabletopImage
				});

				//draw it!
				tabletopLayer.add(tabletop);
				self.options.stage.add(tabletopLayer);
			}
		}
	});
	return TableView;
});

// new Table({stage: myStage, model: table, collection: mycollection});

