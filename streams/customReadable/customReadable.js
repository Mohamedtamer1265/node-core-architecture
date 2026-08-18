const { Readable } = require("node:stream");
const fs = require("node:fs");
class FileReadStream extends Readable {
  constructor(highWaterMark, fileName) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  // you have to implement the _read method, which is called when the stream wants to read data
  _read(size) {
    // read 4 bytes or watever
    const buffer = Buffer.alloc(size);
    fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) {
        // there is no callback to call here so use destroy
        // one if the dif between writable and readable streams is that writable streams have a callback to call when there is an error, but readable streams don't have a callback to call when there is an error, so we have to use destroy to signal that there is an error
        this.destroy(err);
        this.push(null); // signal end of stream
      } else {
        if (bytesRead > 0) {
          this.push(buffer.slice(0, bytesRead));
        } else {
          this.push(null); // signal end of stream
        }
      }
    });
  }
  _destroy(err, callback) {
    console.log("Destroying the stream");
    if (this.fd) {
      fs.close(this.fd, (closeErr) => {
        callback(err || closeErr);
      });
    } else {
        callback(err);
    }
    }
}
const stream = new FileReadStream(4, "test.txt");

/*
"data" belongs to Readable streams (It says: "I have data ready to emit!").
"drain" belongs to Writable streams (It says: "My buffer is empty, send me more!").
*/
stream.on("data", (chunk) => {
 console.log(chunk);
});
