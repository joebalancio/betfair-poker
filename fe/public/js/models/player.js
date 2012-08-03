define(function(require,exports,modules) {
	var Backbone = require('backbone');
	var Player = Backbone.Model.extend({
    /*
     * Properties
     */
    url: 'player',
    group: null,
    cardRatio: 1.39,
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
          width: 180,
          height: 150
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
          visible: false,
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
          width: 50,
          height: 50 * this.cardRatio,
          offset: {
            x: 25,
            y: 50 * this.cardRatio / 2
          },
          rotation: Math.PI * 0.05,
        }, this.sprites.smallCards)),
        card2: new Kinetic.Sprite(_.extend({
          width: 50,
          height: 50 * this.cardRatio,
          offset: {
            x: 25,
            y: 50 * this.cardRatio / 2
          },
          rotation: -Math.PI * 0.05,
        }, this.sprites.smallCards)),
        /*
        card1: new Kinetic.Image({
          width: 50,
          height: 50 * this.cardRatio,
          offset: {
            x: 25,
            y: 50 * this.cardRatio / 2
          },
          rotation: Math.PI * 0.05,
        }),
        card2: new Kinetic.Image({
          width: 50,
          height: 50 * this.cardRatio,
          offset: {
            x: 25,
            y: 50 * this.cardRatio / 2
          },
          rotation: -Math.PI * 0.05,
          name: 'card'
        }),
        */
        avatar: new Kinetic.Image({
          name: 'avatar',
        })
      };
      _.each(this.shapes, function(shape) {
        this.group.add(shape);
      }, this);
      this.shapes.card1.setPosition(70, 70);
      this.shapes.card2.setPosition(50, 70);
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
      var previousChips = model.previous('chips');

      if (previousChips && chips > previousChips) {
      } else {
        this.shapes.chips.setText('$' + chips);
      }

    },
    updatePosition: function(model, position) {
      if (position) {
        this.shapes.position.setText(position.toUpperCase());
        switch (position) {
          case 'd':
            this.shapes.position.setAttrs(this.dealerTextProps);
            this.shapes.positionCircle.setAttrs(this.dealerButtonProps);
            break;
          case 'bb':
            this.shapes.position.setAttrs(this.bigBlindTextProps);
            this.shapes.positionCircle.setAttrs(this.bigBlindButtonProps);
            break;
          case 'sb':
            this.shapes.position.setAttrs(this.smallBlindTextProps);
            this.shapes.positionCircle.setAttrs(this.smallBlindButtonProps);
            break;

        }
      } else {
        this.shapes.position.hide();
        this.shapes.positionCircle.hide();
      }
    },
    updateCards: function(model, cards) {
      if (cards && this.user && this.user.id === model.id) {
        this.shapes.card1.setAnimation(cards[0]);
        this.shapes.card2.setAnimation(cards[1]);
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
        case 'turn':
          this.shapes.name.setAttrs(this.activePlayerProps);
          break;
        case 'bet':
        case 'call':
        case 'fold':
        case 'check':
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
    }
	});
	return Player;
});
