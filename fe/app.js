/**
 * Module dependencies.
 */

var express = require('express'),
  app = express(),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  jade = require('jade'),
  url = require('url');
  mkdirp = require('mkdirp'),
  server = http.createServer(app),
  io = require('socket.io').listen(server, {debug: true}),
  _ = require('underscore'),
  poker = require('./lib/node-poker');


/*
 * Middleware
 */
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(require('./lib/jade-middleware')({
    src: __dirname + '/public'
  }));
  app.use(function(req, res, next) {
    var jadeRuntimePath = '/js/libs/jade/runtime.js';
    var modulePath = require.resolve('jade/runtime.js');
    var dest = __dirname + '/public' + jadeRuntimePath;

    if ('GET' != req.method && 'HEAD' != req.method) return next();
    if (url.parse(req.url).pathname !== jadeRuntimePath) return next();

    fs.readFile(modulePath, 'utf8', function(err, str) {
      if (err) return next(err);
      fs.stat(dest, function(err, stats) {
        if (!err) return next();
        mkdirp(path.dirname(dest), 0777, function(err){
          if (err) return next(err);
          str = 'define(function() {\n' + str + '\nreturn jade;\n});';
          fs.writeFile(dest, str, 'utf8', next);
        });
      });
    });
  });
  app.use(express.static(path.join(__dirname, 'public')));
});

/*
 * Development-specific middleware
 */
app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Routes
 */
app.get('/', routes.index);

/*
 * Listen
 */
server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

/*
 * Socket.IO
 */
io.sockets.on('connection', function(socket) {
  //socket.on('start', testJoinGame(socket));
  //socket.on('start', dummydata1(socket));
  //socket.on('start', demoActions(socket));
  //socket.on('start', startEmptyTable(socket));
  //socket.on('start', endOfHandToStartOfHand(socket));
  //socket.on('start', playerRegistration(socket));

  socket.on('message:create', function(data, callback) {
    var now = new Date();
    data.timestamp = now.getHours() + ':' + now.getMinutes();
    socket.emit('messages:read', data);
    socket.broadcast.emit('messages:read', data);
    callback(null, data);
  });


});

function testJoinGame(socket) {
  return function(data) {
    var table = {
      cards: [],
      pot: 0,
      availableSeats: [1]
    },
    players = [{
      name: 'joebalancio',
      id: 1,
      seat: 1,
      position: 'd',
      chips: 100,
      avatar: 'J01'
    }, {
      name: 'paleailment',
      id: 2,
      seat: 2,
      position: 'sb',
      chips: 100,
      avatar: 'A05'
    }, {
      name: 'philipkim',
      id: 3,
      seat: 4,
      position: 'bb',
      chips: 100,
      avatar: 'D03'
    }],
    newPlayer = {
      name: 'subhashini',
      id: 4,
      position: null,
      seat: 3,
      chips: 100,
      active: true,
      cards: ['as', 'as'],
      avatar: 'FD01'
    }

    // get the initial state
    socket.emit('players:read', players);
    socket.emit('table:read', table);

    socket.on('player:create', function(data, callback) {
      newPlayer.actions = ['check', 'fold', 'raise', 'call'];
      players.push(newPlayer);
      socket.emit('players:read', players);
      var now = new Date();
      now = now.getHours() + ':' + now.getMinutes();

      //table.gamePlayerId = newPlayer.id;
      socket.emit('table:read', table);
      socket.emit('messages:read', {
        message: newPlayer.name + ' joined!',
        name: 'sentinel',
        timestamp: now
      });
    });

    socket.on('player:update', function(data, callback) {
      console.log(data);
      switch (data.action) {
        case 'call':
          table.pot += parseInt(data.amount, 10);
          table.cards = ['as','as','as'];
          for (var i=0; i<players.length; i++) {
            var player = players[i];
            console.log(player);
            if (player.id === data.id) player.chips -= data.amount;
          }
          break;
        case 'fold':
          break;
      }

      socket.emit('table:read', table);
      socket.emit('players:read', players);
    });

  }
}

