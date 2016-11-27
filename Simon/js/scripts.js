$(document).ready(function() {
  var simon = new Simon();

  // start new game or reset game if start button is clicked
  $("#start-button").click(function() {

      if (!simon.sequencePlaying && simon.powerOn) {
      // update lcd-text
      $("#lcd-text").text(simon.levelNumString);

      // initalise/reset game and start playing a new sequence
      simon.reset();
      simon.updateSequence();
      simon.playSequence(simon.sequenceArray, simon.timeoutLength);
    }
  });


  // toggle power on/off when if power button is clicked
  $("#power-button").click(function() {

    // don't allow power of if sequence is playing - reset game and turn off screens/led
    if (simon.powerOn && !simon.sequencePlaying) {
      simon.reset();
      $("#lcd-text").text("");
      simon.powerOn = false;

      simon.strictMode = false;
      $("#strict-button-led").removeClass("led-on");
      $("#strict-button-led").addClass("led-off");
    }
    else if (!simon.powerOn) {
      $("#lcd-text").text("--");
      simon.powerOn = true;
    }
  });

  // toggle strict mode on/off if strict button is clicked
  $("#strict-button").click(function() {
    if (simon.powerOn) {
      if (simon.strictMode) {
        simon.strictMode = false;
        $("#strict-button-led").removeClass("led-on");
        $("#strict-button-led").addClass("led-off");
      }
      else {
        simon.strictMode = true;
        $("#strict-button-led").removeClass("led-off");
        $("#strict-button-led").addClass("led-on");
      }
      console.log(simon.strictMode);
    }
  });


  // if pad is clicked
  $(".pad").click(function() {

    // only run if sequence is not currently playing
    if (!simon.sequencePlaying && simon.sequenceArray.length > 0) {

      // add clicked pad to playerSequenceArray and highlight pad / play sound
      var padNum = parseInt($(this).attr("id").split("-")[1]);
      simon.playerSequenceArray.push(padNum);
      simon.highlight(padNum, 0);
      console.log(simon.sequenceArray);
      console.log(simon.playerSequenceArray);

      // if user inputs incorrectly
      if (!simon.compareSequences()) {

        // have lcd-text indicate a mistake was made
        $("#lcd-text").text("--");
        setTimeout(function() {$("#lcd-text").text("");}, 200);
        setTimeout(function() {$("#lcd-text").text("--");}, 400);


        // in strict mode, restart the game and reset lcd
        if (simon.strictMode) {
          simon.reset();
          simon.updateSequence();
          // give slight delay before new sequence is played
          setTimeout(function(){
            simon.playSequence(simon.sequenceArray, simon.timeoutLength);
          }, 1000);

        }

        // else restart the playing of the currently set sequence
        else {
          simon.playerSequenceArray = [];
          // give slight delay before new sequence is played
          setTimeout(function(){
            simon.playSequence(simon.sequenceArray, simon.timeoutLength);
          }, 1000);
        }

        setTimeout(function() {$("#lcd-text").text(simon.levelNumString);}, 600);
      }
      // else if user inputs correctly for max length of sequenceArray, game is won
      else if (simon.compareSequences() && simon.playerSequenceArray.length == 20) {
        var winner;
      }

      // else if user correctly inputs played sequence for lengths under 20, add another level and play sequence
      else if (simon.compareSequences() && simon.sequenceArray.length == simon.playerSequenceArray.length) {

        simon.levelUp();
        simon.playerSequenceArray = [];
        simon.updateSequence();

        // give slight delay before new sequence is played
        setTimeout(function(){
          simon.playSequence(simon.sequenceArray, simon.timeoutLength);
          $("#lcd-text").text(simon.levelNumString);
        }, 1000);
      }
    }
  });
});



// simon game object constructor
function Simon() {


  // function that adds audio files to array and returns it
  this.audio = function() {
    var audioArray = [];

    audioArray[0] = new Audio();
    audioArray[1] = new Audio();
    audioArray[2] = new Audio();
    audioArray[3] = new Audio();

    audioArray[0].src = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
    audioArray[1].src = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
    audioArray[2].src = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3";
    audioArray[3].src = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3";

    return audioArray;
  };

  // power on/off
  this.powerOn = true;

  // allows stict mode to be toggled on/off
  this.strictMode = false;


  // true if sequence is currently being played
  this.sequencePlaying = false;


  // string to display level number on lcd-text
  this.levelNumString = "01";


  // function that increases the level number by 1, and adds a leading 0 to single digit numbers
  this.levelUp = function() {
    var levelNum = parseInt(this.levelNumString);
    levelNum++;
    this.levelNumString = (levelNum < 10) ? ("0" + levelNum.toString()) : levelNum.toString();
  };


  // array for storing sequence of random numbers
  this.sequenceArray = [];


  // array for storing player-inputted sequenceArray
  this.playerSequenceArray = [];


  // function that compares the 2 sequences
  this.compareSequences = function() {
    for (var i = 0; i < this.playerSequenceArray.length; i++) {
      if (this.playerSequenceArray[i] != this.sequenceArray[i])
        return false;
    }
    return true;
  };


  // function that produces an integer between 2 given numbers
  this.getRandom = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };


  // function that adds a number from 1 - 4 to sequenceArray when called
  this.updateSequence = function() {
    this.sequenceArray.push(this.getRandom(0, 3));
  };

  // length of time to be passed into setTimeout functions
  this.timeoutLength = 1000;

  // function that iterates through sequence arrays and calls highlight method
  this.playSequence = function(array) {
    this.sequencePlaying = true;
    for (var i = 0; i < array.length; i++) {
      this.highlight(array[i], this.timeoutLength * (i + 1));
    }

    // turn sequencePlaying to false after the full sequence has played
    var totalTime = this.timeoutLength * array.length;
    setTimeout(function(){this.sequencePlaying = false;}.bind(this), totalTime);
  };


  // function that highlights button and plays simonSound
  this.highlight = function(num, timeoutLength) {
    setTimeout(function() {
      $("#pad-" + num).addClass("highlight");
      this.audio()[num].play();
      setTimeout(function() {$("#pad-" + num).removeClass("highlight");}, this.timeoutLength * 0.6);
    }.bind(this), timeoutLength);
  };

  // function that resets game
  this.reset = function() {
    this.sequenceArray = [];
    this.playerSequenceArray = [];
    this.levelNumString = "01";
  };

}
