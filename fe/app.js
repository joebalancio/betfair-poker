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
  io = require('socket.io').listen(server),
  _ = require('underscore'),
  poker = require('./lib/node-poker'),
  monomi = require('monomi'),
  TestScenarios = require('./scenarios');

io.configure(function() {
  io.set('log level', 1);
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
});


/*
 * Middleware
 */
app.configure(function() {
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(monomi.detectBrowserType());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(require('./lib/jade-middleware')({
    src: __dirname + '/public'
  }));
  app.use(exposeModule('jade/runtime.js', '/js/libs/jade/runtime.js'));
  /*
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
  */
  app.use(express.static(path.join(__dirname, 'public')));
});

function exposeModule(module, path) {
  return function(req, res, next) {
    var jadeRuntimePath = path;
    var modulePath = require.resolve(module);
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
  }
}

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

var
  table = new poker.Table(50, 100, 3, 10, 'table_1', 100, 1000),
  ids = [],
  idCounter = 0;

function passthrough(data) {
  return data;
}

function tableJson(table, socket, callback) {
  var t;
  if (!table.game) return callback({status: null, cards: [], pot: 0});
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
      if (player.table.positions.dealer === index) {
        position = 'dealer';
      } else if (player.table.positions.smallBlind === index) {
        position = 'small blind';
      } else if (player.table.positions.bigBlind === index) {
        position = 'big blind';
      }
    }

    return {
      chips: player.chips,
      id: player.id,
      seat: player.id,
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

/*
io.sockets.on('connection', function(socket) {
  socket.on('load', function() {
    // get initial state
    socket.emit('table:read', tableJson(table, socket, passthrough));
    socket.emit('players:read', playersJson(table.players, socket, passthrough));
  });

  socket.on('player:create', function(data) {
    var id = idCounter++;
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

      socket.emit('table:read', tableJson(table, socket, passthrough));
      socket.broadcast.emit('table:read', tableJson(table, socket, passthrough));
    }

    socket.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.broadcast.emit('players:read', playersJson(table.players, socket, passthrough));

    var now = new Date();
    var message = {
      timestamp:  now.getHours() + ':' + now.getMinutes(),
      message: data.name + ' joined',
      name: 'sentinel'
    };
    socket.emit('messages:read', message);
    socket.broadcast.emit('messages:read', message);
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
    //player.status = '';

    // activate next player
    if (++index === table.players.length) index = 0;
    //table.players[index].status = 'turn';

    switch (data.action.toLowerCase()) {
      case 'bet':
        player.Bet(data.amount);
        var now = new Date();
        var message = {
          timestamp:  now.getHours() + ':' + now.getMinutes(),
          message: player.playerName + ' bet ' + data.amount + ' chips.',
          name: 'dealer'
        };
        table.game.pot += data.amount;
        break;
      case 'check':
        player.Check();
        var now = new Date();
        var message = {
          timestamp:  now.getHours() + ':' + now.getMinutes(),
          message: player.playerName + ' checked.',
          name: 'dealer'
        };
        break;
      case 'call':
        player.Call();
        var now = new Date();
        var message = {
          timestamp:  now.getHours() + ':' + now.getMinutes(),
          message: player.playerName + ' called.',
          name: 'dealer'
        };
        table.game.pot += 50;
        break;
      case 'fold':
        player.Fold();
        var now = new Date();
        var message = {
          timestamp:  now.getHours() + ':' + now.getMinutes(),
          message: player.playerName + ' folded.',
          name: 'dealer'
        };
        break;
    }
    socket.emit('messages:read', message);
    socket.broadcast.emit('messages:read', message);
    socket.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.broadcast.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.emit('table:read', tableJson(table, socket, passthrough));
    socket.broadcast.emit('table:read', tableJson(table, socket, passthrough));
  });

  socket.on('table:reset', function(data) {
    table = new poker.Table(50, 100, 3, 10, 'table_1', 100, 1000),
    ids = [],
    idCounter = 0;

    socket.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.broadcast.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.emit('table:read', tableJson(table, socket, passthrough));
    socket.broadcast.emit('table:read', tableJson(table, socket, passthrough));
  });

  table.on('change:round', function(roundName) {
    if (roundName === 'Showdown') {
      setTimeout(function() {
        table.NewHand();
      }, 5000);
    }
    socket.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.broadcast.emit('players:read', playersJson(table.players, socket, passthrough));
    socket.emit('table:read', tableJson(table, socket, passthrough));
    socket.broadcast.emit('table:read', tableJson(table, socket, passthrough));
    var now = new Date();
    var message = {
      timestamp:  now.getHours() + ':' + now.getMinutes(),
      message: 'Round: ' + roundName,
      name: 'sentinel'
    };
    socket.emit('messages:read', message);
  });
});
//*/

//*
io.sockets.on('connection', TestScenarios.transitionFromRiverToDeal);
//*/
