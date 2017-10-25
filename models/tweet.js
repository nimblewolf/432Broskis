const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    user: String,
    tweet: String,
    sentiment: String,
    sentimentScore: Number
});

const Tweet = mongoose.model('tweet', tweetSchema);

module.exports = Tweet;