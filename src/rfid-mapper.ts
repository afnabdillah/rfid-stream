class RFIDMapper {
    constructor() {
    }

    private getKeyCode = (buffer: Buffer) => {
        const packet = buffer.toJSON().data
        /** remove first number */
        packet.shift()
        const keyCode = packet.find(el => el !== 0)
        return keyCode
    }

    getCharCode = (buffer: Buffer) => {
        /**
         * Char code reference: https://usb.org/sites/default/files/hut1_4.pdf
         * page 89
         */
        const num = this.getKeyCode(buffer)
        switch (num) {
            case 30: return "1";
            case 31: return "2";
            case 32: return "3";
            case 33: return "4";
            case 34: return "5";
            case 35: return "6";
            case 36: return "7";
            case 37: return "8";
            case 38: return "9";
            case 39: return "0";

            /** enter */
            case 40: return "\n";

            /** other characters are omitted since rfid doesn't contain them */

            default: return;
        }
    }


}

export { RFIDMapper }