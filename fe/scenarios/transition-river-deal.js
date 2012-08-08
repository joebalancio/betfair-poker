module.exports = function(socket) {
  socket.on('load', function() {
    var table = {
      status: 'RIVER',
      cards: ['JC','2D','QD','AD','7H'],
      pot: 12,
    },
    players = [{
      chips: 9996,
      id: 14,
      seat: 0,
      name: 'joe',
      avatar: 'FD05',
      position: 'DEALER',
      status: 'TURN',
      cards: ['5C','KC'],
      actions: ['FOLD', 'CHECK', 'BET']
    }, {
      chips: 9996,
      id: 15,
      seat: 1,
      name: 'john',
      avatar: 'FH04',
      position: 'SMALL BLIND',
      status: 'CONTINUE',
      cards: ['9C','9D'],
      action: []
    }, {
      chips: 9996,
      id: 16,
      seat: 2,
      name: 'jacob',
      avatar: 'FH05',
      position: 'BIG BLIND',
      status: 'CONTINUE',
      cards: ['6H','4H'],
      actions: []
    }];

    var newTable = {
      status: 'DEAL',
      cards: [],
      pot: 0
    };
    // get initial state
    socket.emit('table:read', table);
    socket.emit('players:read', players);

    delay = 1000;
    setTimeout(function() {
      table.status = 'SHOWDOWN';
      table.pot = 0;
      players[0].status = 'CONTINUE';
      players[0].actions = [];

      players[1].status = 'WINNER';
      players[1].chips = 10008;

      players[2].status = 'CONTINUE';

      socket.emit('table:read', table);
      socket.emit('players:read', players);
    }, delay);

    delay += 1000;
    setTimeout(function() {
      players[0].position = 'NONE';
      players[0].status = 'CONTINUE';
      players[1].position = 'NONE';
      players[1].status = 'CONTINUE';
      players[2].position = 'NONE';
      players[2].status = 'CONTINUE';

      socket.emit('table:read', table);
      socket.emit('players:read', players);
    }, delay);

    delay += 1000;
    setTimeout(function() {
      table.status = 'DEAL'
      table.pot = 6;
      table.cards = [];
      players[0].position = 'BIG BLIND';
      players[0].chips = 9992;
      players[0].cards = ['7S', '7H'];
      players[0].status = 'CONTINUE';

      players[1].position = 'DEALER';
      players[1].status = 'TURN';
      players[1].actions = ['RAISE','FOLD','CALL'];
      players[1].cards = ['4H', 'TC'];

      players[2].position = 'SMALL BLIND';
      players[2].chips = 9994;
      players[2].status = 'CONTINUE';
      players[2].cards = ['TS', 'JH'];

      socket.emit('table:read', table);
      socket.emit('players:read', players);
    }, delay);
  });
};
