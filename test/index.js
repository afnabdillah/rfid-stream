const {RFIDStream} = require("../dist/index.js")

const device = new RFIDStream({vendorId: 6790, productId: 56577})

device.on("data", (data) => {
    console.log("data", data)
})

device.on("error", (err) => {
    console.log("error", err)
})
