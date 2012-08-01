define(function(require, exports, module) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var Kinetic = require('kinetic');

  var EffectsView = Backbone.View.extend({
    /*
     * Properties
     */
    layer: null,
    transitions: {
      spray: []
    },

    /*
     * Functions
     */
    initialize: function() {
      this.layer = this.options.layer;
      this.layer.hide();
    },

    render: function() {
      // add the different types of effects
      for(var i=0; i<50; i++) {
        var scale = Math.random();
        var shape = new Kinetic.Ellipse({
          name: 'spray',
          radius: 50,
          scale: {
            x: scale,
            y: scale
          },
          //rotationDeg: Math.random() * 180,
          fill: 'red',
          stroke: 'purple',
          strokeWidth: 10,
          alpha: 0.5,
          x: this.layer.getStage().getWidth() / 2,
          y: this.layer.getStage().getHeight() / 2,
        });

        this.layer.add(shape);
      }
    },

    spray: function() {
      var
        durations = [],
        self = this;

      // show layer
      this.layer.show();

      // iterate through spray shapes and transition
      _.each(this.layer.get('.spray'), function(shape) {
        var x, y, x1, x2, x12, x22,
        duration = Math.random() * 5 + 0.1;

        // calculate points around circle
        do {
          x1 = Math.random() * 2 - 1;
          x2 = Math.random() * 2 - 1;
          x12 = Math.pow(x1, 2);
          x22 = Math.pow(x2, 2);
        } while(x12 + x22 >= 1);

        x = (x12 - x22) / (x12 + x22);
        y = (2 * x1 * x2) / (x12 + x22);

        durations.push(duration);
        this.transitions.spray.push(shape.transitionTo({
          x: this.layer.getStage().getWidth() / 2 + x * this.layer.getStage().getWidth() / 2,
          y: this.layer.getStage().getHeight() / 2 + y * this.layer.getStage().getHeight() / 2,
          //x: stage.getWidth() / 2 + (Math.random() * 2 - 1) * stage.getWidth() / 2,
          //y: stage.getHeight() / 2 + (Math.random() * 2 - 1) * stage.getHeight() / 2,
          alpha: 0,
          duration: duration,
          easing: 'ease-out',
          callback: function() {
            if (duration === _.max(durations)) {
              // hide layer at end of animation
              self.layer.hide();
              self.resetSpray();
            }
          }
        }));
      }, this);
    },

    resetSpray: function() {
      var
        stage = this.layer.getStage(),
        dim = stage.getSize(),
        shapes = this.layer.get('.spray');

      // stop animations
      _.each(this.transitions.spray, function(transition) {
        transition.stop();
      });

      // remove transitions
      this.transitions.spray = [];

      _.each(shapes, function(shape) {
        shape.setPosition(dim.width / 2, dim.height / 2);
        shape.setAlpha(0.5);
      });

      // hide layer
      this.layer.hide();

    }
  });

  return EffectsView;

});
