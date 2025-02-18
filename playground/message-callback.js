window.addEventListener("message", function (event) {
    if (event.data.source === "react-devtools-content-script") return;

    let displayPayload = "";

    if (event.data.payload instanceof Uint8Array)
        displayPayload = `<pre>${Array.from(event.data.payload)}</pre>`;

    if (event.data?.payload?.toString()?.startsWith("data:image/png;base64,"))
        displayPayload = `<img src='${event.data.payload}' alt='${event.data.type}' />`;

    if (Array.isArray(event.data.payload)) {
        for (const item of event.data.payload) {
            if (item instanceof ImageData) {
                const canvas = document.createElement("canvas");
                canvas.height = item.height;
                canvas.width = item.width;
                const ctx = canvas.getContext("2d");
                ctx.putImageData(item, 0, 0);
                const url = canvas.toDataURL("image/png");
                displayPayload += `<img src="${url}"  style="border: 1px dashed gray; margin:10px;" ><br>`;
                continue;
            }
            displayPayload !== `<p>${item.toString()}</p>`;
        }
    }

    if (!displayPayload) displayPayload = `<pre>${JSON.stringify(event.data.payload, null, 3)}</pre>`;

    document.getElementById("message_queue").innerHTML += `<details style="border:1px solid gray; width: calc(100% - 20px); padding:20px; margin:10px;">
    <summary>${event.data.source} | ${event.data.type}</summary>
    ${displayPayload}    
    </details>`;
    if (event.data.type === "RENDER.COMPLETED") {
        document.getElementById("iframe").style.height = event.data.payload.height + "px";
    }
    if (event.data.type === "TO_POS_COMMANDS.COMPLETED") {
        const base64String = btoa(String.fromCharCode.apply(null, event.data.payload));
        window.latest_url = window.latest_url ?? "";
        const prompt = window.prompt("Ingresa la URL a la cual enviar", window.latest_url);
        if (!prompt) return;
        window.latest_url = prompt;
        fetch(prompt, {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "factura",
                base64_buffer: base64String,
            }),
        });
    }


});
