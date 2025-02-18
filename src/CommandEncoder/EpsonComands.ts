/**
 * ESC/POS Language commands
 */
class LanguageEscPos {
    /**
       * Initialize the printer
       * @return {Array}         Array of bytes to send to the printer
       */
    initialize() {
        return [
            {
                type: 'initialize',
                payload: [0x1b, 0x40],
            },
            {
                type: 'character-mode',
                value: 'single byte',
                payload: [0x1c, 0x2e],
            },
            {
                type: 'font',
                value: 'A',
                payload: [0x1b, 0x4d, 0x00],
            },
        ];
    }

    /**
       * Encode an image
       * @param {ImageData} image     ImageData object
       * @param {number} width        Width of the image
       * @param {number} height       Height of the image
       * @param {string} mode         Image encoding mode ('column' or 'raster')
       * @return {Array}             Array of bytes to send to the printer
       */
    image(image: ImageData, width: number, height: number, mode: "column" | "raster") {
        const result = [];

        const getPixel = (x: number, y: number) => x < width && y < height ? (image.data[((width * y) + x) * 4] > 0 ? 0 : 1) : 0;

        const getColumnData = (width: number, height: number) => {
            const data = [];

            for (let s = 0; s < Math.ceil(height / 24); s++) {
                const bytes = new Uint8Array(width * 3);

                for (let x = 0; x < width; x++) {
                    for (let c = 0; c < 3; c++) {
                        for (let b = 0; b < 8; b++) {
                            bytes[(x * 3) + c] |= getPixel(x, (s * 24) + b + (8 * c)) << (7 - b);
                        }
                    }
                }

                data.push(bytes);
            }

            return data;
        };

        const getRowData = (width: number, height: number) => {
            const bytes = new Uint8Array((width * height) >> 3);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x = x + 8) {
                    for (let b = 0; b < 8; b++) {
                        bytes[(y * (width >> 3)) + (x >> 3)] |= getPixel(x + b, y) << (7 - b);
                    }
                }
            }

            return bytes;
        };

        /* Encode images with ESC * */

        if (mode == 'column') {
            result.push(
                {
                    type: 'line-spacing',
                    value: '24 dots',
                    payload: [0x1b, 0x33, 0x24],
                },
            );

            getColumnData(width, height).forEach((bytes) => {
                result.push(
                    {
                        type: 'image',
                        property: 'data',
                        value: 'column',
                        width,
                        height: 24,
                        payload: [0x1b, 0x2a, 0x21, width & 0xff, (width >> 8) & 0xff, ...bytes, 0x0a],
                    },
                );
            });

            result.push(
                {
                    type: 'line-spacing',
                    value: 'default',
                    payload: [0x1b, 0x32],
                },
            );
        }

        /* Encode images with GS v */

        if (mode == 'raster') {
            result.push(
                {
                    type: 'image',
                    command: 'data',
                    value: 'raster',
                    width,
                    height,
                    payload: [
                        0x1d, 0x76, 0x30, 0x00,
                        (width >> 3) & 0xff, (((width >> 3) >> 8) & 0xff),
                        height & 0xff, ((height >> 8) & 0xff),
                        ...getRowData(width, height),
                    ],
                },
            );
        }

        return result;
    }

    /**
       * Cut the paper
       * @param {string} value    Cut type ('full' or 'partial')
       * @return {Array}         Array of bytes to send to the printer
       */
    cut(value: "full" | "partial") {
        let data = 0x00;

        if (value == 'partial') {
            data = 0x01;
        }

        return [
            {
                type: 'cut',
                payload: [0x1d, 0x56, data],
            },
        ];
    }

    /**
       * Send a pulse to the cash drawer
       * @param {number} device   Device number
       * @param {number} on       Pulse ON time
       * @param {number} off      Pulse OFF time
       * @return {Array}         Array of bytes to send to the printer
       */
    pulse(device?: number, on?: number, off?: number) {
        if (typeof device === 'undefined') {
            device = 0;
        }

        if (typeof on === 'undefined') {
            on = 100;
        }

        if (typeof off === 'undefined') {
            off = 500;
        }

        on = Math.min(500, Math.round(on / 2));
        off = Math.min(500, Math.round(off / 2));


        return [
            {
                type: 'pulse',
                payload: [0x1b, 0x70, device ? 1 : 0, on & 0xff, off & 0xff],
            },
        ];
    }


    /**
       * Change the codepage
       * @param {number} value    Codepage value
       * @return {Array}         Array of bytes to send to the printer
       */
    codepage(value: number) {
        return [
            0x1b, 0x74, value,
        ];
    }

    /**
       * Flush the printers line buffer
       * @return {Array}         Array of bytes to send to the printer
       */
    flush() {
        return [];
    }
}

export default LanguageEscPos;