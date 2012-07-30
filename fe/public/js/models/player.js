define(function(require,exports,modules) {
	var Backbone = require('backbone');
	var Player = Backbone.Model.extend({
    group: null,
		initialize: function() {
      this.group = new Kinetic.Group;
      this.on('add change', this.update, this);
      this.shapes = {
        name: new Kinetic.Text({
          text: '',
          textFill: 'red'
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
        outline: new Kinetic.Rect({
          stroke: 'white',
          width: 100,
          height: 100,
          y: 0
        })
      };
      _.each(this.shapes, function(shape) {
        this.group.add(shape);
      }, this);
		},
    update: function(model) {
      _.each(this.shapes, function(shape, name) {
        if (shape instanceof Kinetic.Text) {
          if (model.get(name)) shape.setText('' + model.get(name));
        } else if (shape instanceof Kinetic.Rect) {
          if (model.get('active')) shape.show();
          else shape.hide();
        }
      }, this);
    }
	});
	return Player;
});
