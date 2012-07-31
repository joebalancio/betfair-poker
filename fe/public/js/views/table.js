define(function(require,exports,modules) {
	var Backbone = require('backbone');
	var KineticJS = require('kinetic');

	var TableView = Backbone.View.extend({
    /*
     * Properties
     */
    layer: null,
    pot: null,
    el: 'div#pokerTable',
    images: null,
    stage: null,
    shapes: {
      tabletop: new Kinetic.Image({}),
      pot: new Kinetic.Text({
        fontSize: 20,
        text: '0',
        textFill: 'black'
      }),
      card1: new Kinetic.Image({
        width: 92,
        height: 128,
        draggable: true
      }),
      card2: new Kinetic.Image({
        width: 92,
        height: 128,
      }),
      card3: new Kinetic.Image({
        width: 92,
        height: 128,
      }),
      card4: new Kinetic.Image({
        width: 92,
        height: 128,
      }),
      card5: new Kinetic.Image({
        width: 92,
        height: 128
      })

    },

    /*
     * Functions
     */
		initialize: function() {
      this.model.on('change', this.updateTable, this);
      this.model.on('change:cards', this.updateCards, this);
      this.model.on('change', this.updateStage, this);

      this.images = this.options.images;
      this.layer = this.options.layer;
		},

    /*
     * Render
     *
     * Set attributes of shapes and then add to the layer
     */
		render: function() {
			//So, image becomes a new JS image object that Kinetic will manipulate
      var image = this.images['tabletop'];
      var stage = this.layer.getStage();
      var stageWidth = stage.getWidth();
      var halfStageWidth = stage.getWidth() / 2;
      var stageHeight, halfStageHeight;

      // resizing the image
      var ratio = image.height / image.width;
      image.width = stageWidth;
      stageHeight = image.height = stageWidth * ratio;
      stage.setHeight(stageHeight);
      halfStageHeight = stageHeight / 2;
      //this.$('.kineticjs-content').height(stage.attrs.height);

      // set placement of pot
      this.shapes.pot.setX(halfStageWidth);
      this.shapes.pot.setY(halfStageHeight * .5);

      // set image
      this.shapes.tabletop.setImage(image);


      var cardNum = -2;
      _.each(this.shapes, function(shape, name) {
        if (name.indexOf('card') === 0) {
          shape.setImage(this.images['card_back']);
          shape.setX(halfStageWidth - shape.getWidth() / 2 + (shape.getWidth() * 1.1) * cardNum);
          shape.setY(halfStageHeight  - shape.getHeight() / 2);
          cardNum++;
        }
      }, this);

      //draw it!
      _.each(this.shapes, function(shape, name) {
        console.log(name);
        this.layer.add(shape);
      }, this);

		},
    updateTable: function(model) {
      this.shapes.pot.setText('Pot: $' + model.get('pot'));
    },
    updateStage: function() {
      this.layer.getStage().draw();
    },
    updateCards: function(model, cards) {
      console.log('update cards', cards);
      _.each(cards, function(card, index) {
        var cardShape = this.shapes['card' + (index + 1)];
        cardShape.setImage(this.images[card]);
      }, this);

    }
	});
	return TableView;
});

// new Table({stage: myStage, model: table, collection: mycollection});

