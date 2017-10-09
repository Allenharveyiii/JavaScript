/**
 * Start of bot.js
 */
const http = require('http');
const Twit = require('twit');
const twitterOAth = require('./twitterOAuth');

var T = new Twit(twitterOAth);
var tweet = '';
var tweets = [];
var teamID = '';
getNFLTeam();
setTimeout(function () {
    var pinky = getNFLTeamArrests(teamID);

    setTimeout(function () {
        //TODO: Fix promise functionality.
        //! Code only works because of setTimeout function.
        //!
        if (tweets.length > 0) {
            for (var i = 0; i < tweets.length; i++) {
                pinky.then(postTweet(tweets[i]));
            }
        } else {
            pinky.then(postTweet(tweet));
        }
    }, 2000);
}, 2000);


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

function getNFLTeamArrests(teamName) {
    let pinky = new Promise(function (resolve, reject) {
        http.get('http://nflarrest.com/api/v1/team/arrests/' + teamName, (resp) => { 
            let data = '';  // A chunk of data has been received.
             
            resp.on('data', (chunk) => {  
                data += chunk; 
            });

              // The whole response has been received. Print out the result.
             
            resp.on('end', () => {
                data = JSON.parse(data);
                var element = data[Math.floor(Math.random() * data.length)];
                tweet = 'Date: ' + element.Date + '\nName: ' + element.Name + '\nTeams: ' + element.Team_preffered_name + '\nEncounter: ' + element.Encounter + '\nCategory: ' + element.Category + '\nDescription: ' +
                    element.Description + '\nOutcome: ' + element.Outcome + '\nArrestSeasonState: ' + element.ArrestSeasonState;
                var tLength = tweet.length;
                if (tLength >= 140) {
                    var numOfTweets = Math.ceil(tLength / 140);
                    var count = 0;
                    for (var i = 0; i < Math.ceil(tLength / 140); i++) {
                        tweets.push((i + 1) + '.\n' + tweet.substring(count, count + 136));
                        count = count + 136;
                    }
                }
                resolve(tweet);
            });

        }).on("error", (err) => { 
            console.log("Error: " + err.message);
            reject(err);
        });
    });
    return pinky;
}

function getNFLTeam() {
    let pinky = new Promise(function (resolve, reject) {
        http.get('http://nflarrest.com/api/v1/team', (resp) => { 
            let data = '';  // A chunk of data has been received.
             
            resp.on('data', (chunk) => {  
                data += chunk; 
            });

              // The whole response has been received. Print out the result.
             
            resp.on('end', () => {
                data = JSON.parse(data);
                var element = data[Math.floor(Math.random() * data.length)];
                teamID = element.Team;
                resolve(teamID); 
            });

        }).on("error", (err) => { 
            console.log("Error: " + err.message);
            reject(err);
        });
    });
    return pinky;
}