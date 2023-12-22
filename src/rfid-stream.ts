import { RFIDMapper } from "./rfid-mapper";
import { Stream } from "stream";
import HID from "node-hid";

type HIDOpts = {
    vendorId: number
    productId: number
    path?: string
}

class RFIDStream extends Stream {
    public device;
    public vendorId;
    public productId;
    public path;
    private rfidMapper;
    private result: string;

    constructor(opts: HIDOpts) {
        super()
        this.validate(opts)
        this.result = ""

        this.vendorId = opts.vendorId ?? 0
        this.productId = opts.productId ?? 0
        this.path = opts.path

        this.device = this.getDevice()
        this.rfidMapper = new RFIDMapper()

        this.start()
    }

    private validate(opts: HIDOpts) {
        if (!opts) {
            throw new Error("Options must be filled")
        }
        if (!opts.vendorId || !opts.productId) {
            if (!opts.path) {
                throw new Error("Path must be filled with string")
            }
        } else {
            if (typeof opts.vendorId !== "number") {
                throw new Error("Vendor id must be filled with number")
            }
            if (typeof opts.productId !== "number") {
                throw new Error("Product id must be filled with number")
            }
        }
    }

    private getDevice() {
        if (this.path) {
            return new HID.HID(this.path)
        } else {
            return new HID.HID(this.vendorId, this.productId)
        }
    }

    static listDevices() {
        return HID.devices()
    }

    static listDevicesAsync() {
        return HID.devicesAsync()
    }

    start() {
        this.device.on("data", (data: Buffer) => {
            const char = this.rfidMapper.getCharCode(data)
            if (char === "\n") {
                this.emit("data", this.result)
                this.result = ""
            }
            if (typeof char === "string") {
                this.result += char
            }
        })
        this.device.on("error", (err) => this.emit("error", err))
        this.device.on("end", (end) => this.emit("end", end))
    }

    close() {
        this.device.close()
    }

    pause() {
        this.device.pause()
    }

    resume() {
        this.device.resume()
    }
}

export { RFIDStream }