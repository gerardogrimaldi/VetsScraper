var worker      = require('./routes/worker.js');
var mongoose    = require('mongoose');

mongoose.connect('mongodb://mascoteros:mascoteros@ds061371.mongolab.com:61371/heroku_app35295284');


worker.start
