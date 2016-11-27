// initialise svg board size values
var windowWidth = $(window).width(), windowHeight = $(window).height();
var boardWidth = 430, boardHeight = 430;

if (boardWidth > windowWidth) {
  boardWidth = windowWidth * 0.9;
  boardHeight = windowWidth * 0.9;
}
var cellWidth = Math.floor(boardWidth / 3), cellHeight = Math.floor(boardHeight / 3);

// initialise other variables
var board = [];
var startingPlayer, currentPlayer;
var gameFinished;
var aiMode;
var scoreArray = [];





$(document).ready(function() {
  createCells();
  createSvg();

  // initialise popup div declaring winner of the game
  $("#popup").popup({
    transition: 'all 0.3s',
    scrolllock: true,
    opacity: 0.8
  });


  // turn aiMode on/off
  $("#one-player").click(function() {
    aiMode = true;
    $("#mode-select").hide();
    $("#marker-select").removeClass("hidden");
  });

  $("#two-player").click(function() {
    aiMode = false;
    startingPlayer = "x";
    $("#modes-and-markers").hide();
    newGame();
    $("#board").removeClass("hidden");
    $("#scores").removeClass("hidden");
  });



  // select human player's marker
  $("#marker-select-x").click(function() {
    startingPlayer = "x";
    $("#modes-and-markers").hide();
    newGame();
    $("#board").removeClass("hidden");
    $("#scores").removeClass("hidden");
  });

  $("#marker-select-o").click(function() {
    $("#modes-and-markers").hide();
    startingPlayer = "o";
    newGame();
    $("#board").removeClass("hidden");
    $("#scores").removeClass("hidden");
  });



  // check and show scores
  $("#score-x-text").text(": " + checkScore("x"));
  $("#score-o-text").text(": " + checkScore("o"));



  // when a rect element of the svg is clicked
  $("rect").on("click", function() {
    if (gameFinished === false) {

      // retrieve x and y coords from clicked rect so that an o or x can be appended to the correct location
      var xCoord = parseInt($(this).attr("a"));
      var yCoord = parseInt($(this).attr("b"));
      var row = parseInt($(this).attr("id")[0]);
      var col = parseInt($(this).attr("id")[1]);
      var clicked = $(this).attr("clicked");

      // only append to rects that haven't been clicked
      if (clicked == "false") {

        // ensure cell cannot be clicked again
        $(this).attr("clicked", "true");

        if (currentPlayer == "x") {
          appendX(xCoord, yCoord);
          board[row][col] = "x";

          // in aiMode, get AI player O to move after human player X has moved, then check for terminal board state
          if (aiMode && checkWinner(board, false) === undefined) {
            setTimeout(function() {
              aiMove("o");
              declareWinner();
            }, 700);
          }
        }

        else if (currentPlayer == "o") {
          appendO(xCoord, yCoord);
          board[row][col] = "o";

          // in aiMode, get AI player X to move after human player O has moved, then check for terminal board state
          if (aiMode && checkWinner(board, false) === undefined) {
            setTimeout(function() {
              aiMove("x");
              declareWinner();
            }, 700);
          }
        }

        // check for terminal board state and, if so, declare winning player / update scores
        declareWinner();

        // if aiMode is off, change players
        if (!aiMode)
          changePlayer();

      }
    }
  });

  $("#play-again").click(function() {
    $(".winner-message").addClass("hidden");
    $("#popup").popup("hide");
    $("path").remove();
    newGame();
  });

  $("#end-game").click(function() {
    $("#popup").popup("hide");
    $("#board").addClass("hidden");
    $("#scores").addClass("hidden");
    $("path").remove();
    $("#mode-select").show();
    $("#marker-select").addClass("hidden");
    $("#modes-and-markers").show();
    scoreArray = [];
    $("#score-x-text").text(": " + checkScore("x"));
    $("#score-o-text").text(": " + checkScore("o"));
  });


});



/************************************************************
*************************************************************

                      Helper functions

*************************************************************
************************************************************/


