const fs = require("fs")
const Stream = require("stream")
const split = require("split")
const assert = require("assert")

const stream = fs.createReadStream("package-lock.json")

let result = []

class ExampleStream extends Stream {
    constructor(file) {
        super()
        this.stream = fs.createReadStream(file).pipe(split())
        this.result = []
        this.count = 0

        this.start()
    }

    start() {
        // this.stream.on("data", (chunk) => {
        //     if (this.count === 10) {
        //         this.emit("data", this.result)
        //         this.result = []
        //         this.count = 0
        //     } else {
        //         this.result.push(chunk)
        //         this.count++
        //     }
        // })
        this.stream.on("data", (chunk) => this.emit("data", chunk))
        this.stream.on("error", (err) => this.emit("error", err))
        this.stream.on("end", (end) => this.emit("end", end))
    }
}

class ExampleStream2 extends ExampleStream {
    constructor(file) {
        super(file)
    }

    start() {
        this.stream.on("data", (chunk) => {
            if (this.count === 10) {
                this.emit("data", this.result)
                this.result = [chunk]
                this.count = 1
            } else {
                this.result.push(chunk)
                this.count++
            }
        })
        this.stream.on("error", (err) => this.emit("error", err))
        this.stream.on("end", (end) => {
            this.emit("data", this.result)
            this.emit("end", end)
            this.result = []
        })
    }
}

const example = new ExampleStream2("package.json")

example.on("data", (data) => {
    // console.log("data", data)
    // console.log("data", data.length)
    result.push(...data)
})

example.on("error", console.error)

example.on("end", () => {
    console.log("Stream has finished!!")
    let allStr = result.join("\n")
    console.log("result", allStr)
    assert.deepStrictEqual(allStr, fs.readFileSync("package.json", "utf-8"))
})
