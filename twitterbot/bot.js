/**
 * Using Twitter and NFLArrests.com's APIs to get
 * a random player in the NFL that has an arrest
 * record and tweet that arrest report.
 */
//install all packages with npm to run.
var Twit = require('twit');                             //Twitter API package from npm.
var twitterOAth = require('./twitterOAuthTemplate');    //Outside js file that contains Twitter OAuth info. (Replaced with twitterOAuthTemplate to keep auth keys secret.)
var request = require('sync-request');                  //Sycronous HTTP requests package from npm
var T = new Twit(twitterOAth);
var tweetArray = [];
var teamID = '';

//Returns a random team id.
teamID = getNFLTeam();

//Returns a string array with each index in the array
//being an individual tweet.
tweetArray = getNFLTeamArrests(teamID);
//Posts each tweet in the tweets array.
if (tweetArray.length > 0) {
    for (var i = 0; i < tweetArray.length; i++) {
        postTweet(tweetArray[i]);
    }
}

/**
 * Sends a GET Request to MFLArrests.com to get 
 * a random team in the NFL.
 * Returns the abreviation of the random team.
 */
function getNFLTeam() {
    var data = request('GET', 'http://nflarrest.com/api/v1/team');
    data = JSON.parse(data.getBody('utf8'));
    var element = data[Math.floor(Math.random() * data.length)];    //gets a random nfl team from the JSON query.
    return element.Team;
}

/**
 * Sends GET request to NFLArrests.com to get the a random arrest
 * report from the provide team.
 * @param {string} teamName 
 */
function getNFLTeamArrests(teamName) {
    var data = request('GET', 'http://nflarrest.com/api/v1/team/arrests/' + teamName);
    var tweets = [];
    data = JSON.parse(data.getBody('utf8'));
    var playerArrest = data[Math.floor(Math.random() * data.length)];    //gets random player from the randomly selected NFL team.
    var tweet = 'Date: ' + playerArrest.Date + '\nName: ' + playerArrest.Name + '\nTeams: ' + playerArrest.Team_preffered_name + '\nEncounter: ' + playerArrest.Encounter + '\nCategory: ' + playerArrest.Category + '\nDescription: ' +
     playerArrest.Description + '\nOutcome: ' + playerArrest.Outcome + '\nArrestSeasonState: ' + playerArrest.ArrestSeasonState;
    var tLength = tweet.length;
    //Checks to see if the tweet length is >=  140 characters
    //if it is we need to split up the tweet into multiple tweets.
    if (tLength >= 140) {
        //Gets the number of tweets needed to tweet the entire string.
        //eg. Tweet of length 327 will need 3 individual tweets to tweet entire string.
        var numOfTweets = Math.ceil(tLength / 140);
        var count = 0;
        for (var i = 0; i < numOfTweets; i++) {
            //Uses count + 136 to account for the characters before the substring.
            //((i + 1) + '.\n') this results in 4 characters.
            tweets.push((i + 1) + '.\n' + tweet.substring(count, count + 136));
            count = count + 136;
        }
        return tweets;
    }
}

/**
 * Uses Twitter API to post a tweet.
 * @param {string} tStatus 
 */
function postTweet(tStatus) {
    T.post('statuses/update', {
        status: tStatus
    }, function (err, data, response) {
        if (err)
            console.log(err);
        else
            console.log('The tweet has been posted.');
    });
}