define(function(require,exports,modules) {
  var Backbone = require('backbone');
  var Kinetic = require('kinetic');
  var Common = require('common');

  var TableView = Backbone.View.extend({
    /*
     * Properties
     */
    layer: null,
    pot: null,
    el: 'div#table',
    images: null,
    effects: null,
    shapes: {},
    animationInProgress: 0,

    /*
     * Functions
     */
    initialize: function() {
      this.model.on('change:cards', this.updateCards, this);
      this.model.on('change:pot', this.updatePot, this);
      this.model.on('change:status', this.updateStatus, this);
      this.model.on('change', this.updateStage, this);
      this.on('animation:begin', function() {
        if (this.animationInProgress === 0) this.trigger('animation:before');
        this.animationInProgress++;
      });
      this.on('animation:end', function() {
        if (--this.animationInProgress === 0) this.trigger('animation:complete');
      });
      this.on('animation:complete', function() {
        console.log('animations complete!!');
      });

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
          name: 'card',
          position: 0,
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          alpha: 0,
        }, this.sprites.cards)),
        card2: new Kinetic.Sprite(_.extend({
          name: 'card',
          position: 1,
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          alpha: 0,
        }, this.sprites.cards)),
        card3: new Kinetic.Sprite(_.extend({
          name: 'card',
          position: 2,
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          alpha: 0,
        }, this.sprites.cards)),
        card4: new Kinetic.Sprite(_.extend({
          name: 'card',
          position: 3,
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          alpha: 0,
        }, this.sprites.cards)),
        card5: new Kinetic.Sprite(_.extend({
          name: 'card',
          position: 4,
          width: 92,
          height: 128,
          offset: { x: 92/2, y: 128/1.2 },
          alpha: 0,
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
    showPot: function(animate, next) {
      var
        self = this,
        originalPositions = {
          chips: this.shapes.chips.getPosition(),
          potBg: this.shapes.potBg.getPosition(),
          pot: this.shapes.pot.getPosition()
        },
        stage = this.layer.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        completed = 3,
        callback = function() {
          if (--completed === 0) {
            self.trigger('animation:end');
            next();
          }
        };

      if (stage && animate) {
        this.trigger('animation:begin');
        this.shapes.chips.setAttrs({x: stage.getWidth()});
        this.shapes.potBg.setAttrs({x: 0});
        this.shapes.chips.transitionTo(_.extend({callback: callback}, Common.fadeIn, originalPositions.chips));
        this.shapes.potBg.transitionTo(_.extend({callback: callback}, Common.fadeIn, Common.visible50, originalPositions.potBg));
        this.shapes.pot.transitionTo(_.extend({callback: callback}, Common.fadeIn));
      } else {
        this.shapes.chips.setAttrs(Common.visible);
        this.shapes.potBg.setAttrs(Common.visible50);
        this.shapes.pot.setAttrs(Common.visible);
        next();
      }
    },
    hidePot: function(animate, next) {
      var
        self = this,
        stage = this.layer.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        completed = 2,
        callback = function() {
          if (--completed === 0) {
            self.trigger('animation:end');
            next();
          }
        },
        fadeOut = _.extend({
          callback: callback,
        }, Common.fadeOut);

      if (stage && animate) {
        this.trigger('animation:begin');
        this.shapes.chips.transitionTo(fadeOut);
        this.shapes.potBg.transitionTo(fadeOut);
        this.shapes.pot.setAttrs(Common.hidden);
      } else {
        this.shapes.chips.setAttrs(Common.hidden);
        this.shapes.potBg.setAttrs(Common.hidden);
        this.shapes.pot.setAttrs(Common.hidden);
        next();
      }
    },
    updatePot: function(model, pot) {
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

      // show/hide
      if (_.isNumber(previousPot)) {
        if (previousPot === 0) {
          this.showPot();
        } else if (pot === 0) {
          this.hidePot();
        }
      } else {
        if (pot === 0) {
          this.hidePot(false);
        } else {
          this.showPot(false);
        }
      }

    },
    updateStage: function() {
      this.layer.getStage().draw();
    },
    getSimpleCard: function(card) {
      var map = {
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        SIX: 6,
        SEVEN: 7,
        EIGHT: 8,
        NINE: 9,
        TEN: 'T',
        JACK: 'J',
        QUEEN: 'Q',
        KING: 'K',
        ACE: 'A'
      };

      if (_.isObject(card)) {
        return card.suit.charAt(0) + map[card.rank];
      } else {
        return card;
      }
    },
    showCards: function(cardValues, animate, next) {
      console.log('show cards', cardValues);
      var
        self = this,
        completed = 0,
        cards = this.layer.get('.card'),
        stage = this.layer.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        flipOut = _.extend({
          callback: function() {
            if (--completed === 0) {
              console.log('animation done');
              self.trigger('animation:end');
              next();
            }
          }
        }, Common.flipOut);

      function getTransitionProps(card, animation) {
        return _.extend({
          callback: function() {
            //card.setAnimation(animation);
            card.transitionTo(flipOut);
          }
        }, Common.flipIn);
      }

      if (stage && animate) {
        _.each(cards, function(card) {
          if (!card.attrs.flipped && cardValues[card.attrs.position]) {
            completed++;
            card.attrs.flipped = true;
            //card.setAnimation('back');
            card.transitionTo(getTransitionProps(card, cardValues[card.attrs.position]));
          }
        }, this);
      } else {
        _.each(cards, function(card) {
          if (!card.attrs.flipped && cardValues[card.attrs.position]) {
            card.setAttrs({
              alpha: 1,
              flipped: true
            });
          }
        }, this);
        next();
      }

    },
    hideCards: function(cardValues, animate, next) {
      console.log('hide cards');
      var
        self = this,
        completed = 0,
        cards = this.layer.get('.card'),
        stage = this.layer.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        fadeOut = _.extend({
          callback: function() {
            if (--completed === 0) {
              console.log('animation done');
              self.trigger('animation:end');
              next();
            }
          }
        }, Common.fadeOut);

      if (stage && animate) {
        _.each(cards, function(card) {
          if (card.attrs.flipped) {
            completed++;
            card.attrs.flipped = false;
            card.transitionTo(fadeOut);
          }
        }, this);
      } else {
        _.each(cards, function(card) {
          if (card.attrs.flipped) {
            card.setAttrs({
              alpha: 0,
              flipped: false
            });
          }
        }, this);
        next();
      }
    },
    updateCards: function(model, cards) {
      console.log('update cards');
      var
        self = this,
        previousCards = model.previous('cards'),
        cardShapes = this.layer.get('.card');

      _.each(cardShapes, function(card) {
        if (cards[card.attrs.position]) card.setAnimation(this.getSimpleCard(cards[card.attrs.position]));
      }, this);

    },

    updateStatus: function(model, status) {
      console.log('update status');
      var previousStatus = model.previous('status');

      if (previousStatus) {
        console.log('status', status);
        switch (status) {
          case 'DEAL':
            this.hideCards(model.get('cards'));
            break;
          case 'FLOP':
          case 'TURN':
          case 'RIVER':
          case 'SHOWDOWN':
            this.showCards(model.get('cards'));
            break;
        }
      } else {
        switch (status) {
          case 'DEAL':
            this.hideCards(model.get('cards'), false);
            break;
          case 'FLOP':
          case 'TURN':
          case 'RIVER':
          case 'SHOWDOWN':
            this.showCards(model.get('cards'), false);
            break;
        }
      }
    }
  });
  return TableView;
});

// new Table({stage: myStage, model: table, collection: mycollection});

