import { DocumentToImage } from "./DocumentToImage";

interface ExportAsImageOptions {
    /** Si quieres convertir la imagen a escala de grises */
    grayscale?: boolean;
}

export function ExportAsImage(options?: ExportAsImageOptions) {
    return DocumentToImage(options || {}, "base64");
}