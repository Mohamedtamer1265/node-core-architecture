const fs = require("node:fs/promises");

(async () => {
  const FileHandle = await fs.open("./read-big/output.txt", "r");
  const FileHandleWrite = await fs.open("./read-big/dest.txt", "w");
  // it uses internal buffer 64kb by default
  // unlike it uses 16kb in fs.writeFileSync and fs.readFileSync
  const streamRead = FileHandle.createReadStream({ highWaterMark: 1024 }); // 1kb buffer
  const streamWrite = FileHandleWrite.createWriteStream();
  // we need to listen to data event to read the data in chunks
  streamRead.on("data", (chunk) => {
    if (!streamWrite.write(chunk)) {
      streamRead.pause();
    }
    console.log("----- New Chunk -----");
    // we need to extract even numbers from the chunk
    // I will just make it array of numbers and filter even numbers
    // the main problem is chunk may not end with complete number
    // so we need to handle that case
    // for simplicity get variable outside and append to the chunk if there is incomplete number (know that by adding 1 to get the next number) if it is
    // correct number then reset the variable else join them
    console.log(chunk);
  });
  streamWrite.on("drain", () => {
    // drain event is emitted when the internal buffer is emptied
    streamRead.resume();
  });
  streamRead.on("end", () => {
    FileHandle.close();
    FileHandleWrite.close();
  });
})();
