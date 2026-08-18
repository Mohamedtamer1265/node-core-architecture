/*
there is no multiple inheritance in javascript, so we can't extend both Readable and Writable streams, but we can use composition to achieve the same effect,
 by creating a class that extends Duplex stream and then
 using the Readable and Writable streams as properties of that class
*/
const { Duplex } = require("node:stream");
const fs = require("node:fs");
const path = require("node:path");

class CustomDuplex extends Duplex {
  constructor({
    readableHighWaterMark,
    writableHighWaterMark,
    readableFileName,
    writableFileName,
  }) {
    super({
      readableHighWaterMark,
      writableHighWaterMark,
    });

    this.readableFileName = readableFileName;
    this.writableFileName = writableFileName;
    this.readFd = null;
    this.writeFd = null;
    this.pendingChunks = [];
    this.pendingChunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.readableFileName, "r", (readErr, readFd) => {
      if (readErr) return callback(readErr);
      this.readFd = readFd;

      fs.open(this.writableFileName, "w", (writeErr, writeFd) => {
        if (writeErr) {
          fs.close(this.readFd, () => callback(writeErr));
          return;
        }

        this.writeFd = writeFd;
        callback();
      });
    });
  }

  _read(size) {
    const buffer = Buffer.alloc(size);

    fs.read(this.readFd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
        return;
      }

      if (bytesRead > 0) {
        this.push(buffer.subarray(0, bytesRead));
      } else {
        this.push(null);
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.pendingChunks.push(chunk);
    this.pendingChunksSize += chunk.length;

    if (this.pendingChunksSize >= this.writableHighWaterMark) {
      const toWrite = Buffer.concat(this.pendingChunks);

      fs.write(this.writeFd, toWrite, (err) => {
        if (err) return callback(err);

        this.pendingChunks = [];
        this.pendingChunksSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    if (this.pendingChunksSize > 0) {
      const toWrite = Buffer.concat(this.pendingChunks);

      fs.write(this.writeFd, toWrite, (err) => {
        if (err) return callback(err);

        this.pendingChunks = [];
        this.pendingChunksSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _destroy(err, callback) {
    const closeFd = (fd, next) => {
      if (!fd) return next();
      fs.close(fd, (closeErr) => next(err || closeErr));
    };

    closeFd(this.writeFd, () => {
      closeFd(this.readFd, () => callback(err));
    });
  }
}

const readableFile = path.join(__dirname, "..", "customReadable", "test.txt");
const writableFile = path.join(__dirname, "output.txt");

const stream = new CustomDuplex({
  readableHighWaterMark: 4,
  writableHighWaterMark: 12,
  readableFileName: readableFile,
  writableFileName: writableFile,
});

stream.on("data", (chunk) => {
  console.log("Readable chunk:", chunk.toString());
});

stream.on("error", (err) => {
  console.error("Duplex error:", err);
});

stream.on("finish", () => {
  console.log("Finished writing to the output file.");
});

stream.write(Buffer.from("Hello from Duplex"));
stream.write(Buffer.from(" - this is written"));
stream.end();
