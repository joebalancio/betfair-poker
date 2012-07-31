define(function(require,exports,modules) {
	var Backbone = require('backbone');
	var Player = Backbone.Model.extend({
    /*
     * Properties
     */
    url: 'player',
    group: null,
    cardRatio: 1.39,
    activeShapeProps: {
      stroke: 'cyan',
      fill: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 50 },
        colorStops: [0, 'cyan', 1, 'blue']
      },
    },
    inactiveShapeProps: {
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

    /*
     * Functions
     */
		initialize: function() {
      this.group = new Kinetic.Group;
      this.group.height = 200;
      this.group.width = 200;
      this.images = this.attributes.images;
      this.on('add', this.add, this);
      this.on('change', this.update, this);
      this.on('change:position', this.updatePosition, this);
      this.on('change:active', this.updateActive, this);
      this.on('change:action', this.updateAction, this);
      this.on('change:cards', this.updateCards, this);
      this.on('change:chips', this.updateChips, this);
      this.on('change:avatar', this.updateAvatar, this);
      this.shapes = {
        name: new Kinetic.Text({
          text: '',
          textFill: 'white',
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
          cornerRadius: 5,
          width: 150,
          x: 5,
          y: 5
        }),
        action: new Kinetic.Text({
          textFill: 'blue',
          text: '',
          y: 20
        }),
        amount: new Kinetic.Text({
          textFill: 'orange',
          text: '',
          y: 40
        }),
        positionCircle: new Kinetic.Ellipse({
          radius: 10,
          x: 120,
          y: 95,
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
          width: 20,
          height: 20,
          y: 90,
          x: 110
        }),
        outline: new Kinetic.Rect({
          stroke: 'gray',
          width: this.group.width,
          height: this.group.height,
          y: 0,
          visible: false
        }),
        chips: new Kinetic.Text({
          textFill: 'white',
          text: 'chips:',
          y: 90
        }),
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
        avatar: new Kinetic.Image({
          name: 'avatar'
        })
      };
      _.each(this.shapes, function(shape) {
        this.group.add(shape);
      }, this);
      this.shapes.card1.setPosition(70, 70);
      this.shapes.card2.setPosition(50, 70);
      this.shapes.card1.moveToBottom();
      this.shapes.card2.moveToBottom();
		},
    add: function(model) {
      this.update(model);
    },
    update: function(model) {
      this.updateAction(model, model.get('action'));
      this.updateActive(model, model.get('active'));
      this.updatePosition(model, model.get('position'));
      this.updateCards(model, model.get('cards'));
      this.updateChips(model, model.get('chips'));
      this.updateName(model, model.get('name'));
      this.updateAvatar(model, model.get('avatar'));
    },
    updateChips: function(model, chips) {
      this.shapes.chips.setText('chips: ' + chips);
    },
    updateActive: function(model, active) {
      //if (active) this.shapes.name.setAttrs(this.activeShapeProps);
      //else this.shapes.name.setAttrs(this.inactiveShapeProps);
    },
    updateAction: function(model, action) {
      this.shapes.action.setText(action);
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
      if (cards) {
        this.shapes.card1.setImage(this.images[cards[0]]);
        this.shapes.card2.setImage(this.images[cards[1]]);
      } else {
        this.shapes.card1.setImage(this.images.card_back);
        this.shapes.card2.setImage(this.images.card_back);
      }
    },
    updateName: function(model, name) {
      this.shapes.name.setText(name);
    },
    updateAvatar: function(model, avatar) {
      if (avatar && this.images.avatars[avatar]) this.shapes.avatar.setImage(this.images.avatars[avatar]);
      else this.shapes.avatar.setImage(this.images.avatars.N03);
      this.shapes.avatar.setAttrs({
        scale: {
          x: 0.25,
          y: 0.25
        },
        x: this.group.width / 2,
        y: 5
      });
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