function dummydata1(socket) {
  // emit table
  var table = {
    cards: [],
    pot: 0,
    availableSeat: [1]
  };

  var players = [{
    name: 'joebalancio',
    id: 1,
    seat: 1,
    position: 'd'
  }, {
    name: 'paleailment',
    id: 2,
    seat: 2,
    position: 'sb'
  }, {
    name: 'araabmuzik',
    id: 3,
    seat: 4,
    position: 'bb'
  }];

  return function(data) {
    socket.emit('table:read', table);
    socket.emit('players:read', players);

    var delay = 1000;
    var increment = 1000;

    // player 1's turn
    setTimeout(function() {
      players[0].active = true;
      socket.emit('players:read', players);
    }, delay);

    // player 1 raises 10
    // player 2 turn
    delay+=increment;
    setTimeout(function() {
      players[0].active = false;
      players[0].action = 'raise';
      players[0].amount = 10;

      players[1].active = true;

      table.pot += 10;

      socket.emit('players:read', players);
      socket.emit('table:read', table);
    }, delay);

    // player 2 call
    // player 3 turn
    delay+=increment;
    setTimeout(function() {
      players[1].active = false;
      players[1].action = 'call';
      players[1].amount = 10;

      players[2].active = true;
      table.pot += 10;
      socket.emit('players:read', players);
      socket.emit('table:read', table);
    }, delay);

    // player 3 call
    // table flop
    delay+=increment;
    setTimeout(function() {
      players[2].active = false;
      players[2].action = 'call';
      players[2].amount = 10;

      players[0].active = true;
      players[0].actions = ['check', 'raise', 'call', 'fold'];
      table.pot += 10
      table.cards = ['as', 'as', 'as'];
      socket.emit('players:read', players);
      socket.emit('table:read', table);
    }, delay);
  };
}

function startEmptyTable(socket) {
  // emit table
  var table = {
    cards: [],
    pot: 0,
    revealingOrder: []
  };

  var players = [];

  var player1 = {
    name: 'joe',
    id: 1,
    seat: 1,
    chips: 1000,
    avatar: 'J01',
    position: 'd'
  };
  var player2 = {
    name: 'justinjustinjustinjustin',
    id: 2,
    seat: 2,
    chips: 1000,
    avatar: 'J02',
    position: 'bb'
  };
  var player3 = {
    name: 'gary',
    id: 3,
    seat: 3,
    chips: 1000,
    avatar: 'J03',
    position: 'sb'
  };
  var player4 = {
    name: 'tony',
    id: 4,
    seat: 4,
    chips: 1000,
    avatar: 'J04'
  };

  return function() {
    socket.emit('players:read', players);
    socket.emit('table:read', table);

    socket.on('player:create', function(data) {
      players.push(player1);
      socket.emit('players:read', players);
      socket.emit('table:read', table);

      var delay = 1000;
      setTimeout(function() {
        players.push(player2);
        socket.emit('players:read', players);
        socket.emit('table:read', table);
      }, delay);

      delay+=1000
      setTimeout(function() {
        players.push(player3);
        socket.emit('players:read', players);
        socket.emit('table:read', table);
      }, delay);

      delay+=1000
      setTimeout(function() {
        players.push(player4);
        socket.emit('players:read', players);
        socket.emit('table:read', table);
      }, delay);
    });
  };
}

// Mock transition between rounds
function transitionRound(socket, round) {
  // emit table
  var table = {
    cards: [],
    pot: 100,
    revealingOrder: []
  };

  var players = [{
    name: 'joe',
    id: 1,
    seat: 1,
    chips: 100,
    avatar: 'J01'
  }, {
    name: 'namelongerthanjustin',
    id: 2,
    seat: 2,
    chips: 1004,
    avatar: 'J02'
  }, {
    name: 'gary',
    id: 3,
    seat: 3,
    chips: 100,
    avatar: 'J03'
  }, {
    name: 'tony',
    id: 4,
    seat: 4,
    chips: 100,
    avatar: 'J04'
  }];

  switch(round) {
    case 'preflop':
      preCards = [];
      postCards = ['as','as','as'];
      break;
    case 'flop':
      preCards = ['as','as','as'];
      postCards = ['as','as','as','as'];
      break;
    case 'turn':
      preCards = ['as','as','as','as'];
      postCards = ['as','as','as','as','as'];
      table.cards = ['as','as','as','as'];
      break;
    case 'river':
      preCards = ['as','as','as','as','as'];
      postCards = ['as','as','as','as','as'];
      break;
  }

  return function() {
    var delay = 1000;
    setTimeout(function() {
      table.cards = preCards;
      socket.emit('table:read', table);
      socket.emit('players:read', players);
    }, delay);

    delay += 1000;
    setTimeout(function() {
      table.cards = postCards;
      socket.emit('table:read', table);
      socket.emit('players:read', players);
    }, delay);
  };
}

