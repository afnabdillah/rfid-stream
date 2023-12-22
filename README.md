# RFID-Stream

A simple parser of rfid from card readers that acts like a keyboard. Inspired from [node-hid-stream](https://github.com/agirorn/node-hid-stream) and [node-hid](https://github.com/node-hid/node-hid).

## Install

Make sure [node-hid](https://github.com/node-hid/node-hid) can be installed before installing this.

```bash
npm i rfid-stream
```

## How to use

```js
const { RFIDStream } = require("rfid-stream");

const devices = RFIDStream.listDevices();

console.log(devices); // check the vendorId, productId, and path from here

const device = new RFIDStream({ vendorId: 6790, productId: 56577 });

device.on("data", (data) => {
  console.log("data", data); // outpus "data 3890523184"
});

device.on("error", (err) => {
  console.log("error", err);
});
```

## Limitations

Refer to [node-hid limitations](https://github.com/node-hid/node-hid#general-notes) to see what devices cannot be read. In general, It's easier to read from linux than other OS.
