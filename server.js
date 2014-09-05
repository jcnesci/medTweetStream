// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var http			 = require('http');
var server = http.createServer(app);
var logger		 = require('morgan');
var Twit 			 = require('twit');
var io				 = require('socket.io').listen(server);

var theFilter    = require('./app/filter');

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var apiRouting    = require('./app/routes/api');

app.use(logger());
app.use(express.static(__dirname + '/public'));
app.use(function(req, res){
  res.send('Hello');
});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouting);

// Open a socket to stream results continuously to our webpage.
io.on('connection', function (socket) {
  console.log('A new user connected!');

	var twitterQuery_1 = "BarackObama";
	var stream_phrase = "football";

	console.log("Using Soso's keys");
	 //Soso's keys
	 var T = new Twit({
	     consumer_key: 'VcbBCP1R4gIdm6ATuxov2Fwry'
	   , consumer_secret: '41HftuMjsy76LE9CYVoyeTl1VZXtXjqNWlQ4pupanSYSH8IF4P'
	   , access_token: '48737760-qMEip7MXDoTBKriFTdB9qOPhqH5Ty7iPAnl2ph1c2'
	   , access_token_secret: 'eFy6yZ86b5aT4fpkXzwIWB94GJwiCffL4chJe8WDDyA93'
	});


	// Twitter API usage - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Do REST search.
	T.get('statuses/user_timeline', { screen_name: twitterQuery_1, count: 10 }, function(err, data, response) {
	    if (err) {
	      console.log("ERROR- app.js- search #1.");
	      console.error(err.stack);
	    }
	    //console.log(data);
	    console.log("tweets pulled");
	    socket.emit('eTwitterGetResult_1', data);
	});

	// --- STREAM OFF FOR NOW ---
  // Everytime there's a new tweet, emit a event passing the tweet.
  var stream = T.stream('statuses/filter', { track: stream_phrase });
  stream.on('tweet', function (tweet) {
    socket.emit('twitter_stream', tweet);
  });

});

// START THE SERVER
// =============================================================================
//app.listen(port);
server.listen(port);
console.log('Magic happens on port ' + port);