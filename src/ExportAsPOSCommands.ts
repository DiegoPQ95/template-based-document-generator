import { DocumentToChunkImages } from "./DocumentToImage";
import CreateCommandEncoder, { Types } from "./CommandEncoder";
import { Cut, Drawer } from "./CommandEncoder/Actions";


interface ExportOptions {
    pos_lang: Types
    cut?: boolean
    beep?: [number, number]
    /** Si quieres convertir la imagen a escala de grises */
    grayscale?: boolean;
    cash_drawer?: boolean;
}

export async function ExportAsPOSCommands(options: ExportOptions) {

    const encoder = CreateCommandEncoder(options.pos_lang);


    if ((options.beep?.length || 0) >= 2) {
        encoder.beep(options.beep![0], options.beep![1]);
    }
    const imageChunks = await DocumentToChunkImages(options);
    console.debug && console.debug(`[${new Date().toJSON()}] Image to data successfully. bytes: ${imageChunks.reduce((a, b) => a + b.data.byteLength, 0)} / chunks: ${imageChunks.length}`);
    for (const imageData of imageChunks) {
        // Si creo el buffer desde el objeto `printer` interno, no se necesita `pngjs`

        encoder.image(imageData);
        console.debug && console.debug(`[${new Date().toJSON()}] images-as-buffer created successfully. bytes: ${imageData.data.buffer.byteLength}`);
    }

    if (options.cut) encoder.cutter(Cut.Full);
    if (options.cash_drawer) encoder.drawer(Drawer.First);

    const buf = encoder.raw();
    console.debug && console.debug(`[${new Date().toJSON()}] document buffer created successfully. bytes: ${buf.byteLength}`);
    return buf;
}