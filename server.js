// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var apiRouting    = require('./routes/api');

// REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouting);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);