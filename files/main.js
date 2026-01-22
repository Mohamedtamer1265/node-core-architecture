const fs = require('fs');

const concept = fs.readFileSync("./text.txt");
console.log(concept); // it returns a buffer??
// so you can use the same concepts we used to buffer as we can edit anything
// or use utf-8 or from 

console.log(concept.toString("hex"));

/*
to create a file you can use promises Api or callback API or sync API

we sticks with promises api

if you need performance use callback api


*/