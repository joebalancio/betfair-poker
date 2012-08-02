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
          textFill: 'black',
          fill: 'white',
          padding: 5,
          shadow: {
            color: 'black',
            blur: 2,
            alpha: 0.5,
            offset: [2, 2]
          },
          stroke: 'green',
          strokeWidth: 1,
          fill: {
            start: {
              x: 0,
              y: 0
            },
            end: {
              x: 0,
              y: 50
            },
            colorStops: [0, 'lightgreen', 1, 'green']
          },
          cornerRadius: 5,


        }),
        chips: new Kinetic.Image({
          image: this.images.chips.xsmall,
          width: 128,
          height: 77,
          offset: {x: 128/2, y: 77/2},
          x: 512,
          y: 319
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
          visible: false,
        }, this.sprites.cards)),
        card3: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          visible: false,
        }, this.sprites.cards)),
        card4: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          visible: false,
        }, this.sprites.cards)),
        card5: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          visible: false,
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
      var image = this.images.tabletop;
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

      // set placement of pot
      this.shapes.pot.setX(stageWidth / 2.3);
      this.shapes.pot.setY((stageHeight / 2) + (128 / 2.25));

      // set image
      this.shapes.tabletop.setImage(image);

      // set chip location
      //this.shapes.chips.setPosition(halfStageWidth, halfStageHeight);

      this.shapes.chips.setDraggable(true);
      this.shapes.chips.setListening(true);
      var self = this;
      this.shapes.chips.on('dragend', function() {
        console.log(self.shapes.chips.getX(), self.shapes.chips.getY());
      });


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
    },
    updatePot: function(model, pot) {
      this.shapes.pot.setText('$' + model.get('pot'));
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
    },
    updateCards: function(model, cards) {
      var self = this;
      console.log('update cards', cards);
      _.each(cards, function(card, index) {
        var cardShape = this.shapes['card' + (index + 1)];
        if (!cardShape.attrs.flipped) {
          cardShape.attrs.flipped = true;
          cardShape.setAnimation('back');
          cardShape.show();
          cardShape.transitionTo({
            scale: { x: 0.1, y: 1 },
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
      _.each(this.players.models, function(player, index) {
      	player.shapes.name.setText(player.get('name'));
      }, this);
      switch (status) {
        case 'Deal':
          _.each(this.shapes, function(card, index) {
              if(index.indexOf('card') === 0) {
              var cardShape = this.shapes[index];
              cardShape.attrs.flipped = false;
              cardShape.hide();
            }
          },this);
          break;
        case 'Flop':


          _.each(this.shapes, function(card, index) {
              if(index.indexOf('card') === 0) {
              var cardShape = this.shapes[index];
              cardShape.flipped = false;
              cardShape.hide();
            }
          },this);
          break;
        case 'Showdown':
          this.effects.resetSpray();
          this.effects.spray();
          break;
      }
    }
  });
  return TableView;
});

// new Table({stage: myStage, model: table, collection: mycollection});

