const { Writable } = require("node:stream");
const fs = require("node:fs");
const path = require("node:path");
// we have 4 types of streams in nodejs
// 1. Readable
// 2. Writable
// 3. Duplex
// 4. Transform
class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    /*
    HighWaterMark does NOT mean "the maximum size of the buffer."
    It's a threshold used for backpressure.
    So remember it as:
    HighWaterMark = "How much data can be comfortably queued before write() tells me to slow down
    */
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;
    // writableHighwaterMark is the same as the highWaterMark we set in the constructor, but it's a property of the stream instance, so we can access it from inside the class
    if (this.chunksSize >= this.writableHighWaterMark) {
      const toWrite = Buffer.concat(this.chunks);
      fs.write(this.fd, toWrite, (err) => {
        if (err) return callback(err);
        this.chunks = [];
        this.chunksSize = 0;
        ++this.writesCount;
        callback();
      });
    } else {
      // buffered but below threshold — signal async completion
      callback();
    }
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
  _final(callback) {
    // write inside fd file the buffer data
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);
      this.chunks = [];
      this.chunksSize = 0;
      ++this.writesCount;
      // we need callback to be called to signal that the stream is finished and can be closed
      // and also destroy won't work if we don't call callback here, because destroy is called after the stream is finished, and if we don't call callback here, destroy will be called before the stream is finished, and destroy will not be able to close the file descriptor because it's still being used by the stream
      callback();
    });
  }

  // this will run after the constructor is called, and before all the writes are done, so
  // we can use this to open the file and get the file descriptor until we call the callback function, the stream will not be ready to write
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // call with argument to indicate that the stream is not ready to write
        callback(err);
      } else {
        this.fd = fd;
        // no argument means that the stream is ready to write
        callback();
      }
    });
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: path.join(__dirname, "test.txt"),
});
stream.write(Buffer.from("Hello World"));
stream.write(Buffer.from("Hello World"));
// I need to write end so I can put my data in the file, because if I don't call end, the stream will not be finished and the file will not be closed, and the data will not be flushed to the file
// so that we say only 1 write is done
stream.end(Buffer.from("our last write"));

// the drain event is emitted when the stream is ready to accept more data after a write() call returned false
stream.on("drain", () => {
  console.log("Drain event emitted");
});

// the finish event is emitted when the stream has been ended and all the data has been flushed to the underlying system
stream.on("finish", () => {
  console.log("Finish event emitted");
  console.log(`Total writes: ${stream.writesCount}`);
});
