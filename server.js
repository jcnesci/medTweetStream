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

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var apiRouting    = require('./routes/api');

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

	console.log("Using Alex's keys");
	 //Alex's keys
	 var T = new Twit({
	     consumer_key: 'P8EYI0gloJoDTOu8596QcUn1c'
	   , consumer_secret: 'Ya8PmkQxm7FLdQ6coftOi65hSedUNevFVil0kApw45YEI22mMd'
	   , access_token: '234878749-OlktDQaRgvr6hkBoQ4kI94y7sxI1EfpOlH17rwTG'
	   , access_token_secret: 'nKpgBcCd20RFXeASCLwACtA80PnEmvBJ6kJcaeA4oSO4a'
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
  // // Everytime there's a new tweet, emit a event passing the tweet.
  // var stream = T.stream('statuses/filter', { track: stream_phrase });
  // stream.on('tweet', function (tweet) {
  //   socket.emit('twitter_stream', tweet);
  // });

});

// --- STREAM OFF FOR NOW ---
// // Everytime there's a new tweet, emit a event passing the tweet.
// var stream = T.stream('statuses/filter', { track: stream_phrase });
// stream.on('tweet', function (tweet) {
//   socket.emit('twitter_stream', tweet);
// });

// START THE SERVER
// =============================================================================
//app.listen(port);
server.listen(port);
console.log('Magic happens on port ' + port);