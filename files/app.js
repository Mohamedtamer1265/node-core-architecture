// ****** Promise API ****** //
// const fs = require("fs/promises");

// (async () => {
//   try {
//     await fs.copyFile("file.txt", "copied-promise.txt");
//   } catch (error) {
//     console.log(error);
//   }
// })();
jd

// ****** Callback API ****** //
// const fs = require("fs");

// fs.copyFile("file.txt", "copied-callback.txt", (error) => {
//   if (error) console.log(error);
// });
/*
1. The "Error-First" Rule
In Node.js callbacks, the arguments are always ordered by priority:

First Argument (error): Did something go wrong?

Second Argument (data): If nothing went wrong, here is your result.

The logic is: Check for failure before you look at the success data.

2. How the Computer "Thinks"
When Node.js runs your callback, it fills that error variable based on the outcome:

If the copy fails: The error argument will contain an Error object (with details like "File not found").

If the copy succeeds: The error argument will be null (empty).
*/

// ****** Synchronous API ****** //
const fs = require("fs");

fs.copyFileSync("file.txt", "copied-sync.txt");
