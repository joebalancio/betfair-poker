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
  socket.on('message:create', function(data, callback) {
    var now = new Date();
    data.timestamp = now.getHours() + ':' + now.getMinutes();
    data.player.name = 'joebalancio';
    console.log(data);
    socket.emit('messages:create', data);
    socket.broadcast.emit('messages:create', data);
    callback(null, data);
  });
});