// End of hand
function endOfHand(socket) {
  var table = {
    cards: ['as','as','as','as','as'],
    pot: 100
  };

  var players = [{
      name: 'joebalancio',
      id: 1,
      seat: 1,
      position: 'd',
      chips: 100,
      avatar: 'J01'
    }, {
      name: 'paleailment',
      id: 2,
      seat: 2,
      position: 'sb',
      chips: 100,
      avatar: 'A05'
    }, {
      name: 'philipkim',
      id: 3,
      seat: 4,
      position: 'bb',
      chips: 100,
      avatar: 'D03'
    }, {
      name: 'subhashini',
      id: 4,
      position: null,
      seat: 3,
      chips: 100,
      active: true,
      cards: ['as', 'as'],
      avatar: 'FD01'
    }];
  return function(data) {
    socket.emit('table:read', table);
    socket.emit('players:read', players);

    setTimeout(function() {
      table.winner = 1;
      socket.emit('table:read', table);
      socket.emit('players:read', players);
    }, 1000);
  };
}

// demo actions
function demoActions(socket) {
  var table = {
    cards: ['as','as','as'],
    pot: 100
  };

  var players = [{
      name: 'joebalancio',
      id: 1,
      seat: 1,
      position: 'd',
      chips: 100,
      cards: ['as','as'],
      active: true,
      actions: ['check','fold','raise','call'],
      avatar: 'J01'
    }, {
      name: 'paleailment',
      id: 2,
      seat: 2,
      position: 'sb',
      chips: 100,
      avatar: 'A05'
    }, {
      name: 'philipkim',
      id: 3,
      seat: 4,
      position: 'bb',
      chips: 100,
      avatar: 'D03'
    }, {
      name: 'subhashini',
      id: 4,
      position: null,
      seat: 3,
      chips: 100,
      avatar: 'FD01'
    }];
  return function(data) {
    socket.emit('table:read', table);
    socket.emit('players:read', players);

    socket.on('player:update', function(data) {
      _.each(players, function(player) {
        if (player.id === data.id) {
          delete player.actions;
          if (data.amount) {
            player.amount -= data.amount;
            table.pot += parseInt(data.amount, 10);
          }
          player.active = false;
          players[1].active=true;
          socket.emit('table:read', table);
          socket.emit('players:read', players);
        }
      });
    });
  };
}

function endOfHandToStartOfHand(socket) {
  var table = {
    status: 'showdown',
    cards: ['as','as','as','as','as'],
    pot: 100,
    winner: 1
  };

  var players = [{
      name: 'joebalancio',
      id: 1,
      seat: 1,
      position: 'd',
      chips: 100,
      cards: ['as','as'],
      avatar: 'J01'
    }, {
      name: 'paleailment',
      id: 2,
      seat: 2,
      position: 'sb',
      chips: 100,
      avatar: 'A05'
    }, {
      name: 'philipkim',
      id: 3,
      seat: 4,
      position: 'bb',
      chips: 100,
      avatar: 'D03'
    }, {
      name: 'subhashini',
      id: 4,
      position: null,
      seat: 3,
      chips: 100,
      avatar: 'FD01'
    }];
  return function() {
    setTimeout(function() {
      socket.emit('players:read', players);
      socket.emit('table:read', table);
    }, 1000);

    setTimeout(function() {
      players[0].position = '';
      players[1].position = 'd';
      players[2].position = 'sb';
      players[3].position = 'bb';
      players[table.winner].chips += table.pot;
      delete table.winner;
      table.pot = 0;
      _.each(players, function(player, index) {
        player.cards = ['over'];
      },this);
      table.status = 'deal';
      socket.emit('players:read', players);
      socket.emit('table:read', table);
    }, 3000);

  };
}

