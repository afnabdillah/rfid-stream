const { Readable, Writable } = require('stream');
const fs = require("fs")

// Create a readable stream from another source (e.g., a file stream)
// const otherStream = createYourOtherReadableStream(); // Replace with your actual stream creation logic
const otherStream = fs.createReadStream("package.json"); // Replace with your actual stream creation logic

// Create a writable stream for stdout
const stdoutStream = process.stdout;

// Create a buffer to store concatenated data
let concatenatedData = Buffer.alloc(0);

// Create a custom readable stream
const customStream = new Readable({
  read(size) {
    // Simulate reading from otherStream
    const chunk = otherStream.read();
    console.log("concat", chunk);

    if (chunk !== null) {
      // Concatenate the incoming chunk
      concatenatedData = Buffer.concat([concatenatedData, chunk]);

      // Check if 10 chunks have been received
      if (++this.chunkCount === 10) {
        // Emit the concatenated data
        this.push(concatenatedData);

        // Reset the count and buffer
        this.chunkCount = 0;
        concatenatedData = Buffer.alloc(0);
      }
    } else {
      // No more data to read from otherStream
      this.push(null);
    }
  },
});

// Set an initial chunk count
customStream.chunkCount = 0;

// Pipe the data from customStream to stdoutStream
customStream.pipe(stdoutStream);

// Start the streams
otherStream.resume();
customStream.resume();
