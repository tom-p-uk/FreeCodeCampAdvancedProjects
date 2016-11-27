$(document).ready(function() {
  var currentNumber = '';
  var calcArr = [];

  // reset all calculations
  $("#ac").click(function() {
    currentNumber = '';
    calcArr = [];
    $("#output").text("0");
  });

  // reset current number being inputted
  $("#ce").click(function() {
    currentNumber = '';
    $("#output").text("0");
  });

  // toggle number displayed on calculator output between positive and negative
  $("#negative").click(function() {
    var displayNum = $("#output").text();
    if (displayNum > 0) {
      var neg = -Math.abs(displayNum);
      $("#output").text(neg);
    }
    else if (displayNum < 0) {
      var pos = Math.abs(displayNum);
      $("#output").text(pos);
    }

  });

  // add clicked numbers to currentNumber string while its length is < 9
  $(".number").click(function() {
    if (currentNumber.length < 9) {
      currentNumber += $(this).children("span").text();
      $("#output").text(currentNumber);
    }
  });

  // add no more than one decimal point to currentNumber
  $("#point").click(function() {
    if (currentNumber.indexOf(".") == -1) {
      currentNumber += $(this).children("span").text();
      $("#output").text(currentNumber);
    }
  });

  // on click of +, -, ÷, × operators
  $(".operator").click(function() {
    var last = calcArr[calcArr.length - 1];
    var thisOperator = $(this).children("span").text();

    // set currentNumber to output value if user doesn't input a number
    if (calcArr.length === 0)
      currentNumber = $("#output").text();

    // add currentNumber to array if it isn't empty
    if (currentNumber !== '')
      calcArr.push(currentNumber);

    // if users enter 2 consecutive arithmetic operators, pop the previous one from array unless the 2nd one entered is a minus
    // then add operator to array
    if ((thisOperator == '÷' || thisOperator == '×' || thisOperator == '+') && (last == '÷' || last == '×' || last == '+' || last == '-') && currentNumber === '') {
      calcArr.pop();
      calcArr.push(thisOperator);
    }
    else {
      calcArr.push(thisOperator);
    }

    currentNumber = '';
  });

  $("#equals").click(function() {
    // push current number to array and then swap the ÷ and × mathematical operators for / and *
    calcArr.push(currentNumber);
    changeOperators(calcArr);

    // join the array and use eval to convert the string into a single number
    var answer = eval(calcArr.join(' '));

    // set upper limit for number to be displayed
    if (answer > 999999999)
      answer = 999999999;

    // ensure that displayed number is never more than 9 digits
    var len = Math.floor(answer).toString().length;
    if (answer) {
      if (answer.toString().indexOf('.') != -1)
        answer = +(answer.toFixed(8 - len));
    }


    // set lower level for number to be displayed
    if (answer > 0 && answer <= 0.0000001)
        answer = 0.0000001;

    // display answer, and reset calcArr and currentNumber
    $("#output").text(answer);
    calcArr = [];
    currentNumber = '';
    });
});

// function that swaps out the ÷ and × operators for / and *, so that the string can be evaluated
function changeOperators(arr) {
  for (var i = 0, l = arr.length; i < l; i++) {
    if (arr[i] == '÷') {
      arr[i] = '/';
    }
    else if (arr[i] == '×') {
      arr[i] = '*';
    }
  }
  return arr;
}
