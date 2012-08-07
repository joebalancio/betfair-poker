define(function(require,exports,modules) {
	var
    Backbone = require('backbone'),
    Common = require('common');

	var Player = Backbone.Model.extend({
    /*
     * Properties
     */
    url: 'player',
    group: null,
    cardRatio: 1.39,
    fadeInProps: {
      alpha: 1,
      duration: 0.5,
      easing: 'strong-ease-in'
    },
    fadeOutProps: {
      alpha: 0,
      duration: 0.5,
      easing: 'strong-ease-in'
    },
    activePlayerProps: {
      stroke: 'cyan',
      fill: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 70 },
        colorStops: [0, 'cyan', 1, 'blue']
      },
    },
    inactivePlayerProps: {
      stroke: 'white',
      textFill: 'dark gray',
      fill: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 30 },
        colorStops: [0, 'white', 1, 'gray']
      },
    },
    dealerButtonProps: {
      stroke: 'white',
      fill: {
        start: { x: 0, y: 0 },
        end: { x: 10, y: 10 },
        colorStops: [0, 'white', 1, 'gray']
      },
      visible: true
    },
    bigBlindButtonProps: {
      stroke: 'yellow',
      fill: {
        start: { x: 0, y: 0 },
        end: { x: 10, y: 10 },
        colorStops: [0, 'yellow', 1, '#DA9100']
      },
      textFill: 'brown',
      visible: true
    },
    smallBlindButtonProps: {
      stroke: 'purple',
      fill: {
        start: { x: 0, y: 0 },
        end: { x: 20, y: 20 },
        colorStops: [0, 'purple', 1, 'black']
      },
      visible: true
    },
    dealerTextProps: {
      textFill: 'black',
      visible: true
    },
    bigBlindTextProps: {
      textFill: 'brown',
      visible: true
    },
    smallBlindTextProps: {
      textFill: 'white',
      visible: true
    },
    user: null, // screen user
    animationInProgress: 0,

    /*
     * Functions
     */
		initialize: function() {
      this.group = new Kinetic.Group;
      this.sprites = this.attributes.sprites;
      delete this.attributes.sprites;
      this.images = this.attributes.images;
      delete this.attributes.images;
      this.user = this.attributes.user;
      delete this.attributes.user;

      // binding
      this.on('add', this.add, this);
      this.on('change:position', this.updatePosition, this);
      this.on('change:cards', this.updateCards, this);
      this.on('change:chips', this.updateChips, this);
      this.on('change:avatar', this.updateAvatar, this);
      this.on('change:status', this.updateStatus, this);
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

      this.shapes = {
        outline: new Kinetic.Rect({
          stroke: 'red',
          width: 170,
          height: 155,
          visible: false
        }),
        name: new Kinetic.Text({
          text: '',
          textFill: 'white',
          fontFamily: 'Helvetica',
          align: 'center',
          height: 40,
          shadow: {
            color: 'black',
            blur: 2,
            alpha: 0.5,
            offset: [2, 2]
          },
          padding: 5,
          stroke: 'cyan',
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
            colorStops: [0, 'cyan', 1, 'blue']
          },
          cornerRadius: 15,
          width: 150,
          x: 5,
          y: 5
        }),
        action: new Kinetic.Text({
          textFill: 'blue',
          text: '',
          fontFamily: 'Helvetica',
          y: 20
        }),
        amount: new Kinetic.Text({
          textFill: 'orange',
          text: '',
          fontFamily: 'Helvetica',
          y: 40
        }),
        positionCircle: new Kinetic.Ellipse({
          radius: 10,
          y: 25,
          x: 25,
          shadow: {
            color: 'black',
            blur: 2,
            alpha: 0.5,
            offset: [2, 2]
          },
        }),
        position: new Kinetic.Text({
          textFill: 'yellow',
          fontSize: 10,
          text: '',
          align: 'center',
          fontFamily: 'Helvetica',
          width: 20,
          height: 20,
          y: 20,
          x: 15
        }),
        chips: new Kinetic.Text({
          textFill: 'black',
          text: '$',
          align: 'center',
          fontFamily: 'Helvetica',
          width: 150,
          y: 27,
          x: 5,
        }),
        card1: new Kinetic.Sprite(_.extend({
          name: 'card',
          width: 50,
          height: 50 * this.cardRatio,
          offset: {
            x: 25,
            y: 50 * this.cardRatio / 2
          },
          rotation: Math.PI * 0.05,
        }, this.sprites.smallCards)),
        card2: new Kinetic.Sprite(_.extend({
          name: 'card',
          width: 50,
          height: 50 * this.cardRatio,
          offset: {
            x: 25,
            y: 50 * this.cardRatio / 2
          },
          rotation: -Math.PI * 0.05,
        }, this.sprites.smallCards)),
        avatar: new Kinetic.Image({
          name: 'avatar',
        })
      };
      _.each(this.shapes, function(shape) {
        this.group.add(shape);
      }, this);
      this.shapes.card1.setPosition(70, 85);
      this.shapes.card2.setPosition(50, 85);
      this.shapes.card1.moveToBottom();
      this.shapes.card2.moveToBottom();

      // set offset for group
      var outlineSize = this.shapes.outline.getSize();
      this.group.setOffset(outlineSize.width / 2, outlineSize.height / 2);
      this.group.height = outlineSize.height;
      this.group.width = outlineSize.width;

      // TEST
      var self = this;
      this.group.setDraggable(true);
      this.group.on('click', function() {
        console.log(self.group.getX(), self.group.getY());
      });
		},
    add: function(model) {
      this.update(model);
    },
    update: function(model) {
      this.updateStatus(model, model.get('status'));
      this.updatePosition(model, model.get('position'));
      this.updateCards(model, model.get('cards'));
      this.updateChips(model, model.get('chips'));
      this.updateName(model, model.get('name'));
      this.updateAvatar(model, model.get('avatar'));
    },
    updateChips: function(model, chips) {
      this.shapes.chips.setText('$' + chips);
    },
    updatePosition: function(model, position) {
      var previousPosition = model.previous('position');
      var stage = this.group.getStage();
      var positionMap = {
        'NONE': '',
        'DEALER': 'd',
        'SMALL BLIND': 'sb',
        'BIG BLIND': 'bb',
        'CONTINUE': '',
      };
      console.log('position', position);
      var positionText = position ? positionMap[position].toUpperCase() : '';

      // set text
      this.shapes.position.setText(positionText);

      // set position style
      switch (position) {
        case 'DEALER':
          this.shapes.position.setAttrs(this.dealerTextProps);
          this.shapes.positionCircle.setAttrs(this.dealerButtonProps);
          break;
        case 'BIG BLIND':
          this.shapes.position.setAttrs(this.bigBlindTextProps);
          this.shapes.positionCircle.setAttrs(this.bigBlindButtonProps);
          break;
        case 'SMALL BLIND':
          this.shapes.position.setAttrs(this.smallBlindTextProps);
          this.shapes.positionCircle.setAttrs(this.smallBlindButtonProps);
          break;
      }

      if (previousPosition) {
        if (position === 'NONE') this.hidePosition();
        else this.showPosition();
      } else {
        if (position === 'NONE') this.hidePosition(false);
        else this.showPosition(false);
      }

    },
    showPosition: function(animate, next) {
      var
        self = this,
        stage = this.group.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        completed = 2,
        fadeIn = _.extend({
          callback: function() {
            if (--completed === 0) {
              self.trigger('animation:end');
              next();
            }
          }
        }, Common.fadeIn);

      if (stage && animate) {
        this.trigger('animation:begin');
        this.shapes.position.transitionTo(fadeIn);
        this.shapes.positionCircle.transitionTo(fadeIn);
      } else {
        this.shapes.position.setAttrs(Common.visible);
        this.shapes.positionCircle.setAttrs(Common.visible);
        next();
      }
    },
    hidePosition: function(animate, next) {
      var
        self = this,
        stage = this.group.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        completed = 2,
        fadeOut = _.extend({
          callback: function() {
            if (--completed === 0) {
              self.trigger('animation:end');
              next();
            }
          }
        }, Common.fadeOut);

      if (stage && animate) {
        this.trigger('animation:begin');
        this.shapes.position.transitionTo(fadeOut);
        this.shapes.positionCircle.transitionTo(fadeOut);
      } else {
        this.shapes.position.setAttrs(Common.hidden);
        this.shapes.positionCircle.setAttrs(Common.hidden);
        next();
      }
    },
    updateCards: function(model, cards) {
      if (cards && this.user && this.user.id === model.id) {
        this.shapes.card1.setAnimation(this.getSimpleCard(cards[0]));
        this.shapes.card2.setAnimation(this.getSimpleCard(cards[1]));
      } else {
        this.shapes.card1.setAnimation('back');
        this.shapes.card2.setAnimation('back');
      }
    },
    updateName: function(model, name) {
      this.shapes.name.setText(name);
    },
    updateAvatar: function(model, avatar) {
      if (avatar && this.images.avatars[avatar]) this.shapes.avatar.setImage(this.images.avatars[avatar]);
      else this.shapes.avatar.setImage(this.images.avatars.N03);
      this.shapes.avatar.setAttrs({
        x: this.group.width / 2,
        y: 25
      });
    },
    updateStatus: function(model, status) {
      var
        self = this,
        name = this.shapes.name.attrs.text,
        capitalize = status ? status.charAt(0).toUpperCase() + status.substr(1) : '';

      switch (status) {
        case 'TURN':
          this.shapes.name.setAttrs(this.activePlayerProps);
          break;
        case 'BET':
        case 'CALL':
        case 'FOLD':
        case 'CHECK':
          this.shapes.name.setText(capitalize);
        default:
          this.shapes.name.setAttrs(this.inactivePlayerProps);
          break;
      }
    },

    foldCards: function(animate, next) {
      var
        self = this,
        stage = this.group.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        completed = 2;

      if (stage && animate) {
        transition = {
          x: stage.getWidth() / 2 - this.group.getX() - 50 / 2,
          y: stage.getHeight() / 2 - this.group.getY() - 50 * this.cardRatio / 2,
          rotation: Math.PI,
          alpha: 0,
          easing: 'strong-ease-out',
          duration: 1.5,
          callback: function() {
            if (--completed === 0) {
              self.trigger('animation:end');
              next();
            }
          }
        };

        this.trigger('animation:begin');
        this.shapes.card1.transitionTo(transition);
        this.shapes.card2.transitionTo(transition);
      } else {
        this.hideCards(false);
      }
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
        console.log(card.suit.charAt(0) + map[card.rank]);
        return card.suit.charAt(0) + map[card.rank];
      } else {
        return card;
      }
    },
    showCards: function(animate, next) {
      var
        self = this,
        stage = this.group.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        completed = 2,
        callback = function() {
          if (--completed === 0) {
            console.log('animation done');
            self.trigger('animation:end');
            next();
          }
        },
        fadeIn = _.extend({
          callback: callback
        }, Common.fadeIn),
        flipIn = _.extend({
          callback: callback
        }, Common.flipIn);
    },

    flipCards: function(next) {
      var
        self = this,
        stage = this.group.getStage(),
        animate = !_.isUndefined(animate) ? animate : true,
        next = !_.isUndefined(next) ? next : function() {},
        cards = [this.shapes.card1, this.shapes.card2],
        completed = 0,
        flipOut = _.extend({
          callback: function() {
            if (--completed === 0) {
              console.log('flip cards animation done');
              self.trigger('animation:end');
              next();
            }
            console.log(completed);
          }
        }, Common.flipOut);

      function getTransitionProps(card, animation) {
        return _.extend({
          callback: function() {
            console.log(animation, completed);
            card.setAnimation(animation);
            card.transitionTo(flipOut);
          }
        }, Common.flipIn);
      }

      if (stage && animate && !this.cardsFlipped) {
        this.trigger('animation:begin');
        this.cardsFlipped = true;
        _.each(cards, function(card, index) {
          completed++;
          var previousAnimation = card.getAnimation();
          previousAnimation = this.getSimpleCard(this.get('cards')[index]);
          card.setAnimation('back');
          card.transitionTo(getTransitionProps(card, previousAnimation));
        }, this);
      }
    },

    hideCards: function(hasStage, next) {
      var
        cards = this.group.get('.card'),
        completed = 0,
        next = next ? next : function() {};

      if (hasStage) {
        this.cardsFlipped = false;
        _.each(cards, function(card, index) {
          completed++;
          card.transitionTo({
            alpha: 0,
            duration: 0.5,
            easing: 'strong-ease-out',
            callback: function() {
              if (--completed === 0) next();
            }
          });
        }, this);
      } else {
        _.each(cards, function(card, index) {
          card.setAlpha(0);
        }, this);
        next();
      }
    }

	});
	return Player;
});