// function that sets configuration for new game
function newGame() {
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  currentPlayer = startingPlayer;
  drawGrid();
  gameFinished = false;
  $("rect").attr("clicked", "false");

  if (aiMode && startingPlayer == "o")
    setTimeout(function() {aiMove("x");}, 1500);


  $(".winner-message").addClass("hidden");
}




// function that generates a random number within a specific range
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}




// function that calculates score
function checkScore(playerScore) {
  var count = 0;
  for (var i = 0; i < scoreArray.length; i++) {
    if (scoreArray[i] == playerScore)
      count++;
  }
  return count;
}




// function that switches between players
function nextPlayer() {
  currentPlayer = (currentPlayer == "x") ? "o" : "x";
}




// function that creates an object for each cell on the board and adds to cellArray
function createCells() {
  var cellArray = [];
  var row = 0, col = 0, id = "";
  var x = 0, y = 0;

  // Cell object constructor
  function Cell(x, y, i, a, b) {
    this.cellNo = i;
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;
    this.clicked = false;
    this.colour = "rgba(255, 255, 255, 0)";
  }

  // generates an id and x/y coords for each cell object, then adds to array
  for (var i = 0; i < 9; i++, x += cellWidth)
  {
    if (i == 3 || i == 6) {
      y += cellHeight;
      x = 0;
      row++;
    }
    col = i % 3;
    id = row.toString() + col.toString();
    cellArray[i] = new Cell(x, y, id, x, y);
  }
  return cellArray;
}




// function that creates new board svg
function createSvg() {
  // create container svg
  var boardSvg = d3.select("#board").append("svg")
                                    .attr("id", "board-svg")
                                    .attr("width", boardWidth)
                                    .attr("height", boardHeight);

  // set up chalk texture
  var chalk = boardSvg.append("defs")
                      .append("pattern")
                      .attr("id", "chalk")
                      .attr("patternUnits", "userSpaceOnUse")
                      .attr("width", "100%")
                      .attr("height", "100%")
                      .append("image")
                      .attr("xlink:href", "http://www.stezzer.com/textures/paved.jpg")
                      .attr("x", "-1250")
                      .attr("y", "-30")
                      .attr("width", "3000px")
                      .attr("height", "130%");

  // create cells for each of the 9 squares and add attributes
  var boardCells = boardSvg.selectAll("rect")
                           .data(createCells())
                           .enter()
                           .append("rect");

  var cellAttributes = boardCells
                      .attr("id", function(d) {return d.cellNo;})
                      .attr("x", function(d) {return d.x;})
                      .attr("y", function(d) {return d.y;})
                      .attr("a", function(d) {return d.a;})
                      .attr("b", function(d) {return d.b;})
                      .attr("width", cellWidth)
                      .attr("height", cellHeight)
                      .attr("clicked", function(d) {return d.clicked;})
                      .style("fill", function(d) {return d.colour;});
}


// function that draws a line and animates it
function drawLine(data, delay, duration, htmlClass, xStart, yStart) {
  var lineFunction = d3.line()
                       .x(function(d) { return d.x; })
                       .y(function(d) { return d.y; })
                       .curve(d3.curveBasis);

  var path = d3.select("#board-svg").append("path")
                                    .attr("class", htmlClass)
                                    .attr("d", lineFunction(data))
                                    .attr("stroke", "url(#chalk)")
                                    .attr("stroke-width", "7")
                                    .attr("fill", "none");


  var len =  path.node().getTotalLength();
  path.attr("stroke-dasharray", len + " " + len)
      .attr("stroke-dashoffset", len)
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("stroke-dashoffset", 0);
}




