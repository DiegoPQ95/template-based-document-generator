declare const html2canvas: typeof import("html2canvas").default;

export interface ImageOptions {
    grayscale?: boolean;
    imageScale?: number;
}

export async function DocumentToImage(options: ImageOptions, type: "base64"): Promise<string>
export async function DocumentToImage(options: ImageOptions, type: "buffer"): Promise<ArrayBufferLike>
export async function DocumentToImage(options: ImageOptions, type: "base64" | "buffer") {

    const templateEl = document.getElementById(window.TEMPLATE_TARGET_ID);
    if (!templateEl) throw new Error("No se encontró el elemento para renderizar el documento");
    if (!templateEl.dataset.renderedAt) throw new Error("Primero ejecute la acción `RENDER antes de ejecutar esta nueva acción");

    const canvas = await html2canvas(templateEl, {
        backgroundColor: "#fff"
        , scale: options.imageScale || 1
    });

    if (!["base64", "buffer"].includes(type)) throw new RangeError(`Export image type '${type}' is not allowed`);
    if (options.grayscale) {
        // Convertir la imagen a escala de grises
        const ctx = canvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // rojo
            data[i + 1] = avg; // verde
            data[i + 2] = avg; // azul
        }

        ctx.putImageData(imageData, 0, 0);
    }
    if (type === "base64")
        return canvas.toDataURL("image/png");
    if (type === "buffer") {
        const ctx = canvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return imageData.data.buffer;
    }
}

/**
 * Devuelve una lista de tipo ImageData con los documentos.
 * @param chunkHeight Si no se especifica el tamaño, se asume que es 2.5x en ancho
 */
export async function DocumentToChunkImages(options: ImageOptions, chunkHeight: number = 900) {

    const templateEl = document.getElementById(window.TEMPLATE_TARGET_ID);
    if (!templateEl) throw new Error("No se encontró el elemento para renderizar el documento");
    if (!templateEl.dataset.renderedAt) throw new Error("Primero ejecute la acción `RENDER antes de ejecutar esta nueva acción");

    return html2canvas(templateEl, {
        backgroundColor: "#fff"
        , scale: options.imageScale || 1
    }).then(canvas => {
        const totalHeight = canvas.height;
        const chunkCount = Math.ceil(totalHeight / chunkHeight);
        const chunks = [];

        for (let i = 0; i < chunkCount; i++) {
            const canvasChunk = document.createElement('canvas');
            const ctx = canvasChunk.getContext('2d')!;
            const yOffset = i * chunkHeight;

            // Set canvas dimensions for the chunk
            canvasChunk.width = canvas.width;
            canvasChunk.height = Math.min(chunkHeight, totalHeight - yOffset);

            // Draw the chunk onto the new canvas
            ctx.drawImage(
                canvas,
                0, yOffset,                   // Source x, y
                canvas.width, canvasChunk.height,    // Source width, height
                0, 0,                         // Destination x, y
                canvas.width, canvasChunk.height // Destination width, height
            );

            // Get the imageData of the chunk
            const imageData = ctx.getImageData(0, 0, canvasChunk.width, canvasChunk.height);
            chunks.push(imageData);
        }

        return chunks;
    });
}