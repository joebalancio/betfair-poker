define([
  'jquery',
  'backbone',
  'underscore',
  'kinetic',
  'views/table',
  'views/chat',
  'views/effects',
  'views/register',
  'collections/message',
  'models/table',
  'collections/player',
  'models/player',
  'common',
  'backbone_lib/backbone.iosync',
  'backbone_lib/backbone.iobind'
], function($, Backbone, _, Kinetic, TableView, ChatView, EffectsView, RegisterView, Messages, TableModel, PlayerCollection, PlayerModel, Common) {
  var AppView = Backbone.View.extend({
    /*
     * Properties
     */
    el: '#poker',
    stage: null,
    layers: {
      table: new Kinetic.Layer,
      players: new Kinetic.Layer,
      effects: new Kinetic.Layer
    },
    sprites: {},
    events: {
      'click button#call': 'call',
      'click button#raise': 'raise',
      'click button#check': 'check',
      'click button#fold': 'fold',
      'click button#debug': 'debug',
      'click button#reset': 'reset',
    },
    user: null,
    chatView: null,
    views: {
      table: null,
      effects: null,
      chat: null,
      register: null,
      players: null // TODO
    },

    /*
     * Functions
     */
    initialize: function() {
      this.stage = new Kinetic.Stage ({
        container: "table",
        height: 600,
        width: $('#table').width()
      });

      // add layers to stage
      _.each(this.layers, function(layer) {
        this.stage.add(layer);
      }, this);

      this.players = new PlayerCollection;
      this.players.on('add', this.addPlayer, this);
      this.players.on('add change', this.updateStage, this);
      this.players.on('change:status', this.displayActions, this);
      this.players.on('change:status', this.moveChips, this);
      this.players.on('change:actions', this.updateActionButtons, this);
      this.players.on('change:chips', this.profitOrLoss, this);
      this.players.on('animation:before', function() {
        this.animating = true;
      });
      this.players.on('animation:complete', function() {
        this.animating = false;
        this.consume();
      });
      this.players.sprites = this.sprites;
      this.players.layer = this.layers.players;
      this.players.user = this.user;
      this.table = new TableModel;
      this.table.on('change:current', this.updateUser, this);
      this.table.on('change:status', this.players.tableStatus, this.players);

      this.preloadImages(function(images) {
        this.players.images = images;
        this.images = images;
        this.generateCards();

        // effects view
        this.views.effects = new EffectsView({
          layer: this.layers.effects
        });
        this.views.effects.render();

        // chat view
        this.views.chat = new ChatView({collection: new Messages});
        this.views.chat.render(); // not used atm

        // table view
        this.views.table = new TableView({
          layer: this.layers.table,
          model: this.table,
          images: images,
          players: this.players,
          effects: this.views.effects,
          sprites: this.sprites,
        });
        this.views.table.render();
        this.views.table.on('animation:before', function() {
          this.model.animating = true;
        });
        this.views.table.on('animation:complete', function() {
          this.model.animating = false;
          this.model.consume();
        });

        // register
        this.views.register = new RegisterView({
          model: new PlayerModel({
            sprites: this.sprites,
            images: this.images
          }),
          images: this.images,
          sprites: this.sprites,
        });
        this.views.register.render();

        // draw the stage
        this.stage.draw();

        // signal websockets that the app is ready
        window.socket.emit('load');

        // hide the overlay
        $('#overlay').delay(500).fadeOut();
      });
    },

    preloadImages: function(callback) {
      var images = {
        tabletop: '/img/tabletop.jpg',
        cardSprites: '/img/cardsprites.png',
        cardSpritesSmall: '/img/cardsprites_small.png',
        chips: {
          xsmall: '/img/chips/chip-stack-1.png',
          small: '/img/chips/chip-stack-2.png',
          medium: '/img/chips/chip-stack-3.png',
          large: '/img/chips/chip-stack-4.png',
          xlarge: '/img/chips/chip-stack-5.png',
        },
        avatars: {
          A01: '/img/avatars/A01.png',
          A02: '/img/avatars/A02.png',
          A03: '/img/avatars/A03.png',
          A04: '/img/avatars/A04.png',
          A05: '/img/avatars/A05.png',
          B01: '/img/avatars/B01.png',
          B02: '/img/avatars/B02.png',
          B03: '/img/avatars/B03.png',
          B04: '/img/avatars/B04.png',
          B05: '/img/avatars/B05.png',
          C01: '/img/avatars/C01.png',
          C02: '/img/avatars/C02.png',
          C03: '/img/avatars/C03.png',
          C04: '/img/avatars/C04.png',
          C05: '/img/avatars/C05.png',
          D01: '/img/avatars/D01.png',
          D02: '/img/avatars/D02.png',
          D03: '/img/avatars/D03.png',
          D04: '/img/avatars/D04.png',
          D05: '/img/avatars/D05.png',
          E01: '/img/avatars/E01.png',
          E02: '/img/avatars/E02.png',
          E03: '/img/avatars/E03.png',
          E04: '/img/avatars/E04.png',
          E05: '/img/avatars/E05.png',
          F01: '/img/avatars/F01.png',
          F02: '/img/avatars/F02.png',
          F03: '/img/avatars/F03.png',
          F04: '/img/avatars/F04.png',
          F05: '/img/avatars/F05.png',
          FA01: '/img/avatars/FA01.png',
          FA02: '/img/avatars/FA02.png',
          FA03: '/img/avatars/FA03.png',
          FA04: '/img/avatars/FA04.png',
          FA05: '/img/avatars/FA05.png',
          FB01: '/img/avatars/FB01.png',
          FB02: '/img/avatars/FB02.png',
          FB03: '/img/avatars/FB03.png',
          FB04: '/img/avatars/FB04.png',
          FB05: '/img/avatars/FB05.png',
          FC01: '/img/avatars/FC01.png',
          FC02: '/img/avatars/FC02.png',
          FC03: '/img/avatars/FC03.png',
          FC04: '/img/avatars/FC04.png',
          FC05: '/img/avatars/FC05.png',
          FD01: '/img/avatars/FD01.png',
          FD02: '/img/avatars/FD02.png',
          FD03: '/img/avatars/FD03.png',
          FD04: '/img/avatars/FD04.png',
          FD05: '/img/avatars/FD05.png',
          FE01: '/img/avatars/FE01.png',
          FE02: '/img/avatars/FE02.png',
          FE03: '/img/avatars/FE03.png',
          FE04: '/img/avatars/FE04.png',
          FE05: '/img/avatars/FE05.png',
          FG01: '/img/avatars/FG01.png',
          FG02: '/img/avatars/FG02.png',
          FG03: '/img/avatars/FG03.png',
          FG04: '/img/avatars/FG04.png',
          FG05: '/img/avatars/FG05.png',
          FH01: '/img/avatars/FH01.png',
          FH02: '/img/avatars/FH02.png',
          FH03: '/img/avatars/FH03.png',
          FH04: '/img/avatars/FH04.png',
          FH05: '/img/avatars/FH05.png',
          FI01: '/img/avatars/FI01.png',
          FI02: '/img/avatars/FI02.png',
          FI03: '/img/avatars/FI03.png',
          FI04: '/img/avatars/FI04.png',
          FI05: '/img/avatars/FI05.png',
          G01: '/img/avatars/G01.png',
          G02: '/img/avatars/G02.png',
          G03: '/img/avatars/G03.png',
          G04: '/img/avatars/G04.png',
          G05: '/img/avatars/G05.png',
          H01: '/img/avatars/H01.png',
          H02: '/img/avatars/H02.png',
          H03: '/img/avatars/H03.png',
          H04: '/img/avatars/H04.png',
          H05: '/img/avatars/H05.png',
          I01: '/img/avatars/I01.png',
          I02: '/img/avatars/I02.png',
          I03: '/img/avatars/I03.png',
          I04: '/img/avatars/I04.png',
          I05: '/img/avatars/I05.png',
          J01: '/img/avatars/J01.png',
          J02: '/img/avatars/J02.png',
          J03: '/img/avatars/J03.png',
          J04: '/img/avatars/J04.png',
          J05: '/img/avatars/J05.png',
          K01: '/img/avatars/K01.png',
          K02: '/img/avatars/K02.png',
          K03: '/img/avatars/K03.png',
          K04: '/img/avatars/K04.png',
          K05: '/img/avatars/K05.png',
          L01: '/img/avatars/L01.png',
          L02: '/img/avatars/L02.png',
          L03: '/img/avatars/L03.png',
          L04: '/img/avatars/L04.png',
          L05: '/img/avatars/L05.png',
          M01: '/img/avatars/M01.png',
          M02: '/img/avatars/M02.png',
          M03: '/img/avatars/M03.png',
          M04: '/img/avatars/M04.png',
          M05: '/img/avatars/M05.png',
          N01: '/img/avatars/N01.png',
          N02: '/img/avatars/N02.png',
          N03: '/img/avatars/N03.png',
          N04: '/img/avatars/N04.png',
          N05: '/img/avatars/N05.png',
          O01: '/img/avatars/O01.png',
          O02: '/img/avatars/O02.png',
          O03: '/img/avatars/O03.png',
          O04: '/img/avatars/O04.png',
          O05: '/img/avatars/O05.png'
        }

      };
      var completed = 0;
      var len = 0;
      var self = this;

      // calculate size of images array so we know when all images have been preloaded
      _.each(images, function(value, key) {
        if (_.isString(value)) len++;
        else len += _.size(value);
      });

      function preload(name, src, callback, subkey) {
        var i = new Image();
        i.src = src;
        i.onload = function() {
          callback.call(self, name, i, subkey);
        };
      }

      function done(name, image, subkey) {
        if (subkey) images[subkey][name] = image;
        else images[name] = image;
        completed++;
        $('#overlay .bar').css('width', (completed/len*100) + '%');
        if (completed === len) {
          callback.call(self, images);
        }
      }

      _.each(images, function(value, key) {
          if (_.isObject(value)) {
            _.each(value, function(v, k) {
              preload(k, v, done, key);
            });
          } else {
            preload(key, value, done);
          }
      });

    },

    addPlayer: function(model) {
      var seat = model.get('seat');

      // get current screen's user
      if (model.get('name') === this.views.register.model.get('name') &&
        model.get('avatar') === this.views.register.model.get('avatar')) {
        this.user = model;
        this.views.chat.name = model.get('name');
        model.user = model;
        model.trigger('change:cards', model, model.get('cards'));
      }

      switch (seat) {
        case 0:
          model.group.setX(this.stage.attrs.width - model.group.width / 2);
          model.group.setY(this.stage.attrs.height / 2);
          break;
        case 1:
          model.group.setX(this.stage.attrs.width / 2);
          model.group.setY(this.stage.attrs.height - model.group.height / 2);
          break;
        case 2:
          model.group.setX(this.stage.attrs.width / 2);
          model.group.setY(model.group.height / 2);
          break;
        case 3:
          model.group.setX(model.group.width / 2);
          model.group.setY(this.stage.attrs.height / 2);
          break;
      }
      this.layers.players.add(model.group);
      this.stage.draw();
    },

    updateStage: function() {
      this.stage.draw();
    },

    displayActions: function(model) {
      var status = model.get('status');
      if (model == this.user && status === 'TURN') {
        this.$('#actions').show();
      } else {
        //this.$('#actions').hide();
      }
    },

    updateActionButtons: function(model, buttons) {
      if (model == this.user) {
        this.$('#actions button').hide();
        _.each(buttons, function(button) {
          this.$('#actions, #actions button#' + button.toLowerCase()).show();
        });
      }
    },

    setUser: function(model) {
      this.players.each(function(player) {
        if (player.id === model.id) {
          this.user = player;
        }
      });
    },

    call: function() {
      var data = {
        id: this.user.id,
        seat: this.user.get('seat'),
        action: 'CALL'
      };

      this.user.save(data, { data: data });
      this.$('#actions').hide();
    },

    check: function() {
      console.log('check');
      var data = {
        id: this.user.id,
        seat: this.user.get('seat'),
        action: 'CHECK'
      };

      this.user.save(data, {data: data});
      this.$('#actions').hide();
    },

    bet: function() {
      var amount = this.$('#actions input').val();
      var data = {
        id: this.user.id,
        seat: this.user.get('seat'),
        amount: parseInt(amount, 10),
        action: 'BET'
      };

      this.user.save(data, { data: data });
      this.$('#actions').hide();
    },

    raise: function() {
      var amount = this.$('#actions input').val();
      var data = {
        id: this.user.id,
        seat: this.user.get('seat'),
        amount: parseInt(amount, 10),
        action: 'RAISE'
      };

      this.user.save(data, { data: data });
      this.$('#actions').hide();
    },

    fold: function() {

      var data = {
        id: this.user.id,
        seat: this.user.get('seat'),
        action: 'FOLD'
      };

      this.user.save(data, { data: data });
      this.user.foldCards();
      this.$('#actions').hide();
    },

    generateCards: function() {
      // construct animations
      var suites = ['C', 'D', 'H', 'S'];
      var ranks = [null, 'A', 2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K'];
      var dim = {
        width: 92,
        height: 128
      },
      smallDim = {
        width: 69,
        height: 96
      }
      var animations = {
        back: [{
          x: 0,
          y: 0,
          width: dim.width,
          height: dim.height
        }]
      };
      var smallAnimations = {
        back: [{
          x: 0,
          y: 0,
          width: smallDim.width,
          height: smallDim.height
        }]
      };

      _.each(suites, function(suite, i) {
        _.each(ranks, function(rank, j) {
          var props;
          if (rank) {
            animations['' + rank + suite] = animations[suite + rank] = [{
              x: j * dim.width,
              y: i * dim.height,
              width: dim.width,
              height: dim.height
            }];
            smallAnimations['' + rank + suite] = smallAnimations[suite + rank] = [{
              x: j * smallDim.width,
              y: i * smallDim.height,
              width: smallDim.width,
              height: smallDim.height
            }];
          }
        });
      });

      // create cards sprite
      this.sprites.cards = {
        id: 'cards',
        x: 200,
        y: 200,
        image: this.images.cardSprites,
        animation: 'back',
        animations: animations,
        frameRate: 1,
        shadow: {
          alpha: 0.5,
          offset: {
            x: 1,
            y: 1
          }
        }
      };

      this.sprites.smallCards = {
        id: 'smallCards',
        x: 400,
        y: 400,
        image: this.images.cardSpritesSmall,
        animation: 'back',
        animations: smallAnimations,
        frameRate: 1
      };

    },

    moveChips: function(model, status) {
      if (status === 'WINNER') {
        var layer = this.layers.players;
        var chips = this.views.table.shapes.chips.clone();
        layer.add(chips);

        model.flipCards(function() {
          model.trigger('animation:begin');

          var position = model.group.getPosition();
          chips.transitionTo({
            x: position.x,
            y: position.y,
            duration: 1,
            alpha: 0,
            easing: 'strong-ease-out',
            callback: function() {
              model.trigger('animation:end')
              layer.remove(chips);
            }
          });

        });
      }
    },

    debug: function() {
      this.players.consume();
      this.views.table.model.consume();
    },

    reset: function() {
      window.socket.emit('table:reset');

    },

    profitOrLoss: function(model, chips) {
      var
        previousChips = model.previous('chips'),
        layer,
        position,
        currency,
        transition;


      // show animation
      if (!_.isUndefined(previousChips)) {
        layer = this.layers.effects;
        position = model.group.getPosition();
        currency = new Kinetic.Text(_.extend({
          fontFamily: 'Helvetica',
          text: '$',
          fontSize: 20,
          textStrokeWidth: 1,
          align: 'center',
          width: 100,
          height: 100,
          offset: {
            x: 50,
            y: 50
          }
        }, position));
        transition = {
          alpha: 0,
          easing: 'ease-out',
          scale: { x: 2, y: 2 },
          callback: function() {
            model.trigger('animation:end');
            layer.remove(this);
          },
          duration: 2,
          alpha: 0,
        };

        layer.add(currency);
        if (chips > previousChips) {
          currency.setAttrs({
            textFill: 'green',
            textStroke: 'gold',
          });
          model.trigger('animation:begin');
          currency.transitionTo(transition);
        } else if (chips < previousChips){
          currency.setAttrs({
            textFill: 'red',
            textStroke: 'black',
          });
          model.trigger('animation:begin');
          currency.transitionTo(transition);
        }
      }
    },




  });

  return AppView;
});
