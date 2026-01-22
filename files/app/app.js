const fs = require("fs/promises");

(async () => {
  const createFile = async (path) => {
    try {
      // check if the file already exists
      const existingFileCheck = await fs.open(path, "r");
      existingFileCheck.close();
      return console.log("the file path already exists");
    } catch (error) {
      // if the file does not exist create it
      const newFile = await fs.open(path, "w"); // so if I could open it in read mode it means it exists else write mode to create it
      console.log(`file created at path: ${path}`);
      newFile.close();
    }
  };
  const deleteFile = async (path) => {
    // check if the file exists
    try {
      const existingFileCheck = await fs.open(path, "r");
      // if we could open it in read mode it means it exists
      await fs.unlink(path); // we can use also fs.rm(path);
      // the main difference is that rm can delete directories also (many files) while unlink only delete files
      // rm -rf  ( r for recursive , f for force)
      // please don't delete your operating system :)
      console.log(`file deleted at path: ${path}`);
      existingFileCheck.close();
    } catch (error) {
      if (error.code === "ENOENT") {
        // ENOENT means Error NO ENTry (no such file or directory)
        return console.log("the file path does not exist");
      } else return console.log("the file path does not exist");
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      const existingFileCheck = await fs.open(oldPath, "r");
      // if we could open it in read mode it means it exists
      await fs.rename(oldPath, newPath);
      console.log(`file renamed from ${oldPath} to ${newPath}`);
      existingFileCheck.close();
    } catch (error) {
      if (error.code === "ENOENT") {
        return console.log("the old file path does not exist");
      } else return console.log("the old file path does not exist");
    }
  };
  const appendToFile = async (path, content) => {
    try {
      const existingFileCheck = await fs.open(path, "r");
      // if we could open it in read mode it means it exists
      await fs.appendFile(path, content);
      console.log(`content appended to file at path: ${path}`);
      existingFileCheck.close();
      /*
      another way using opened file handle
        const fileHandle = await fs.open(path, "a"); // open in append mode
        await fileHandle.write(content);
        console.log(`content appended to file at path: ${path}`);
        fileHandle.close();
      */
    } catch (error) {
      return console.log("the file path does not exist");
    }
  };

  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to the file";
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

    // create a file <path>
    if (data.startsWith(CREATE_FILE)) {
      const filePath = data.substring(CREATE_FILE.length).trim();
      createFile(filePath);
      // delete a file <path>
    } else if (data.startsWith(DELETE_FILE)) {
      const filePath = data.substring(DELETE_FILE.length).trim();
      deleteFile(filePath);

      // rename a file <oldPath>, <newPath>
    } else if (data.startsWith(RENAME_FILE)) {
      const paths = data.substring(RENAME_FILE.length).trim().split(",");
      const oldPath = paths[0].trim();
      const newPath = paths[1].trim();
      renameFile(oldPath, newPath);
      // add to the file <path>, <content>
    } else if (data.startsWith(ADD_TO_FILE)) {
      const contentParts = data.substring(ADD_TO_FILE.length).trim().split(",");
      const path = contentParts[0].trim();
      const content = contentParts[1].trim();
      appendToFile(path, content);
    }
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