// player registration and avatar selection
function playerRegistration(socket) {
  var table = {
    cards: [],
    pot: 0
  },
  players = [];

  return function() {
    socket.emit('table:read', table);
    socket.on('player:create', function(data) {
      var player = _.extend({}, data);

      var now = new Date();
      now = now.getHours() + ':' + now.getMinutes();

      // assign id
      player.id = 1;
      player.chips = 100;
      player.active = true;
      player.position = 'd';
      player.seat = 1;
      player.actions = [];
      player.name = 'joe';

      players.push(player);

      socket.emit('players:read', players);
      socket.emit('messages:read', {
        message: player.name + ' joined!',
        name: 'sentinel',
        timestamp: now
      });
    });

  };
}

var
  table = new poker.Table(50, 100, 3, 10, 'table_1', 100, 1000),
  ids = [],
  idCounter = 0;

function passthrough(data) {
  return data;
}

function tableJson(table, socket, callback) {
  var t;
  if (!table.game) return callback({});
  return callback({
    status: table.game.roundName,
    cards: table.game.board,
    pot: table.game.pot,
    user: socket.user
  });
}

function playersJson(players, socket, callback) {
  // if table has started, identify the active user
  // if start then dealer is active
  return callback(_.map(players, function(player, index) {
    var position;
    if (player.table.game) {
      if (player.table.dealer === index) {
        position = 'd';
      } else if (player.table.smallBlindPlayer === index) {
        position = 'sb';
      } else if (player.table.bigBlindPlayer === index) {
        position = 'bb';
      }
    }

    return {
      chips: player.chips,
      id: player.id,
      seat: index + 1,
      name: player.name,
      avatar: player.avatar,
      position: position,
      status: player.status,
      cards: player.cards
    };
  }));
}

function filterPlayersForBroadcast(players) {
  return _.map(players, function(player) {
    return _.pick(player, 'chips', 'id', 'seat', 'name', 'avatar', 'position', 'status', 'cards');
  });
}

io.sockets.on('connection', function(socket) {
  socket.on('load', function() {
    // get initial state
    socket.emit('table:read', tableJson(table, socket, passthrough));
    socket.emit('players:read', playersJson(table.players, socket, passthrough));
  });

  socket.on('player:create', function(data) {
    var id = ++idCounter;
    socket.user = id;
    ids.push(id);
    table.AddPlayer(data.name, 500);
    _.extend(_.last(table.players), data, {
      id: id
    });


    // check if minimum players
    if (table.players.length >= table.minPlayers && table.players.length <= table.maxPlayers) {
      // start game
      table.StartGame();

      // activate dealer
      if (table.game && table.game.roundName === 'Deal') {
        table.players[table.dealer].status = 'turn';
      }
      socket.emit('table:read', tableJson(table, socket, passthrough));
      socket.broadcast.emit('table:read', tableJson(table, socket, passthrough));
    }

    socket.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.broadcast.emit('players:read', playersJson(table.players, socket, passthrough));
  });

  socket.on('player:update', function(data) {
    var index, player;

    _.each(table.players, function(p, i) {
      if (p.id === socket.user && p.id === data.id) {
        player = p;
        index = i;
        return;
      }
    });

    if (!player) return;

    // deactivate player
    player.status = '';

    // activate next player
    if (++index === table.players.length) index = 0;
    table.players[index].status = 'turn';

    switch (data.action) {
      case 'bet':
        player.Bet(data.amount);
        break;
      case 'check':
        player.Check();
        break;
      case 'call':
        player.Bet();
        break;
      case 'fold':
        player.Bet();
        break;
    }

    socket.emit('table:read', tableJson(table, socket, passthrough));
    socket.broadcast.emit('table:read', tableJson(table, socket, passthrough));
    socket.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.broadcast.emit('players:read', playersJson(table.players, socket, passthrough));

    if (table.game.roundName === 'Showdown') {
      delete table.game;
      table.StartGame();
    }
  });

});
