// const factorial = n => {
//     if(n === 0)
//         return 1;
//     else 
//         return n * factorial(n-1);
// };

// console.log(factorial(5));

// const power = (base, strength) => {
//     let result = base;
//     for(let i=0;i<strength-1;i++) {
//         result *= base;
//     }
//     return result;
// };

// console.log(power(2,10));

// var x = 5;
// const foo = () => {
//     console.log(x);
//     var x = 10;
// }

// foo();



// let funs = [];
// for (let i = 0; i < 10; ++i) {
//    funs.push(() => {
//       console.log(i);
//    });
// }

// funs[0]();

// const crow = () => {
//     return {} + {};
// };

// console.log(crow());

// class Surgeon {
//     constructor(name, department) {
//       this.name = name;
//       this.department = department;
//     }
//   }
  
//   const surgeonCurry = new Surgeon('Curry', 'Pediatrics');

//   console.log(surgeonCurry.name);

  
//   const surgeonDurant = new Surgeon('Durant', 'Orthopedics');

const sumMaxMin = arr => {
  let minVal = Math.min(...arr);
  let maxVal = Math.max(...arr);

  console.log(arr.reduce((a,b) => a+b) - maxVal);
  console.log(arr.reduce((a,b) => a+b) - minVal);

};

sumMaxMin([25,76,313,4,66,9]);

  