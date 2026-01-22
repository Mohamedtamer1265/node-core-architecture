const { Buffer,constants } = require("buffer");
console.log(constants.MAX_LENGTH); // maximum buffer size
const memoryContainer = Buffer.alloc(4); // alllocate 10 bytes from buffer memory
// now we create a fixed size buffer of 10 bytes
// each byte can hold a number from 0 to 255
console.log(memoryContainer); // 10
memoryContainer[0] = 0xf4; // set the 4th byte to 255
console.log(memoryContainer[0]); // 255
console.log(memoryContainer.toString("hex")); // f4000000

const buffer2 = Buffer.alloc(4);
buffer2.writeUInt8(255, 1); // set the 1st byte to 255
buffer2 = Buffer.from([0xf4, 0x00, 0x00, 0x00]); // create a buffer from an array of bytes
// they are using buffer.allocUnsafe to create a buffer without initializing it
console.log(buffer2.toString("hex")); // f4ff0000
console.log(buffer2.toString(2)) // make it binary
const buffer3 = Buffer.from("Hello World", "utf-8"); // create a buffer from a string
console.log(buffer3); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64> so you don't need the ascii values
