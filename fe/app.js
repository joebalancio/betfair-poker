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
  io = require('socket.io').listen(server, {debug: true});


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
  // emit table
  var table = {
    cards: [],
    pot: 0,
    availableSeat: [1]
  };
  var players = [{
    name: 'joebalancio',
    id: 1,
    seat: 1
  }, {
    name: 'paleailment',
    id: 2,
    seat: 2
  }, {
    name: 'araabmuzik',
    id: 3,
    seat: 4
  }];
  socket.on('start', function(data) {
    socket.emit('table:read', table);
    socket.emit('players:read', players);

    var delay = 1000;
    var increment = 2000;

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
      table.pot += 10
      table.cards = ['as', 'as', 'as'];
      socket.emit('players:read', players);
      socket.emit('table:read', table);
    }, delay);

  });

  socket.on('message:create', function(data, callback) {
    var now = new Date();
    data.timestamp = now.getHours() + ':' + now.getMinutes();
    data.player.name = 'joebalancio';
    socket.emit('messages:create', data);
    socket.broadcast.emit('messages:create', data);
    callback(null, data);
  });

});