function drawGrid() {
  // audio that plays when grid is drawn
  var chalkAudioGrid = new Audio("http://k003.kiwi6.com/hotlink/xzvyec0c7r/chalk_grid.mp3");

  // data sets for grid line svg paths - coords are randomly allocated to give each path a unique crooked aesthetic
  var widthRange = cellWidth / 45, heightRange = cellHeight / 40;

  var horizontalLineData = [ [],[] ], verticalLineData = [ [],[] ];
  for (var i = 0; i <= 1; i += 0.1) {
    var randomHeight1 = getRandom(-heightRange, heightRange), randomHeight2 = getRandom(-heightRange, heightRange);
    var randomWidth1 = getRandom(-widthRange, widthRange), randomWidth2 = getRandom(-widthRange, widthRange);
    horizontalLineData[0].push({x: boardWidth * i, y: cellHeight + randomHeight1});
    horizontalLineData[1].push({x: boardWidth * i, y: cellHeight * 2 + randomHeight2});
    verticalLineData[0].push({x: cellWidth + randomWidth1, y: boardHeight * i});
    verticalLineData[1].push({x: cellWidth * 2 + randomWidth2, y: boardHeight * i});
   }

   // draw gridlines
   chalkAudioGrid.play();
   drawLine(verticalLineData[0], 0, 300, "grid");
   drawLine(verticalLineData[1], 400, 300, "grid");
   drawLine(horizontalLineData[0], 800, 300, "grid");
   drawLine(horizontalLineData[1], 1200, 300, "grid");

 }




// function that appends an X shape to svg
function appendX(cellX, cellY) {
  // audio that plays when x is appended
  var chalkAudioX = new Audio("http://k003.kiwi6.com/hotlink/rege92tg9y/chalk_x.mp3");

  // svg path data
  var widthRange = cellWidth / 55, heightRange = cellHeight / 45;
  var xData = [ [],[] ];
  for (var i = 0.2; i <= 0.8; i += 0.1) {
    var randomHeight1 = getRandom(-heightRange, heightRange), randomHeight2 = getRandom(-heightRange, heightRange);
    var randomWidth1 = getRandom(-widthRange, widthRange), randomWidth2 = getRandom(-widthRange, widthRange);
    xData[0].push({x: cellX + cellWidth * i + randomWidth1, y: cellY + cellHeight * i + randomHeight1});
    xData[1].push({x: cellX + cellWidth * (1 - i) + randomWidth2, y: cellY + cellHeight * i + randomHeight2});
  }


  chalkAudioX.play();
  drawLine(xData[0], 0, 150, "x", cellX, cellY);
  drawLine(xData[1], 220, 150, "x", cellX, cellY);
}




// appends an O shape to svg
function appendO(cellX, cellY) {
  // audio that plays when o is appened
  var chalkAudioO = new Audio("http://k003.kiwi6.com/hotlink/ean7gc63fm/chalk_o.mp3");

  var widthRange = cellWidth / 45, heightRange = cellHeight / 40;
  // svg path data - custom plotted
  var OData = [
    {x: cellX + cellWidth * 0.5 + widthRange, y: cellY + cellHeight * 0.2},
    {x: cellX + cellWidth * 0.35, y: cellY + cellHeight * 0.22 - heightRange},
    {x: cellX + cellWidth * 0.2, y: cellY + cellHeight * 0.33},
    {x: cellX + cellWidth * 0.2, y: cellY + cellHeight * 0.37},
    {x: cellX + cellWidth * 0.15, y: cellY + cellHeight * 0.5 - heightRange},
    {x: cellX + cellWidth * 0.19 - widthRange, y: cellY + cellHeight * 0.55},
    {x: cellX + cellWidth * 0.22 - widthRange, y: cellY + cellHeight * 0.6},
    {x: cellX + cellWidth * 0.25 + widthRange, y: cellY + cellHeight * 0.7},
    {x: cellX + cellWidth * 0.5, y: cellY + cellHeight * 0.8 + heightRange},
    {x: cellX + cellWidth * 0.5, y: cellY + cellHeight * 0.77 + heightRange},
    {x: cellX + cellWidth * 0.6, y: cellY + cellHeight * 0.76},
    {x: cellX + cellWidth * 0.67, y: cellY + cellHeight * 0.72},
    {x: cellX + cellWidth * 0.71, y: cellY + cellHeight * 0.66},
    {x: cellX + cellWidth * 0.72, y: cellY + cellHeight * 0.61},
    {x: cellX + cellWidth * 0.72, y: cellY + cellHeight * 0.58},
    {x: cellX + cellWidth * 0.71, y: cellY + cellHeight * 0.53},
    {x: cellX + cellWidth * 0.7, y: cellY + cellHeight * 0.5},
    {x: cellX + cellWidth * 0.69, y: cellY + cellHeight * 0.48},
    {x: cellX + cellWidth * 0.69, y: cellY + cellHeight * 0.45},
    {x: cellX + cellWidth * 0.68, y: cellY + cellHeight * 0.43},
    {x: cellX + cellWidth * 0.67, y: cellY + cellHeight * 0.42},
    {x: cellX + cellWidth * 0.66, y: cellY + cellHeight * 0.4},
    {x: cellX + cellWidth * 0.65, y: cellY + cellHeight * 0.39},
    {x: cellX + cellWidth * 0.64, y: cellY + cellHeight * 0.37},
    {x: cellX + cellWidth * 0.63, y: cellY + cellHeight * 0.36},
    {x: cellX + cellWidth * 0.62, y: cellY + cellHeight * 0.34},
    {x: cellX + cellWidth * 0.61, y: cellY + cellHeight * 0.32},
    {x: cellX + cellWidth * 0.6, y: cellY + cellHeight * 0.31},
    {x: cellX + cellWidth * 0.585, y: cellY + cellHeight * 0.30},
    {x: cellX + cellWidth * 0.56, y: cellY + cellHeight * 0.29},
    {x: cellX + cellWidth * 0.54, y: cellY + cellHeight * 0.28},
    {x: cellX + cellWidth * 0.52, y: cellY + cellHeight * 0.27},
    {x: cellX + cellWidth * 0.5, y: cellY + cellHeight * 0.25},
  ];

  chalkAudioO.play();
  drawLine(OData, 0, 450, "o", cellX, cellY);
}




