define('config', function(require, exports, module) {
  module.exports = {
    backend: {
      uri: 'ws://poker1.cp.sfo.us.betfair:9292/poker',
      //mock: true,
    },
    notifications: {
      uri: 'http://np1.cp.sfo.us.betfair:8181/cxf/rs/notifications/alertChannel',
      enable: true
    }
  };
});
