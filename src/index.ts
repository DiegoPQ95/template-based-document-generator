import "./index.css";

/// <reference path="./types.d.ts" />
import { ExportAsImage } from "./ExportAsImage";
import { ExportAsPOSCommands } from "./ExportAsPOSCommands";
import { RenderDocument } from "./RenderDocument";
import { setupHandlebars } from "./setupHandlebars";

/** El ID del element HTML donde se va a renderizar el documento .
 * Esta propiedad se usa en varios archivos (por eso se declara globalmente)
*/
window.TEMPLATE_TARGET_ID = "template_target";

document.addEventListener("DOMContentLoaded", Initialize);
async function Initialize() {
    const global = window as any;
    const handlebars = (await import("handlebars")).default;
    global.handlebars = handlebars;
    global.html2canvas = (await import("html2canvas")).default;
    global.NodeThermalPrinter = (await import("node-thermal-printer")).default;

    setupHandlebars(handlebars);
    registerPostMessage("RENDER", RenderDocument);
    registerPostMessage("TO_POS_COMMANDS", ExportAsPOSCommands)
    registerPostMessage("TO_B64IMG", ExportAsImage)
    NotifyReadyToParent();

    const templateProcessor = document.getElementById("template_target");
    if (templateProcessor) templateProcessor.innerHTML = `<div style="text-align:center;margin:auto"><h1 style="width:200px:" >📃</h1></div>`
};

function NotifyReadyToParent() {
    if (window.parent == window) return;
    const messageToSend: Action = {
        type: 'READY'
        , source: "runfood-template-processor"
    };

    // Enviar mensaje al window padre
    window.parent.postMessage(messageToSend, '*');
}

function registerPostMessage<T extends any>(type: string, handler: (payload: T) => Promise<any>) {

    window.addEventListener("message", function (event) {
        const data: Action = event.data;
        if (data.type !== type) return;
        handler(data.payload)
            .then(payload => {
                event.source?.postMessage({
                    type: type + ".COMPLETED",
                    payload,
                    source: "runfood-template-processor"
                } as Action)
            }).catch(error => {
                event.source?.postMessage({
                    type: type + ".FAILED",
                    payload: {
                        message: error.message,
                        name: error.name,
                        code: error.code,
                        stack: error.stack
                    },
                    source: "runfood-template-processor"
                } as Action)
            })
    });
}
interface Action {
    type: string
    payload?: any
    , source: string
}