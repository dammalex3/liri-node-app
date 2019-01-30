// code to read and set any environment variables with the dotenv package:
require("dotenv").config();

// Include the axios
var axios = require("axios");

// code to import the `keys.js` file and store it in a variable
var keys = require("./keys.js");

// Moment.js
var moment = require('moment');
moment().format();

// node fs package
var fs = require("fs");

// Spotify api node package
var Spotify = require('node-spotify-api');

// access the spotify key stored in the keys.js file because the object is exported in that file
var spotify = new Spotify(keys.spotify);

// concert-this command
var concertThis = function(artist) {
    axios.get("https://rest.bandsintown.com/artists/"+artist+"/events?app_id=codingbootcamp").then(
        function(response) {
            for (var j=0; j<response.data.length; j++) {
                console.log("Event Information");
                console.log("Venue name: "+response.data[j].venue.name);
                console.log("Venue location: "+response.data[j].venue.city+", "+response.data[j].venue.region+ " "+response.data[j].venue.country);
                console.log("Event Date: " +moment(response.data[j].datetime).format("dddd, MMMM Do YYYY, h:mm a"));
                console.log("---------------------------------------")
            }
        }
      );
}

// spotify command function
var spotifySearch = function(song) {
    if (song==="") {
        song="The Sign Ace of Base";
      }
      spotify
        .search({ type: 'track', query: song })
        .then(function(response) {
            for (var i=0; i<response.tracks.items.length; i++) {
                console.log("Song: " + response.tracks.items[i].name);
                console.log("Artist: " + response.tracks.items[i].artists[0].name);
                console.log("Album: " + response.tracks.items[i].album.name);
                console.log("Spotify URL: " + response.tracks.items[i].external_urls.spotify);
                console.log("------------------------------------")
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

var movieSearch = function(movie) {
    if (movie==="") {
        movie="Mr. Nobody";
        }
        axios.get("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&apikey=trilogy").then(
        function(response) {
        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);

        for (var i=0; i<response.data.Ratings.length; i++) {
            if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
                var rottenTomatoesRating = response.data.Ratings[i].Value;
            }
        }

        console.log("Rotten Tomatoes Rating: " + rottenTomatoesRating);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);

        }
        );  
}

// Do what it says function
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
        return console.log(error);
        }
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        
        //set the inputCommand
        inputCommand = dataArr[0];

        //set the userInput
        userInput = dataArr[1];

        executeCommand(inputCommand, userInput);
    
    });
}

var executeCommand = function(inputCommand, userInput) {
    switch(inputCommand){
        case 'concert-this': 
            concertThis(userInput);
            break;
        case 'spotify-this-song': 
            spotifySearch(userInput);
            break;
        case 'movie-this': 
            movieSearch(userInput);
            break;
        case 'do-what-it-says': 
            doWhatItSays();
            break;
        default: 
            console.log("invalid input");
    }
}

// read in the input
var inputCommand = process.argv[2];
var userInput = '';
for (var i=3; i<process.argv.length; i++) {
    userInput += process.argv[i];
    userInput += ' ';
}
userInput = userInput.trim();

//run the main switch statment
executeCommand(inputCommand, userInput);



