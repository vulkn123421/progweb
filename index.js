//Punto 1
Math.pow(7, 2);

//Punto 2
function getLergerint(number1, number2, resultado){
    return resultado = number1 + number2;
}
print(resultado)

//Punto 3

function fibonacciSequence(limit){
    var multipliedNumbers = [];

    for(var i = 0; i < limit.length; i++){
        multipliedNumbers.push(limit[i]+2);
    }

    return multipliedNumbers;

}

//Punto 4

function calculateAverage(numbers) {
    return numbers.reduce((prev, numbers) => prev + numbers.age, 0) / numbers.length;
  }
  
  let john = { name: "John", age: 25 };
  let pete = { name: "Pete", age: 30 };
  let mary = { name: "Mary", age: 29 };
  
  let arr = [ john, pete, mary ];
  
  alert( calculateAverage(arr) );