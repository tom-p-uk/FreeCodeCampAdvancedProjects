$("document").ready(function() {

  // set variables
  var breakLength = 60, sessionLength = 601, counter = 0;
  var started = false;
  var audio = new Audio("http://k003.kiwi6.com/hotlink/p42nw5u558/salamisound-7587855-double-beep-beep-as-e-g.mp3");

  // function creates instance of countdown
  function createCountdown() {
    $("#countdown").TimeCircles({
        "animation": "ticks",
        "bg_width": 0.2,
        "fg_width": 0.015,
        "circle_bg_color": "#F66956",
        "start": false,
        "time": {
            "Days": {
                "text": "Days",
                "color": "#CCCCCC",
                "show": false
            },
            "Hours": {
                "text": "Hours",
                "color": "#CCCCCC",
                "show": false
            },
            "Minutes": {
                "text": "Minutes",
                "color": "#9E4337",
                "show": true
            },
            "Seconds": {
                "text": "Seconds",
                "color": "#9E4337",
                "show": true
            }
        }
    });
    $("#countdown").TimeCircles().addListener(function(unit, amount, total){
      console.log(total);
    });
    $("#countdown").TimeCircles().addListener(callback);
  }
  createCountdown();

  // on click of icon toggle countdown on/off and switch between play/pause icons
  $("#play-pause").click(function() {
    if (started === false) {
      $("#countdown").TimeCircles().start();
      $("#play-pause").attr("class", "fa fa-pause");
      started = true;
    }
    else {
      $("#countdown").TimeCircles().stop();
      $("#play-pause").attr("class", "fa fa-play");
      started = false;
    }
  });

  // restart countdown
  $("#repeat").click(function() {
    $("#countdown").TimeCircles().restart();
    if (started === false)
      $("#countdown").TimeCircles().stop();
  });

  // edit break length
  $("#break-minus").click(function() {
    if (breakLength - 60 >= 60) {
      breakLength -= 60;
      $("#break-length").text(breakLength / 60);
    }
  });

  $("#break-plus").click(function() {
      breakLength += 60;
      $("#break-length").text(breakLength / 60);
  });

  // edit session length
  $("#session-minus").click(function() {
    if (sessionLength - 60 >= 61) {
      sessionLength -= 60;
      $("#countdown").data("timer", sessionLength);
      $("#countdown").TimeCircles().destroy();
      createCountdown();
      $("#countdown").TimeCircles().rebuild();
      $("#session-length").text((sessionLength - 1) / 60);
      $("#play-pause").attr("class", "fa fa-play");
      started = false;
    }
  });

  $("#session-plus").click(function() {
      sessionLength += 60;
      $("#countdown").data("timer", sessionLength);
      $("#countdown").TimeCircles().destroy();
      createCountdown();
      $("#countdown").TimeCircles().rebuild();
      $("#session-length").text((sessionLength - 1) / 60);
      $("#play-pause").attr("class", "fa fa-play");
      started = false;
  });

  // callback function to be passed into event listener
  function callback(unit, amount, total){
    if (total === 0) {
      counter ++;
      audio.play();

      // after session, create instance of break timer
      if (counter % 2 !== 0) {
        $("#countdown").data("timer", breakLength);
        $("#countdown").TimeCircles().destroy();
        createCountdown();
        $("#countdown").TimeCircles().rebuild();
        $("#countdown").TimeCircles().start();
      }
      // after break, create instance of session timer
      else {
        $("#countdown").data("timer", sessionLength);
        $("#countdown").TimeCircles().rebuild();
        createCountdown();
        $("#countdown").TimeCircles().rebuild();
        $("#countdown").TimeCircles().start();
      }
    }
  }
});
