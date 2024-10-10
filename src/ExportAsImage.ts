import { DocumentToChunkImages, DocumentToImage } from "./DocumentToImage";

interface ExportAsImageOptions {
    /** Si quieres convertir la imagen a escala de grises */
    grayscale?: boolean;
    chunks?: boolean
}

export function ExportAsImage(options?: ExportAsImageOptions) {
    if (options?.chunks) {
        return DocumentToChunkImages({
            grayscale: options?.grayscale
            , imageScale: 1
        });
    }
    return DocumentToImage(options || {}, "base64");
}