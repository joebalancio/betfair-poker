define(function(require,exports,modules) {
  var Backbone = require('backbone');
  var Table = Backbone.Model.extend({
    urlRoot: 'table',
    defaults: {
      id: null,
      seats: {},
      player_id: null,
      desired_seat: null,
      action: null
    },
    queue: [],

    initialize: function() {
      this.ioBind('read', this.default, this);
    },
    read: function(model) {
      this.queue.push(model);
    },
    consume: function() {
      console.log(this.queue);
      var model;
      if (!this.queue.length) return;
      model = this.queue.shift();
      console.log(model, this.queue);
      this.set(this.queue.shift());
    },
    default: function(model) {
      this.set(model);
    }

  });
  return Table;
})
