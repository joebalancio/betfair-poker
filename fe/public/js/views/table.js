define(function(require,exports,modules) {
	var Backbone = require('backbone');
	var KineticJS = require('kinetic');

	var TableView = Backbone.View.extend({
    /*
     * Properties
     */
    layer: null,
    pot: null,
    el: 'div#table',
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
        offset: {
          x: 92/2,
          y: 128/1.2
        }
      }),
      card2: new Kinetic.Image({
        width: 92,
        height: 128,
        offset: {
          x: 92/2,
          y: 128/1.2
        }
      }),
      card3: new Kinetic.Image({
        width: 92,
        height: 128,
        offset: {
          x: 92/2,
          y: 128/1.2
        }
      }),
      card4: new Kinetic.Image({
        width: 92,
        height: 128,
        visible: 1,
        offset: {
          x: 92/2,
          y: 128/1.2
        }
      }),
      card5: new Kinetic.Image({
        width: 92,
        height: 128,
        visible: 1,
        offset: {
          x: 92/2,
          y: 128/1.2
        }
      })

    },

    /*
     * Functions
     */
		initialize: function() {
      this.model.on('change', this.updateTable, this);
      this.model.on('change:cards', this.updateCards, this);
      this.model.on('change:pot', this.updatePot, this);
      this.model.on('change', this.updateStage, this);

      this.model.on('change:winner', this.updateWinner, this);
      this.model.on('change:status', this.updateStatus, this);

      this.images = this.options.images;
      this.layer = this.options.layer;
      this.players = this.options.players;
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
      this.shapes.pot.setX(stageWidth / 2.3);
      this.shapes.pot.setY((stageHeight / 2) + (128 / 2.25));

      // set image
      this.shapes.tabletop.setImage(image);


      var cardNum = -2;
      _.each(this.shapes, function(shape, name) {
        if (name.indexOf('card') === 0) {
          shape.setImage(this.images['card_back']);
          shape.setX(halfStageWidth + (shape.getWidth() * 1.1) * cardNum);
          shape.setY(halfStageHeight);
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
      //this.shapes.pot.setText('Pot: $' + model.get('pot'));
    },
    updatePot: function(model, pot) {
      this.shapes.pot.setText('Pot: $' + model.get('pot'));
    },
    updateStage: function() {
      this.layer.getStage().draw();
    },
    updateWinner: function(model, winner) {
    	console.log(winner);
    	if(winner) {
    		this.shapes.pot.setText(this.players.get(winner + 1).get('name') + ' won ' + model.get('pot') + ' chips!');
    	}
    },
    updateCards: function(model, cards) {
      var self = this, range;
      console.log('update cards', cards);
      switch (cards.length) {
        case 3:
          range = [0, 3];
          offset = 1;
          break;
        case 4:
          range = [3, 4];
          offset = 4
          break;
        case 5:
          range = [4, 5];
          offset = 5
          break;
      }
      _.each(cards.slice.apply(cards, range), function(card, index) {
        var cardShape = this.shapes['card' + (index + offset)];
        cardShape.transitionTo({
          scale: { x: 0, y: 1 },
          duration: 0.5,
          easing: 'strong-ease-in',
          callback: function() {
            cardShape.setImage(self.images[card]);
            cardShape.transitionTo({
              scale: { x: 1, y: 1 },
              duration: 0.5,
              easing: 'strong-ease-out'
            });
          }
        });
      }, this);

    }
	});
	return TableView;
});

// new Table({stage: myStage, model: table, collection: mycollection});

