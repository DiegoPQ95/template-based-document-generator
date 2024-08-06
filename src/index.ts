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
    try {

        const global = window as any;
        const handlebars = (await import("handlebars")).default;
        global.handlebars = handlebars;
        global.html2canvas = (await import("html2canvas")).default;
        global.NodeThermalPrinter = (await import("node-thermal-printer")).default;
        global.threadId = new URL(window.location.href).searchParams.get("thread-id") || "";

        setupHandlebars(handlebars);
        registerPostMessage("RENDER", RenderDocument);
        registerPostMessage("TO_POS_COMMANDS", ExportAsPOSCommands)
        registerPostMessage("TO_B64IMG", ExportAsImage)
        NotifyReadyToParent();

        const templateProcessor = document.getElementById("template_target");
        if (templateProcessor) templateProcessor.innerHTML = `<div style="text-align:center;margin:auto"><h1 style="width:200px:" >📃</h1></div>`
    } catch (ex) {
        NotifyReadyToParent(ex as any);
    }
};

function getThreadId(): string | null | undefined {
    return (window as any).threadId;
}

function NotifyReadyToParent(error?: Error) {
    if (window.parent == window) return;
    const messageToSend: Action = {
        type: 'READY'
        , source: "@runfoodapp/template-based-document-generator"
        , threadId: getThreadId()
    };
    if (error) messageToSend.type += "INITIALIZATION_ERROR";

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
                    source: "@runfoodapp/template-based-document-generator",
                    threadId: getThreadId()
                } as Action, "*" as any)
            }).catch(error => {
                event.source?.postMessage({
                    type: type + ".FAILED",
                    payload: {
                        message: error.message,
                        name: error.name,
                        code: error.code,
                        stack: error.stack
                    },
                    source: "@runfoodapp/template-based-document-generator",
                    threadId: getThreadId()
                } as Action, "*" as any)
            })
    });
}
interface Action {
    type: string
    payload?: any
    , source: string
    , threadId: string | null | undefined
}