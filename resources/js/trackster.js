var Trackster = {};
var API_KEY = "6ff4265ea55506f7bdf9d63ac77bd6e3";
var displayTrackster;

$(document).ready(function(){

// get titile and click search button
$( "#search-btn" ).on( "click", function() {
  displayTrackster = setInterval(function(){Trackster.tracksterAnimate()}, 100);
  Trackster.searchTracksByTitle($("#search-str").val() );
});

$('#search-str').on("keydown", function(event){
  if (event.which===13) {
    displayTrackster = setInterval(function(){Trackster.tracksterAnimate()}, 100);
    Trackster.searchTracksByTitle($("input").val());
  }
});

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
  $.ajax({
    url: 'http://ws.audioscrobbler.com/2.0/?method=track.search&track=' + title + '&api_key=' + API_KEY + '&format=json',
    success: function(response) {
      //console.log(response);
      Trackster.renderTracks(response.results.trackmatches.track);
    }
  })
}; // end of search tracks by title


/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  // stops trackster animation
  clearInterval(displayTrackster);
  $("#trackster").css("opacity", "1");
  $("#trackster").css("color", "rgb(255, 0, 171)");
  // get DOM and declare variables for storing
  var $trackList = $("#track-list");
  $trackList.empty();
  $trackList.data('trackItems', [])
  // loops through return data from ajax
  for (i=0; i<tracks.length; i++){
    var trackUrl = tracks[i].url;
    var trackName = tracks[i].name;
    var trackArtist = tracks[i].artist;
    var trackArtWork = tracks[i].image[1]["#text"];
    var trackListeners = tracks[i].listeners;
    var trackData ={url: trackUrl, name: trackName, artist: trackArtist, artwork: trackArtWork, listeners: trackListeners };

    var $trackHTML = $('<div class="row track">' +
                    '<div class="col-xs-1 col-xs-offset-1">' +
                    '<a href="' + tracks[i].url + '" target="_blank">' +
                    '<span><i class="fa fa-play-circle-o fa-2x" aria-hidden="true"></i></span></a>' + '</div>' +
                    '<div class="col-xs-4">' + tracks[i].name + '</div>' +
                    '<div class="col-xs-2">' + tracks[i].artist + '</div>' +
                    '<div class="col-xs-2" id="artwork"><img src=' + tracks[i].image[1]["#text"] + '/></div>' +
                    '<div class="col-xs-2" id="listeners">' + tracks[i].listeners + '</div>' +
                    '</div>');

    $trackHTML.data(trackData);
    //console.log($trackHTML.data());
    $trackList.data("trackItems").push(trackData);
    //console.log($trackList.data("trackItems"));
    $trackList.append($trackHTML);
    } // end of for loop

    // listen for sort button click
      $("#sort .btn").click(function(){
        var id = this.id;
        Trackster.sortTrack($("#track-list"), id);
    });
};// end of render tracks

// Trackster animation
Trackster.tracksterAnimate = function(){
  $("#trackster").animate(
    {opacity: "0.2"}, 100);
  $("#trackster").animate(
    {opacity: "1"}, 100);
  } // end of trackster animate


//Sorting tracks
Trackster.sortTrack = function($tracksList, btnId){
  var $tracksData = $tracksList.data("trackItems");
  $tracksList.empty();

  if (btnId === "sort-song"){
       $tracksData.sort(function(a, b) {
       var nameA = a.name.toUpperCase(); // ignore upper and lowercase
       var nameB = b.name.toUpperCase(); // ignore upper and lowercase
       if (nameA < nameB) {
         return -1;
       }
       if (nameA > nameB) {
         return 1;
       }
       return 0;
     }); // end of sort-song
   } // end of if
    else if (btnId === "sort-artist") {
       //console.log(btnId);
       $tracksData.sort(function(a, b) {
         var nameA = a.artist.toUpperCase(); // ignore upper and lowercase
        var nameB = b.artist.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
         return 1;
        }
        return 0;
        }); // end of sort-artist
      } // end of else if
      else if ( btnId === "sort-listeners" ) {
        $tracksData.sort(function (a, b) {
        return b.listeners - a.listeners;
        }); // end of sort-listeners
    } // end of else if

  // display $tracksData
  for (i=0; i< $tracksData.length; i++){
    var $trackHTML = $('<div class="row track">' +
                    '<div class="col-xs-1 col-xs-offset-1">' +
                    '<a href="' + $tracksData[i].url + '" target="_blank">' +
                    '<span><i class="fa fa-play-circle-o fa-2x" aria-hidden="true"></i></span></a>' + '</div>' +
                    '<div class="col-xs-4">' + $tracksData[i].name + '</div>' +
                    '<div class="col-xs-2">' + $tracksData[i].artist + '</div>' +
                    '<div class="col-xs-2" id="artwork"><img src=' + $tracksData[i].artwork + '/></div>' +
                    '<div class="col-xs-2" id="listeners">' + $tracksData[i].listeners + '</div>' +
                    '</div>');
    $tracksList.append($trackHTML);
  } // end of for loop
} // end of sorting track

}); // end of document ready
