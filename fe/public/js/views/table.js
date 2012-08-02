define(function(require,exports,modules) {
  var Backbone = require('backbone');
  var Kinetic = require('kinetic');

  var TableView = Backbone.View.extend({
    /*
     * Properties
     */
    layer: null,
    pot: null,
    el: 'div#table',
    images: null,
    stage: null,
    effects: null,
    shapes: {},

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
      this.effects = this.options.effects;
      this.sprites = this.options.sprites;
      console.log(this.sprites);

      this.shapes = {
        tabletop: new Kinetic.Image({}),
        pot: new Kinetic.Text({
          fontSize: 20,
          text: '0',
          textFill: 'black'
        }),
        card1: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
        }, this.sprites.cards)),
        card2: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
        }, this.sprites.cards)),
        card3: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
        }, this.sprites.cards)),
        card4: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
        }, this.sprites.cards)),
        card5: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
        }, this.sprites.cards)),

      };
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
          console.log(shape);
          shape.setX(halfStageWidth + (shape.attrs.width * 1.1) * cardNum);
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
      if (winner) {
        this.shapes.pot.setText(this.players.get(winner + 1).get('name') + ' won ' + model.get('pot') + ' chips!');
      }
      this.effects.resetSpray();
      this.effects.spray();

      /*
      // need to create an effects layer that can be triggered
      var layer = new Kinetic.Layer;
      var stage = this.layer.getStage();

      for(var i=0; i<50; i++) {
        var scale = Math.random();
        var shape = new Kinetic.Ellipse({
          radius: 50,
          scale: {
            x: scale,
            y: scale
          },
          rotationDeg: Math.random() * 180,
          fill: 'red',
          stroke: 'purple',
          strokeWidth: 10,
          alpha: 0.5,
          x: stage.getWidth() / 2,
          y: stage.getHeight() / 2,
        });

        layer.add(shape);
      }

      stage.add(layer);
      stage.draw();
      _.each(layer.getChildren(), function(shape) {
        var x, y, x1, x2, x12, x22;
        do {
          x1 = Math.random() * 2 - 1;
          x2 = Math.random() * 2 - 1;
          x12 = Math.pow(x1, 2);
          x22 = Math.pow(x2, 2);
        } while(x12 + x22 >= 1);

        x = (x12 - x22) / (x12 + x22);
        y = (2 * x1 * x2) / (x12 + x22);

        shape.transitionTo({
          x: stage.getWidth() / 2 + x * stage.getWidth() / 2,
          y: stage.getHeight() / 2 + y * stage.getHeight() / 2,
          //x: stage.getWidth() / 2 + (Math.random() * 2 - 1) * stage.getWidth() / 2,
          //y: stage.getHeight() / 2 + (Math.random() * 2 - 1) * stage.getHeight() / 2,
          alpha: 0,
          duration: Math.random() * 4 + 0.1
        });
      });
      console.log(stage);
      */
    },
    updateCards: function(model, cards) {
      var self = this;
      console.log('update cards', cards);
      _.each(cards, function(card, index) {
        var cardShape = this.shapes['card' + (index + 1)];
        if (!cardShape.attrs.flipped) {
          cardShape.attrs.flipped = true;
          cardShape.show();
          cardShape.transitionTo({
            scale: { x: 0, y: 1 },
            duration: 0.5,
            easing: 'strong-ease-in',
            callback: function() {
              cardShape.setAnimation(card);
              cardShape.transitionTo({
                scale: { x: 1, y: 1 },
                duration: 0.5,
                easing: 'strong-ease-out'
              });
            }
          });
        }
      }, this);

    },

    updateStatus: function(model, status) {
      if (status === 'deal') {
      	_.each(this.shapes, function(card, index) {
	      		if(index.indexOf('card') === 0) {
	      		var cardShape = this.shapes[index];
	      		cardShape.hide();
      		}
      	},this);
        //this.effects.resetSpray();
        //this.effects.spray();

      }
    }
  });
  return TableView;
});

// new Table({stage: myStage, model: table, collection: mycollection});

