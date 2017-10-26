// import the modules
var Twit = require('twit');
var sentiment = require('sentiment');
const mongoose = require('mongoose');
const Tweet = require('./models/tweet');

// Use AP Key for Heaven on Demand and creat a new instance of heaven on demand client
// var client = new sentiment.HODClient('ba2be22a-dcea-4f2a-9b72-936c3cc1a092');

// create an instance of the Twit module for the Twitter API
var T = new Twit({
	consumer_key: '8mjiIPbzcR7r0aHeqyy4TFrIp',
	consumer_secret: 'USD1YldfaBCdiHeGfqY1kcy1fej9R1EMNROcU23TQ7DS2rc7nU',
	access_token: '820609363870121984-FERMXT77emOzr30urCTtn5BU01fU4O5',
	access_token_secret: 'Bsuu11HM7cJDqsUSSmIw1PkERlCkTwRIDsDQUcvkjPE4a',
});

var sentimentScore = 0;
var sentimentNom;
// var currentFilter = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
var currentFilter = 'trump';
// var stream = T.stream('statuses/filter', {track: "trump", language: 'en' });
var stream;
var usedTweets=[];

function getSentiment(text){
	return sentiment(text);
}
function streamListen(newStream){
	newStream.on('tweet', function (tweet) {
		streamExists=true;
		// console.log(tweet.text);
		// console.log("Tweet received!!!");
		var tempScore = 0;
		for(var i =0; i<10000;i++){ //perform sentiment analysis 250 times
			tempScore += getSentiment(tweet.text).score;
			// console.log(tempScore);
		}
		var score = tempScore/10000; //get the average sentiment analysis
		console.log(score);
		var tweetSentiment;
		if(score>0)tweetSentiment = "positive";
		if(score<0)tweetSentiment = "negative";
		if(score==0)tweetSentiment = "neutral";

		var sendTweet = new Tweet({
			user: tweet.user.screen_name,
			tweet: tweet.text,
			sentiment: tweetSentiment,
			sentimentScore: score
		});
		sendTweet.save();
		console.log("Tweet uploaded to database!")
        // dataTweet = {'text': tweet.text}
        // client.get('analyzesentiment', dataTweet, false, function(err, resp, body){
        //     if(!err){
		// 		var newTweet = new Tweet({
		// 			user: tweet.user.screen_name,
		// 			tweet: tweet.text,
		// 			sentiment: resp.body.aggregate.sentiment,
		// 			sentimentScore: resp.body.aggregate.score
		// 		});
				
		// 		newTweet.save();
		// 		console.log("Tweet uploaded to database!")
        //     } else {
		// 		console.log(err);
		// 		console.log("Sentiment analysis failed...");
		// 		// console.log(tweet.text);
        //     }
        // });
	});
	newStream.on('connect', function(){
		console.log('Attempting to connect...')
	});
	newStream.on('connected', function(){
		console.log('Connection attempt successful!!')
		connected = true;
	});
	newStream.on('disconnect', function(){
		console.log('Disconnected from stream')
	});
	newStream.on('reconnect', function(){
		console.log('Reconnect detected...')
	});
}
//connect to mongodb
mongoose.connect('mongodb://Allan:password@ds235065.mlab.com:35065/cab432');

mongoose.connection.once('open', function(){
	console.log('Successfully connected to the database!!');
	stream = T.stream('statuses/filter', {track: currentFilter, language: 'en' });
	streamListen(stream);
    
}).on('error', function(error){
    console.log('Connection error: ', error);
});
