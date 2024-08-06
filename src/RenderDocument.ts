declare const handlebars: typeof import("handlebars");

interface RenderDocument {
    title: string,
    content_template: string
    width: string
    fontSize: string
    data: Object
}
export async function RenderDocument(options: RenderDocument) {
    document.title = options.title;

    if (options.width) {
        document.documentElement.style.setProperty("--document-width", options.width || "800px");
    }
    if (options.fontSize) {
        document.documentElement.style.setProperty("--document-font-size", options.fontSize || "15px");
    }

    const output = document.getElementById(window.TEMPLATE_TARGET_ID);
    if (!output) throw new Error("No se encontró el elemento para renderizar el documento.");

    output.dataset.renderedAt = new Date().toJSON();
    output.innerHTML = handlebars_compile(options.data, options.content_template);
    await imagesLoaded();
    return { content: output.innerHTML, html: document.documentElement.innerHTML, width: document.documentElement.offsetWidth, height: document.documentElement.offsetHeight }
}

function handlebars_compile(data: { [key: string]: any }, templatestr: string) {
    const template = handlebars.compile(templatestr);
    return template(data);
}

function imagesLoaded() {
    const images = Array.from(document.querySelectorAll("div img")) as Array<HTMLImageElement>;
    if (!images.length) return Promise.resolve();
    // list all image widths and heights _after_ the images have loaded:
    return Promise.all(images.map(im => new Promise(resolve => im.onload = resolve))).then(() => {
        console.log("The images have loaded at last!\nHere are their dimensions (width,height):");
        console.log(images.map(im => ([im.width, im.height])));
    })

}