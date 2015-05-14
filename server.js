var express     = require('express');
var worker      = require('./routes/worker.js');
var http        = require('http');
var mongoose    = require('mongoose');

mongoose.connect('mongodb://mascoteros:mascoteros@ds061371.mongolab.com:61371/heroku_app35295284');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3999);
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// CORS header securiy
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.get ('/start', worker.start);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port %s in %s mode.",  app.get('port'), app.settings.env);
});