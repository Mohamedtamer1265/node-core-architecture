const fs = require("fs/promises");

(async () => {
  // also to limit our scope
  console.log("Watching for file changes...");

  const fileHandle = await fs.open("./files/app/command.txt", "r");

  // all file handlers are event emitters
  fileHandle.on("change", async () => {
    const size = (await fileHandle.stat()).size;
    const buffer = Buffer.alloc(size);

    const offset = 0;
    const length = size;
    const position = 0; // read from the start
    await fileHandle.read(buffer, offset, length, position);
    // no need to save the result in a variable as we just need the content that stored in the buffer
    console.log(buffer);
    // now we need to read its content 
    const data = buffer.toString("utf-8");
    console.log("File content:", data);
  });

  const watcher = fs.watch("./files/app/command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      fileHandle.emit("change");
    }
  }

  /* -- replaced by the above event emitter --
    const watcher = fs.watch("./files/app/command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change" && event.filename === "command.txt") {
      console.log("`command.txt` file has changed!");
      // read the file content ( open it first then read or write)
      // open (32) file descriptor ( id for the opened file)

      // get the size first to create buffer for that file
      const size = (await fileHandle.stat()).size;
      const buffer = Buffer.alloc(size);

      const offset = 0;
      const length = size;
      const position = 0; // read from the start
      const content = await fileHandle.read(buffer, offset, length, position);
      console.log(content);
      // it returns an object with bytesRead and buffer properties
      //byte read is the number of bytes actually read

      // now he always reads the entire file on each change
    }
  }
  */
})();
