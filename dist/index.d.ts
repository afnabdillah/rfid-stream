import { Stream } from 'stream';
import HID from 'node-hid';

type HIDOpts = {
    vendorId: number;
    productId: number;
    path?: string;
};
declare class RFIDStream extends Stream {
    device: HID.HID;
    vendorId: number;
    productId: number;
    path: string | undefined;
    private rfidMapper;
    private result;
    constructor(opts: HIDOpts);
    private validate;
    private getDevice;
    static listDevices(): HID.Device[];
    static listDevicesAsync(): Promise<HID.Device[]>;
    start(): void;
    close(): void;
    pause(): void;
    resume(): void;
}

export { type HIDOpts, RFIDStream };
