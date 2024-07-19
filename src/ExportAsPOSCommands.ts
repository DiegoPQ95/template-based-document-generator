import { DocumentToImage } from "./DocumentToImage";

declare const NodeThermalPrinter: typeof import("node-thermal-printer");

interface ExportOptions {
    pos_lang: import("node-thermal-printer").PrinterTypes
    cut?: boolean
    beep?: [number, number]
    /** Si quieres convertir la imagen a escala de grises */
    grayscale?: boolean;
    cash_drawer?: boolean;
}

export async function ExportAsPOSCommands(options: ExportOptions) {
    const printer = new NodeThermalPrinter.ThermalPrinter({
        type: options.pos_lang
        , interface: undefined as any as string // si lo dejo en `undefined` no se utiliza ninguna función nativa
    });

    if ((options.beep?.length || 0) >= 2) {
        debugger;
        printer.beep(options.beep![0], options.beep![1]);
    }
    const imageData = await DocumentToImage(options, "imageData");
    // Si creo el buffer desde el objeto `printer` interno, no se necesita `pngjs`
    const buff = await (printer as any).printer.printImageBuffer(imageData.width, imageData.height, imageData.data);
    printer.append(buff);

    if (options.cut) printer.cut({
        verticalTabAmount: 0
    });
    if (options.cash_drawer) printer.openCashDrawer();

    const buffer = printer.getBuffer();
    return buffer;
}