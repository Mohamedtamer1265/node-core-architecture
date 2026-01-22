const http = require('http');
const fs = require('fs');


const server = http.createServer();
server.on('request', (req, res) => {
   // 1. req (The Request): The server 'hears' the phone ring.
    // The 'req' object tells us who is calling.

    const result = fs.readFileSync('./text.txt');
    
    // 2. res (The Response): We prepare the reply.
    // We get the file data ready to put on the 'res' object.

    res.setHeader('Content-Type', 'text/plain'); 
    
    // 3. res.end(result): The 'Send' Button.
    // We put 'result' into the package and ship it.
    // "Here is the file you asked for. Over and out."
    res.end(result);
});

server.listen(4080,"127.0.0.1",() => {
    console.log("Server is listening on port 4080",server.address());
    
});
let a = 10;
a = '20';
console.log(a); // JS is dynamically typed language