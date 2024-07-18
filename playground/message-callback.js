window.addEventListener("message", function (event) {
    if (event.data.source === "react-devtools-content-script") return;

    document.getElementById("message_queue").innerHTML += `<fieldset>
    <legend>${event.data.source}</legend>
    <pre>${JSON.stringify(event.data, null, 3)}<pre/>
    ${event.data?.payload?.toString()?.startsWith("data:image/png;base64,") ? `<img src='${event.data.payload}' alt='${event.data.type}' />` : ""}
    </fieldset>`;


    if (event.data.type === "TO_POS_COMMANDS.COMPLETED") {
        const base64String = btoa(String.fromCharCode.apply(null, event.data.payload));
        fetch("http://localhost:1000/PRINT_SERVICE", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "factura",
                b64_buffer: base64String,
            }),
        });
    }


});
