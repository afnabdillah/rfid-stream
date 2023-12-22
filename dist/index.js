"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  RFIDStream: () => RFIDStream
});
module.exports = __toCommonJS(src_exports);

// src/rfid-mapper.ts
var RFIDMapper = class {
  constructor() {
    this.getKeyCode = (buffer) => {
      const packet = buffer.toJSON().data;
      packet.shift();
      const keyCode = packet.find((el) => el !== 0);
      return keyCode;
    };
    this.getCharCode = (buffer) => {
      const num = this.getKeyCode(buffer);
      switch (num) {
        case 30:
          return "1";
        case 31:
          return "2";
        case 32:
          return "3";
        case 33:
          return "4";
        case 34:
          return "5";
        case 35:
          return "6";
        case 36:
          return "7";
        case 37:
          return "8";
        case 38:
          return "9";
        case 39:
          return "0";
        case 40:
          return "\n";
        default:
          return;
      }
    };
  }
};

// src/rfid-stream.ts
var import_stream = require("stream");
var import_node_hid = __toESM(require("node-hid"));
var RFIDStream = class extends import_stream.Stream {
  constructor(opts) {
    var _a, _b;
    super();
    this.validate(opts);
    this.result = "";
    this.vendorId = (_a = opts.vendorId) != null ? _a : 0;
    this.productId = (_b = opts.productId) != null ? _b : 0;
    this.path = opts.path;
    this.device = this.getDevice();
    this.rfidMapper = new RFIDMapper();
    this.start();
  }
  validate(opts) {
    if (!opts) {
      throw new Error("Options must be filled");
    }
    if (!opts.vendorId || !opts.productId) {
      if (!opts.path) {
        throw new Error("Path must be filled with string");
      }
    } else {
      if (typeof opts.vendorId !== "number") {
        throw new Error("Vendor id must be filled with number");
      }
      if (typeof opts.productId !== "number") {
        throw new Error("Product id must be filled with number");
      }
    }
  }
  getDevice() {
    if (this.path) {
      return new import_node_hid.default.HID(this.path);
    } else {
      return new import_node_hid.default.HID(this.vendorId, this.productId);
    }
  }
  static listDevices() {
    return import_node_hid.default.devices();
  }
  static listDevicesAsync() {
    return import_node_hid.default.devicesAsync();
  }
  start() {
    this.device.on("data", (data) => {
      const char = this.rfidMapper.getCharCode(data);
      if (char === "\n") {
        this.emit("data", this.result);
        this.result = "";
      }
      if (typeof char === "string") {
        this.result += char;
      }
    });
    this.device.on("error", (err) => this.emit("error", err));
    this.device.on("end", (end) => this.emit("end", end));
  }
  close() {
    this.device.close();
  }
  pause() {
    this.device.pause();
  }
  resume() {
    this.device.resume();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RFIDStream
});
//# sourceMappingURL=index.js.map