// initialise other variables
var board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

if (checkWinner(board) !== undefined)
  console.log("done");
var currentPlayer = "x";
var bestMove = checkBestMove(board, currentPlayer);
console.log("bestMove = " + bestMove);


// function that switches between players
function changePlayer() {
  currentPlayer = (currentPlayer == "x") ? "o" : "x";
}



// function that checks for win and calls drawWinLine / ends game on any winning combo if 'true' is passed as an argument
function checkWinner(board, bool) {
  for (var i = 0; i < board.length; i++) {

    // check for wins in horizontal rows
    if (board[i][0] !== null && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {

      if (bool) {
        gameFinished = true;
        drawWinLine(0, y, 0);
      }

      return (board[i][0] == "x" ? 10 : - 10);
    }

    // check for wins in vertical cols
    if (board[0][i] !== null && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {

      if (bool) {
        gameFinished = true;
        drawWinLine(x, 0, 1);
      }

      return (board[0][i] == "x" ? 10 : - 10);
    }

    // check for wins in diagonals
    if (board[0][0] !== null && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {

      if (bool) {
        gameFinished = true;
        drawWinLine(0, 0, 2);
      }

      return (board[0][0] == "x" ? 10 : - 10);
    }

    if (board[0][2] !== null && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {

      if (bool) {
        gameFinished = true;
        drawWinLine(0, 0, 3);
      }

      return (board[0][2] == "x" ? 10 : - 10);
    }
  }

  // check for a draw
  var boardFlattened = [].concat.apply([], board);

  if (boardFlattened.indexOf(null) == -1) {

    if (bool) {
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





function miniMax(board, player) {
  //console.log(board);

/* includes depth

  if (checkWinner(board) == 10) {
    return checkWinner(board) - depth;
  }
  else if (checkWinner(board) == -10) {
    return checkWinner(board) + depth;
  }
  else if (checkWinner(board) === 0) {
    return checkWinner(board);
  }
*/

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
