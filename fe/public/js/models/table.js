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
    initialize: function() {
      this.ioBind('read', this.read, this);
    },
    read: function(model) {
      this.set(model);
    }

  });
  return Table;
})
