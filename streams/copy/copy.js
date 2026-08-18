const fs = require("fs/promises");

// Memory usage : 1GB
// 900ms
async () => {
  // copying file using promises and async await
  const destfile = await fs.open("output.txt", "w");
  const result = await fs.readFile("text.txt");

  await destfile.write(result);
  console.log(result.toString());
};


// make sure this code is working
// Memory usage : 20MB
// Execution time : 2s
(async () => {
  // copying file using promises and async await
  const src = await fs.open("output.txt", "r");
  const result = await fs.open("text.txt", "w");

  // console.log(await src.read()); // chunk of buffers
  // so keep looping until the end of file as chunks and then copy all
  let readResult = await src.read();
  let bytesread = -1;
  while (bytesread != 0) {
    const readResult = await src.read();
    bytesread = readResult.bytesRead;
    if(bytesread !== 16384){
        const indexofzero = readResult.buffer.indexOf(0);
        const indexoflastnonzero = readResult.buffer.lastIndexOf(0, indexofzero - 1);
        const trimmedBuffer = readResult.buffer.slice(0, indexoflastnonzero + 1);
        await result.write(trimmedBuffer);
    } else {
        await result.write(readResult.buffer);
    }
  }
});



// using pipe method to copy file (more efficient and faster than async await and promises)
( async () => {
    const src = await fs.open("output.txt", "r");
    const result = await fs.open("text.txt", "w");
    const readstream = src.createReadStream();
    const writestream = result.createWriteStream();
    readstream.pipe(writestream); // it handles backpressure automatically and also it is faster than async await and promises
    // backpressure is a mechanism that prevents a fast producer from overwhelming a slow consumer. It ensures that the consumer can process data at its own pace without being flooded with more data than it can handle.
}

)