// function that appends a line to the winning combo
function drawWinLine(x, y, index) {
  var widthRange = cellWidth / 45, heightRange = cellHeight / 40;

  var winLineData = [
    [], // horizontal combos
    [], // vertical combos
    [], // top-left -> bottom-right diagonal combo
    [] // top-right -> bottom-left diagonal combo
  ];
  for (var i = 0; i <= 1; i += 0.1) {
    var randomHeight = getRandom(-heightRange, heightRange), randomWidth = getRandom(-widthRange, widthRange);
    winLineData[0].push({x: boardWidth * i, y: y + randomHeight});
    winLineData[1].push({x: x + randomWidth, y: boardHeight * i});
    winLineData[2].push({x: boardWidth * i + randomWidth, y: boardHeight * i + randomHeight});
    winLineData[3].push({x: boardWidth * (1 - i) + randomWidth, y: boardHeight * i + randomHeight});
  }
  drawLine(winLineData[index], 300, 300, "win", x, y);
}




// function that switches between players
function changePlayer() {
  currentPlayer = (currentPlayer == "x") ? "o" : "x";
}




// function that checks for win and calls drawWinLine / ends game on any winning combo if 'true' is passed as an argument
function checkWinner(board, shouldEndGame) {
  for (var i = 0; i < board.length; i++) {

    // check for wins in horizontal rows
    if (board[i][0] !== null && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {

      if (shouldEndGame) {
        gameFinished = true;
        var y = (cellHeight / 2) + (i * cellHeight);
        drawWinLine(0, y, 0);
      }

      return (board[i][0] == "x" ? 10 : - 10);
    }

    // check for wins in vertical cols
    if (board[0][i] !== null && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {

      if (shouldEndGame) {
        gameFinished = true;
        var x = (cellWidth / 2) + (i * cellWidth);
        drawWinLine(x, 0, 1);
      }

      return (board[0][i] == "x" ? 10 : - 10);
    }

    // check for wins in diagonals
    if (board[0][0] !== null && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {

      if (shouldEndGame) {
        gameFinished = true;
        drawWinLine(0, 0, 2);
      }

      return (board[0][0] == "x" ? 10 : - 10);
    }

    if (board[0][2] !== null && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {

      if (shouldEndGame) {
        gameFinished = true;
        drawWinLine(0, 0, 3);
      }

      return (board[0][2] == "x" ? 10 : - 10);
    }
  }

  // check for a draw
  var boardFlattened = [].concat.apply([], board);

  if (boardFlattened.indexOf(null) == -1) {

    if (shouldEndGame) {
      gameFinished = true;
    }

    return 0;
  }
}




// function that checks available moves and adds the indexes of empty spaces to a 2d array
function checkAvailableMoves(board) {
  var movesArray = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] === null) {
        movesArray.push([i, j]);
      }
    }
  }
  return movesArray;
}




