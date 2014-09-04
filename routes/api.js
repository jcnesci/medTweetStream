var express    = require('express');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/test'); // connect to our database
var Tweet     = require('../app/models/tweet');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /tweets
// ----------------------------------------------------
router.route('/tweets')

	// create a tweet (accessed at POST http://localhost:8080/tweets)
	.post(function(req, res) {
		
		var tweet = new Tweet();		// create a new instance of the Tweet model
		tweet.name = req.body.name;  // set the tweets name (comes from the request)

		tweet.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Tweet created!' });
		});

		
	})

	// get all the tweets (accessed at GET http://localhost:8080/api/tweets)
	.get(function(req, res) {
		Tweet.find(function(err, tweets) {
			if (err)
				res.send(err);

			res.json(tweets);
		});
	});

// on routes that end in /tweets/:tweet_id
// ----------------------------------------------------
router.route('/tweets/:tweet_id')

	// get the tweet with that id
	.get(function(req, res) {
		Tweet.findById(req.params.tweet_id, function(err, tweet) {
			if (err)
				res.send(err);
			res.json(tweet);
		});
	})

	// update the tweet with this id
	.put(function(req, res) {
		Tweet.findById(req.params.tweet_id, function(err, tweet) {

			if (err)
				res.send(err);

			tweet.name = req.body.name;
			tweet.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Tweet updated!' });
			});

		});
	})

	// delete the tweet with this id
	.delete(function(req, res) {
		Tweet.remove({
			_id: req.params.tweet_id
		}, function(err, tweet) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

module.exports = router;
