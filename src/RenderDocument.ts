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
    return output.innerHTML
}

function handlebars_compile(data: { [key: string]: any }, templatestr: string) {
    const template = handlebars.compile(templatestr);
    return template(data);
}