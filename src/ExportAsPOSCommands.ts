import { DocumentToChunkImages } from "./DocumentToImage";
import CommandLib, { OpenDrawerCommand, CutCommand, PrinterTypes, InitializeCommand } from "./CommandLib";


interface ExportOptions {
    pos_lang: PrinterTypes
    cut?: boolean
    beep?: [number, number]
    /** Si quieres convertir la imagen a escala de grises */
    grayscale?: boolean;
    cash_drawer?: boolean;
}

export async function ExportAsPOSCommands(options: ExportOptions) {

    const lang_lib = CommandLib(options.pos_lang);

    const command_set = [] as Buffer[];


    command_set.push(InitializeCommand(lang_lib))

    if ((options.beep?.length || 0) >= 2 && "beep" in lang_lib) {
        command_set.push(
            lang_lib.beep(options.beep![0], options.beep![1])!
        )
    }
    const imageChunks = await DocumentToChunkImages(options);
    console.debug && console.debug(`[${new Date().toJSON()}] Image to data successfully. bytes: ${imageChunks.reduce((a, b) => a + b.data.byteLength, 0)} / chunks: ${imageChunks.length}`);
    for (const imageData of imageChunks) {
        // Si creo el buffer desde el objeto `printer` interno, no se necesita `pngjs`

        command_set.push(
            lang_lib.printImageBuffer(imageData.width, imageData.height, imageData.data)!
        )
        console.debug && console.debug(`[${new Date().toJSON()}] images-as-buffer created successfully. bytes: ${imageData.data.byteLength}`);
    }

    if (options.cut) command_set.push(CutCommand({ verticalTabAmount: 1 }, lang_lib));
    if (options.cash_drawer) command_set.push(OpenDrawerCommand(lang_lib));

    const buf = Buffer.concat(command_set);
    console.debug && console.debug(`[${new Date().toJSON()}] document buffer created successfully. bytes: ${buf.byteLength}`);
    return buf;
}