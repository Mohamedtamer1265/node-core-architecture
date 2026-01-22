for (let i = 0; i < 10; i++) {
  console.log("Iteration number: " + i);
}
var student = {
  // object name
  firstName: "Jane", // list of properties and values
  lastName: "Doe",
  age: 18,
  height: 170,
  fullName: function () {
    // object function
    return this.firstName + " " + this.lastName;
  },
};

// reset parameters : takes any number of parameters
function reset(...args) {
  for (let i = 0; i < args.length; i++) {
    console.log("Resetting: " + args[i]);
  }
}

reset("param1", "param2", "param3");

/**
 1️⃣ JavaScript has primitive vs object types

Primitive types:

string

number

boolean

undefined

bigint

symbol
Everything else is an object.
 */

/*
fUNCTIONS ARE OBJECTS wowwww
so that we add lambda expressions to c++ and java to behave like js functions



Annynmous functions are functions without a name. They are often used as arguments to other functions or as immediately invoked function expressions (IIFE).
let calc = function(a, b) {
    return a + b;
};
console.log(calc(5, 10)); // Outputs: 15

1️⃣ JavaScript uses dynamic typing
Types are determined at runtime, not at compile time.


FunctionsArrow functions provide a concise syntax for writing functions and lexically bind the this value. // no need for parentheses if only one parameter

Example:
const add = (a, b) => a + b; // only 1 line needed
const add = _ => 42; // no parameters as () needed
const add = a => a + 10; // only one parameter, no parentheses needed

console.log(add(5, 10)); // Outputs: 15




var a = 10;
let b = 20;

function testScope() {
console.log(a); // Accessible: function-scoped
console.log(b); // Accessible: block-scoped
    var a = 30; // function-scoped
    let b = 40; // block-scoped

    here he create local scope variables with same name as global ones so the global ones are not accessible anymore
}
    
in js he check if variable is declared in local scope first and put it in temporal dead zone until it is declared

TDZ gives predictability and safety
No accidental access to uninitialized locals
Makes let / const behave like true block-scoped variables (like in other languages)
Prevents “temporal confusion” between local and outer variables
testScope();

so it helps us from bugs and it insures that the function take this variable from the local one only or global one only not mixing them 
*/

// CallBack functions : A function passed into another function as an argument, to be executed later.
/*
 1 - dawnload photo from url
 2- resize photo
 3- add logo to the photo
 4 - show it in the website 
here is an example of callback hell 


sooooo instead of passing functions as parameters and nesting them we use promises and async await to make it more readable


 */
// Example of callback function
function add(a, b) {
  return `${a} + ${b()}`;
}
function check() {
  return "Check function executed";
}
console.log(add(10, check));
//setTimeout(add, timeout,5,10); // correct way to pass parameters to callback function
//settimeout(add(5,10),1000); // wrong way because it will execute add immediately and pass its result to settimeout

// promise
/*


 Before looking at code, let's look at a real-life scenario.
Imagine you go to a busy burger joint.
Request: You order a cheeseburger and pay.
Pending: The cashier doesn't give you the burger immediately (it takes time to cook). Instead, they hand you a beeper (the Promise).
The Wait: You go sit down. The beeper is in a state of "pending." You don't have the food, but you have a guarantee that you will get something eventually.
Resolution:
Success (Resolved): The beeper buzzes! You go to the counter and exchange the beeper for your burger.
Failure (Rejected): The manager comes over and says, "I'm so sorry, the kitchen caught fire." You don't get the burger; you get an apology (an error).
In programming, a Promise is that beeper. It is a placeholder for a value that doesn't exist yet but will in the future.
 
JavaScript is single-threaded, meaning it can only do one thing at a time. Promises help manage tasks that take time (like fetching data from a server) without freezing the entire program.


Pending: The initial state. The operation has started but hasn't finished (The burger is cooking).
Fulfilled (Resolved): The operation completed successfully. You get a result (The burger is ready).
Rejected: The operation failed. You get an error reason (The kitchen fire)


after your promise you can handle the result in different ways
console.log("1. Ordering food...");

myPromise
    .then((data) => {
        // This runs only if successful
        console.log("2. Success:", data);
    })
    .catch((error) => {
        // This runs only if there is an error
        console.log("2. Error:", error);
    })
    .finally(() => {
        // This always runs
        console.log("3. Transaction finished.");
    });

    so it starts with promise with then and we created async and await 
    const promise = new promise((resolveFunc,rejectFunc) =>{ // it takes 2 optional callback for reject and accept
        let connect = false;
        if(connect){
        resolveFunc("ok");
        }else
        {
        rejectFunc("reject")    
        }
        }).then( // also 2 optional callback functions one for resolve and one for reject
        (resolveValue) => console.log('Good')
        (resolveValue) => console.log(`bad`);
        )

        to get in deeper read this -> https://gemini.google.com/share/99d106d53035



        // promise types
Types of Promises:
-All: Waits for all promises to resolve or any to reject.
- AllSettled: Waits for all promises to settle (resolve or reject).
-Race: Resolves or rejects as soon as one promise resolves or rejects.
-Any: Resolves as soon as any promise resolves; rejects if all reject.

async -> return promise 


you cannot write await outside an async function
*/
