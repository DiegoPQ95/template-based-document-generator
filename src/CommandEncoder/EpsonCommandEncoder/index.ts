import { Cut, Drawer } from "../Actions";
import Image from "../Image";

export class EpsonCommandEncoder {
    private commands: Buffer[] = [];

    write(buff: Buffer) {
        this.commands.push(buff);
        return this;
    }

    feed(lines: number) {
        if (lines > 1) {
            const count = Math.trunc(lines / 255);
            let cmd = ('\x1Bd' + String.fromCharCode(Math.min(lines, 255))).repeat(
                count,
            );
            const remaining = lines - count * 255;
            if (remaining > 0) {
                cmd += '\x1Bd' + String.fromCharCode(remaining);
            }
            return this.write(Buffer.from(cmd));
        } else {
            return this.write(Buffer.from('\r\n', 'ascii'));
        }
    }

    cutter(_: Cut) {
        return this.write(Buffer.from('\x1Bm', 'ascii'));
    }

    // ------------------------------ Beep ------------------------------
    // "numberOfBeeps" is the number of beeps from 1 to 9
    // "lengthOfTheSound" is the length of the sound from 1 to 9 (it's not in seconds, it's just the preset value)
    beep(numberOfBeeps = 1, lengthOfTheSound = 1) {
        if (numberOfBeeps < 1 || numberOfBeeps > 9) throw new Error('numberOfBeeps: Value must be between 1 and 9');
        if (lengthOfTheSound < 1 || lengthOfTheSound > 9) throw new Error('lengthOfTheSound: Value must be between 1 and 9');
        return this.write(Buffer.from([0x1b, 0x42]))
            .write(Buffer.from([numberOfBeeps, lengthOfTheSound]));
    }

    buzzer() {
        return this.write(Buffer.from('\x07', 'ascii'));
    }

    drawer(
        number: Drawer
    ) {

        const on_time: number = 120;
        const off_time: number = 240;

        const index = {
            [Drawer.First]: 0,
            [Drawer.Second]: 1,
        };
        const on_time_char = String.fromCharCode(
            Math.min(Math.trunc(on_time / 2), 255),
        );
        const off_time_char = String.fromCharCode(
            Math.min(Math.trunc(off_time / 2), 255),
        );
        const index_char = String.fromCharCode(index[number]);
        return this.write(
            Buffer.from('\x1Bp' + index_char + on_time_char + off_time_char, 'ascii'),
        );
    }


    image(imageData: ImageData) {
        const image = new Image({ data: Buffer.from(imageData.data.buffer), height: imageData.height, width: imageData.width });
        const low = String.fromCharCode(image.width & 0xff);
        const high = String.fromCharCode((image.width >> 8) & 0xff);
        this.write(Buffer.from('\x1B3\x10', 'ascii'));
        for (let y = 0; y < image.lines; y++) {
            const data = image.lineData(y);
            this.write(Buffer.from(this.bitmapCmd + low + high, 'ascii'));
            this.write(data);
            this.write(Buffer.from('\x1BJ\x00', 'ascii'));
        }
        return this.write(Buffer.from('\x1B2', 'ascii'));
    }

    raw() {
        return Buffer.concat(this.commands);
    }

    protected get bitmapCmd(): string {
        return '\x1B*!';
    }
}

