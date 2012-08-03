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

      this.shapes = {
        tabletop: new Kinetic.Image({}),
        potBg: new Kinetic.Rect({
          cornerRadius: 15,
          width: 200,
          height: 30,
          draggable: true,
          fill: 'black',
          alpha: 0,
          y: 327,
          offset: {
            x: 200 / 2,
            y: 30 / 2,
          }
        }),
        pot: new Kinetic.Text({
          fontSize: 20,
          text: '0',
          textFill: 'white',
          alpha: 0,
          fontFamily: 'Helvetica',
        }),
        chips: new Kinetic.Image({
          image: this.images.chips.xsmall,
          width: 128,
          height: 77,
          offset: {x: 128/2, y: 77/2},
          x: 512,
          y: 319,
          alpha: 0,
        }),
        card1: new Kinetic.Sprite(_.extend({
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          visible: false,
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

      // 522 x 870
      var stageDim = this.layer.getStage().getSize();
      console.log(stageDim);

      // set placement of pot
      //this.shapes.pot.setX(stageWidth / 2.3, (stageHeight / 2) + (128 / 2.25));
      this.shapes.pot.setPosition(0.43478260869565 * stageWidth, 0.60727969348659 * stageHeight);

      // set image
      this.shapes.tabletop.setImage(image);

      // pot bg
      this.shapes.potBg.setPosition(halfStageWidth, 0.6264367816092 * stageHeight);

      // chips
      this.shapes.chips.setPosition(0.58850574712644 * stageWidth, 0.61111111111111 * stageHeight);

      var cardNum = -2;
      _.each(this.shapes, function(shape, name) {
        if (name.indexOf('card') === 0) {
          shape.setX(halfStageWidth + (shape.attrs.width * 1.1) * cardNum);
          shape.setY(halfStageHeight);
          cardNum++;
        }
      }, this);

      //draw it!
      _.each(this.shapes, function(shape, name) {
        this.layer.add(shape);
      }, this);

    },
    updateTable: function(model) {
      console.log('updateTable');
    },
    updatePot: function(model, pot) {
      console.log(model);
      var
        previousPot = model.previous('pot'),
        showTransition = typeof previousPot !== 'undefined',
        fadeIn = {
          alpha: 1,
          duration: 0.5,
          easing: 'strong-ease-in'
        },
        fadeOut = {
          alpha: 0,
          duration: 0.5,
          easing: 'strong-ease-out'
        },
        previousPositions;

      if (showTransition) {
        if (previousPot === 0) {
          previousPositions = {
            chips: this.shapes.chips.getPosition(),
            potBg: this.shapes.potBg.getPosition(),
            pot: this.shapes.pot.getPosition()
          };

          this.shapes.chips.setAttrs({x: this.layer.getStage().getWidth()});
          this.shapes.potBg.setAttrs({x: 0});
          this.shapes.chips.transitionTo(_.extend({}, fadeIn, previousPositions.chips));
          this.shapes.potBg.transitionTo(_.extend({}, fadeIn, {alpha: 0.5}, previousPositions.potBg));
          this.shapes.pot.transitionTo(fadeIn);
        }

        if (pot === 0) {
          this.shapes.chips.transitionTo(fadeOut);
          this.shapes.potBg.transitionTo(fadeOut);
          this.shapes.pot.transitionTo(fadeOut);
        }
      } else {
        // don't transition
        if (pot > 0) {
          // only show pot if positive value
          this.shapes.chips.setAttrs(_.extend({}, fadeIn));
          this.shapes.potBg.setAttrs(_.extend({}, fadeIn, {alpha: 0.5}));
          this.shapes.pot.setAttrs(fadeIn);
        }
      }

      this.shapes.pot.setText('$' + pot);
      if(pot > 200 && pot < 300) {
      	this.shapes.chips.setImage(this.images.chips.small);
      } else if (pot >= 300 && pot < 400) {
      	this.shapes.chips.setImage(this.images.chips.medium);
      } else if (pot >= 400 && pot < 500) {
      	this.shapes.chips.setImage(this.images.chips.large);
      } else if (pot > 500) {
      	this.shapes.chips.setImage(this.images.chips.xlarge);
      }
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
      var self = this,
      previousCards = model.previous('cards');

      if (previousCards) {
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
      } else {
        _.each(cards, function(card, index) {
          var cardShape = this.shapes['card' + (index + 1)];
          cardShape.setAnimation('back');
          cardShape.setAttrs({
            animation: card,
            visible: true,
          });
        }, this);
      }

    },

    updateStatus: function(model, status) {
      //Set the player's name labels back to their name for the next round
      _.each(this.players.models, function(player, index) {
      	player.shapes.name.setText(player.get('name'));
      }, this);
      switch (status) {
        case 'DEAL':
          _.each(this.shapes, function(card, index) {
              if(index.indexOf('card') === 0) {
              var cardShape = this.shapes[index];
              cardShape.attrs.flipped = false;
              cardShape.hide();
            }
          },this);
          break;
        case 'FLOP':


          _.each(this.shapes, function(card, index) {
              if(index.indexOf('card') === 0) {
              var cardShape = this.shapes[index];
              cardShape.flipped = false;
              cardShape.hide();
            }
          },this);
          break;
        case 'SHOWDOWN':
          this.effects.resetSpray();
          this.effects.spray();
          break;
      }
    }
  });
  return TableView;
});

// new Table({stage: myStage, model: table, collection: mycollection});