// function that calls miniMax and returns the indexes of the optimal move
function checkBestMove(board, player) {
  var bestScore;
  var bestMove = null;
  var movesArray;

  if (player == "x") {
    bestScore = -10000;
    movesArray = checkAvailableMoves(board);
    //console.log(movesArray);

    for (var i = 0; i < movesArray.length; i++) {
      var index0 = movesArray[i][0];
      var index1 = movesArray[i][1];

      board[index0][index1] = "x";
      var currentScore = miniMax(board, "o");

      if (currentScore > bestScore) {
        bestScore = currentScore;
        bestMove = [index0, index1];
      }
      board[index0][index1] = null;
    }
  }

  else if (player == "o") {
    bestScore = 10000;
    movesArray = checkAvailableMoves(board);
    //console.log(movesArray);

    for (var i = 0; i < movesArray.length; i++) {
      var index0 = movesArray[i][0];
      var index1 = movesArray[i][1];

      board[index0][index1] = "o";
      var currentScore = miniMax(board, "x");

      if (currentScore < bestScore) {
        bestScore = currentScore;
        bestMove = [index0, index1];
      }
      board[index0][index1] = null;
    }
  }
  return bestMove;
}




// recursive function that assigns a value to each playable position on the board
function miniMax(board, player) {

  if (checkWinner(board, false) !== undefined) {
    return checkWinner(board, false);
  }

  if (player == "x") {
    var bestScore = -10000;
    var movesArray = checkAvailableMoves(board);
    //console.log(movesArray);
    for (var i = 0; i < movesArray.length; i++) {
      var index0 = movesArray[i][0];
      var index1 = movesArray[i][1];

      board[index0][index1] = "x";
      var currentScore = miniMax(board, "o");

      if (currentScore > bestScore) {
        bestScore = currentScore;
      }
      board[index0][index1] = null;
    }
    return bestScore;
  }

  else if (player == "o") {
    var bestScore = 10000;
    var movesArray = checkAvailableMoves(board);
    //console.log(movesArray);
    for (var i = 0; i < movesArray.length; i++) {
      var index0 = movesArray[i][0];
      var index1 = movesArray[i][1];

      board[index0][index1] = "o";
      var currentScore = miniMax(board, "x");

      if (currentScore < bestScore) {
        bestScore = currentScore;
      }
      board[index0][index1] = null;
    }
    return bestScore;
  }
}




// function that finds the best move for AI player O and appends an O there
function aiMove(player) {
  var move = checkBestMove(board, player);
  var rectId = move[0].toString() + move[1].toString();
  var moveRect = $("#" + rectId);
  moveRect.attr("clicked", "true");
  var moveXCoord = parseInt(moveRect.attr("a"));
  var moveYCoord = parseInt(moveRect.attr("b"));

  if (player == "x") {
    appendX(moveXCoord, moveYCoord);
    board[move[0]][move[1]] = "x";
  }

  else if (player == "o") {
    appendO(moveXCoord, moveYCoord);
    board[move[0]][move[1]] = "o";
  }
}



// function that adds winning player to score array, updates scores html and shows winning player msg if board state is termianl
function declareWinner() {
  if (checkWinner(board, false) !== undefined) {


    scoreArray.push(checkWinner(board, true));
    $("#score-x-text").text(": " + checkScore(10));
    $("#score-o-text").text(": " + checkScore(-10));


    // show appropriate winner message at end of game
    if (checkWinner(board) == 10) {
      $("#winner-x-message").removeClass("hidden");

      // for 2 player version, switch starting player every game
      if (!aiMode)
        startingPlayer = "o";
    }
    else if (checkWinner(board) == -10) {
      $("#winner-o-message").removeClass("hidden");

      if (!aiMode)
        startingPlayer = "x";
    }
    else if (checkWinner(board) === 0)
      $("#draw-message").removeClass("hidden");

    // show modal popup with slight delay
    setTimeout(function() {$("#popup").removeClass("hidden").popup("show");}, 500);
  }
}
