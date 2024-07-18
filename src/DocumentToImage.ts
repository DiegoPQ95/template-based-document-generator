import { template } from "handlebars";

declare const html2canvas: typeof import("html2canvas").default;

export interface ImageOptions {
    grayscale?: boolean;
}

export async function DocumentToImage(options: ImageOptions, type: "base64"): Promise<string>
export async function DocumentToImage(options: ImageOptions, type: "imageData"): Promise<ImageData>
export async function DocumentToImage(options: ImageOptions, type: "buffer"): Promise<ArrayBufferLike>
export async function DocumentToImage(options: ImageOptions, type: "base64" | "buffer" | "imageData") {

    const templateEl = document.getElementById(window.TEMPLATE_TARGET_ID);
    if (!templateEl) throw new Error("No se encontró el elemento para renderizar el documento");
    if (!templateEl.dataset.renderedAt) throw new Error("Primero ejecute la acción `RENDER antes de ejecutar esta nueva acción");

    const canvas = await html2canvas(templateEl, {
        backgroundColor: "#fff"
    });

    if (!["base64", "buffer", "imageData"].includes(type)) throw new RangeError(`Export image type '${type}' is not allowed`);
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
    if (type === "imageData") {
        const ctx = canvas.getContext('2d')!;
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}