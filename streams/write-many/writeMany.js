const fs = require("fs/promises");

// using promises async/await

/*
(async () => {
  const handler = await fs.open("./output.txt", "w");

  const string = "";
  for (let i = 0; i < 10000000; i++) {
    await handler.write(`${i}`);
  }
  await handler.close();
})();
console.timeEnd("writeMany"); // 1.792ms ms memory usage 63% and cpu 16%


 
// callback version
// is faster than async/await 0.505ms 87 % memory
// memory looks like same

(() => {console.time("writeMany");
  fs.open("./output.txt", "w", (err, handler) => { // handler is a FileHandle object which is unique to Node.js
    if (err) throw err;
    const string = "";
    for (let i = 0; i < 10000000; i++) {
    fs.writeSync(handler,`${i}`);
    }
    fs.closeSync(handler);
  });
})();
console.timeEnd("writeMany"); // 1.792ms ms memory usage 63% and cpu 16%



// using streams
// Time : 1.15 ms
// Memory 92 %  too much memory used
// we need to manage backpressure here
(async () => {
  console.time("writeMany");
  const handler = await fs.open("./output.txt", "w");
  const stream = handler.createWriteStream();
  for (let i = 0; i < 1000000; i++) {
    stream.write(`${i}`);
  }
  stream.end();
})();

  console.timeEnd("writeMany");


*/

// we know now that streams object have internal buffer and properties and events
(async () => {
  console.time("writeMany");
  const handler = await fs.open("./output.txt", "w");
  const stream = handler.createWriteStream();
  // size of our internal buffer
  console.log(stream.writableHighWaterMark); // 16384 bytes = 16 KB
  // how much data is currently in the buffer
  console.log(stream.writableLength); // 0 bytes initially
  stream.write("Hello, "); // it returns true because buffer is not full and false if buffer is full
  console.log(stream.writableLength); // 7 bytes
  // listening to drain event
  // as if we listen to 'drain' event we can write more data when buffer is empty
  // so if when the buffer is full we stop writing data and wait for 'drain' event to write more data
  // the size of data we are writing should be smaller than or equal to the size of the buffer
  /*stream.on("drain", () => {
        console.log("Buffer drained, you can write more data now.");
    });
    */

  // better memory management with backpressure handling
  let i = 0;
  const writeMany = () => {
    while (i < 10000000) {
      const buf = Buffer.from(` ${i} `, "utf-8");
      if (i == 9999999) {
        stream.end(buf); // close the stream with the last buffer
        break;
      }
      if (stream.write(buf)) i++;
      else break;
    }
    stream.end();
  };
  writeMany();
  // listening to drain event to continue writing data after buffer is drained
  stream.on("drain", () => {
    writeMany();
  });

  // listening to finish event to close the file handler
  stream.on("finish", async () => {
    await handler.close();
    console.timeEnd("writeMany");
  });
})();
