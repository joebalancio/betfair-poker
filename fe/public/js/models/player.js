define(function(require,exports,modules) {
	var Backbone = require('backbone');
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
    queueChanges: [],

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
      this.on('add', this.add, this);
      //this.on('change', this.update, this);
      this.on('change:position', this.updatePosition, this);
      this.on('change:cards', this.updateCards, this);
      this.on('change:chips', this.updateChips, this);
      this.on('change:avatar', this.updateAvatar, this);
      this.on('change:status', this.updateStatus, this);
      this.shapes = {
        outline: new Kinetic.Rect({
          stroke: 'red',
          width: 170,
          height: 155
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
        'none': '',
        'dealer': 'd',
        'small blind': 'sb',
        'big blind': 'bb',
      };
      var positionText = position ? positionMap[position].toUpperCase() : '';

      if (!stage) {
        // if there is no stage then just set the properties
        // this happens on a load
        if (position) this.shapes.position.setText(positionText);
        switch (position) {
          case 'dealer':
            this.shapes.position.setAttrs(this.dealerTextProps);
            this.shapes.positionCircle.setAttrs(this.dealerButtonProps);
            break;
          case 'big blind':
            this.shapes.position.setAttrs(this.bigBlindTextProps);
            this.shapes.positionCircle.setAttrs(this.bigBlindButtonProps);
            break;
          case 'small blind':
            this.shapes.position.setAttrs(this.smallBlindTextProps);
            this.shapes.positionCircle.setAttrs(this.smallBlindButtonProps);
            break;
          default:
            this.shapes.position.setAttrs(this.fadeInProps);
            this.shapes.positionCircle.setAttrs(this.fadeInProps);
        }
        console.log(this.shapes.positionCircle.attrs.visible);
      } else {
        // we have a stage that means we can do fancy stuff
        if (previousPosition != position) {
          if (position == 'none') {
            // just fade out if the position if it is empty
            this.shapes.position.transitionTo(this.fadeOutProps);
            this.shapes.positionCircle.transitionTo(this.fadeOutProps);
          } else {
            // set text and basic props
            this.shapes.position.setText(positionText);
            switch (position) {
              case 'dealer':
                this.shapes.position.setAttrs(this.dealerTextProps);
                this.shapes.positionCircle.setAttrs(this.dealerButtonProps);
                break;
              case 'big blind':
                this.shapes.position.setAttrs(this.bigBlindTextProps);
                this.shapes.positionCircle.setAttrs(this.bigBlindButtonProps);
                break;
              case 'small blind':
                this.shapes.position.setAttrs(this.smallBlindTextProps);
                this.shapes.positionCircle.setAttrs(this.smallBlindButtonProps);
                break;
              default:
                this.shapes.position.setAttrs(this.fadeInProps);
                this.shapes.positionCircle.setAttrs(this.fadeInProps);
            }

            // transitioning to a value
            this.shapes.position.setAttrs(this.fadeOutProps);
            this.shapes.positionCircle.setAttrs(this.fadeOutProps);
            this.shapes.position.transitionTo(this.fadeInProps);
            this.shapes.positionCircle.transitionTo(this.fadeInProps);
          }
        }
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

    /*
      if(cards && cards[0] === 'over') {
        this.shapes.card1.hide();
        this.shapes.card2.hide();
      }
      */
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

    fold: function() {
      var stage = this.group.getStage();
      var transition = {
        x: stage.getWidth() / 2 - this.group.getX() - 50 / 2,
        y: stage.getHeight() / 2 - this.group.getY() - 50 * this.cardRatio / 2,
        rotation: Math.PI,
        alpha: 0,
        easing: 'strong-ease-out',
        duration: 1.5
      };
      this.shapes.card1.transitionTo(transition);
      this.shapes.card2.transitionTo(transition);
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

    flipCards: function(next) {
      // get cards
      var cards = this.group.get('.card');
      var completed = 0;
      var next = next ? next : function() {};

      // flip cards
      _.each(cards, function(card, index) {
        var c = this.getSimpleCard(this.get('cards')[index]);
        completed++;
        card.transitionTo({
          scale: { x: 0.1, y: 1 },
          duration: 0.2,
          easing: 'strong-ease-in',
          callback: function() {
            card.setAnimation(c);
            card.transitionTo({
              scale: { x: 1, y: 1 },
              duration: 0.2,
              easing: 'strong-ease-out',
              callback: function() {
                if (--completed === 0) next();
              }
            });
          }
        });
      }, this);
    },

    hideCards: function(hasStage, next) {
      var
        cards = this.group.get('.card'),
        completed = 0,
        next = next ? next : function() {};

      if (hasStage) {
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
