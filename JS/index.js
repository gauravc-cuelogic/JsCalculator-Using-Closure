function Calculate () {
  /*var operators = {
    '=': function(a) {
        try {
          return calculate(a)
        } catch (err) {
          return "Malformed Expression";
        }
    },
  };*/

 /*var operator = function(result, input) {
                    return result + input;
                  };
  var add = function(input){
              return operation(input, operator);
            };

  var multiply = function(input){
                  return operation(input, function(result, input) { return result * input; });
                  }

  var subtract = function(input){
    return operation(input, function(result, input) { return result - input; });
  }

  var divide = function(input){
    return operation(input, function(result, input) { return result / input; });
  }

  function operation(input, operator) {
    var result = input.shift();
    for(i = 0; i < input.length; i++){
      result = operator(result, input[i]);
    }
    return result;
  }*/
    this.storedKey = 0;
    var inputNumber = [];
    var numberToken = [];
    this.previousOperator = '';
    this.operand = '';

    this.saveToMemory  = function () {
      var inputValue = document.getElementsByName('display')[0].value;
      var output = calculate(inputValue);
      if(!isNaN(output) && isFinite(output) ){
        var storeValue = {'input' : inputValue, 'output' : output};
        if(this.storedKey > 0 ){
            localStorage.setItem(this.storedKey,JSON.stringify(storeValue));
            this.storedKey = 0;
        }else{
          localStorage.clickcount = localStorage.clickcount ? Number(localStorage.clickcount) + 1 : 1;
          localStorage.setItem(localStorage.clickcount,JSON.stringify(storeValue));
        }
        document.getElementsByName('display')[0].value = output;
        this.evaluateInput();
      }else {
        document.getElementsByName('display')[0].value = output;
      }
    }

   this.evaluateInput = function  () {
     document.getElementById("listCalculations").innerHTML = "";
     var ul = document.createElement('ul');
     document.getElementById('listCalculations').appendChild(ul);

     Object.keys(localStorage).forEach(function(key){
       if(key != 'clickcount'){
         var li = document.createElement('li');

         ul.appendChild(li);
         var input = JSON.parse(localStorage.getItem(key));
         var result = '<span onclick="loadInputs('+key+')" class="cursor">'+input.input + '=' + input.output+'</span>';
         li.innerHTML=li.innerHTML + result;

         var span = document.createElement('span');
         span.setAttribute('onclick','deleteCalculation("'+key+'")');
         span.setAttribute('class' , 'cursor');
         span.innerHTML= '   X';
         li.appendChild(span);
      }
     });
   }


  this.setInput = function (newValue) {

    switch (newValue) {

      case '=' :
        this.saveToMemory();
        break;

      case '+' :
      case '-' :
      case '*' :
      case '/':
        setExpression(newValue);
        break;

      case 'C' :
          document.getElementsByName('display')[0].value = '';
        break;

      default :
          makeDisplayString(newValue);
          numberToken.push(newValue);
        break;

    }

  }

  var setExpression = function (newValue) {

    makeDisplayString(newValue);

    this.previousOperator = (inputNumber.length == 1) ? newValue : '';

    if( numberToken.length != 0 ){
      inputNumber.push(numberToken.join(""));
      numberToken = [];
    }
    if(inputNumber.length == 1){
      this.operand = operation(inputNumber[0]);
    }else if (inputNumber.length == 2){
      var tokenOutput = this.operand(this.previousOperator, inputNumber[1]);
      inputNumber = [];
      inputNumber.push(tokenOutput);
    }
  }

  var makeDisplayString = function (newValue) {
    var oldInputValue = document.getElementsByName('display')[0].value;
    document.getElementsByName('display')[0].value = oldInputValue+newValue;
  }

// implementing Closure for calculation
  var operation = function (x) {
    return function(operator, y) {
      new Function('return ' + x + operator + y)();
    };
  }

  var calculate = function (fn) {
    try {
      return new Function('return ' + fn)();
    } catch (err) {
      return "Malformed Expression";
    }
  }

}
