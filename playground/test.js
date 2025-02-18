const content_template = `<div style="text-align:center;margin:auto;">
    <img width="400px" src="http://runfoodapp.com/cdn/runfood-bw-letters.jpg">
</div>
<center>
    <p>PEDIDO #5</p>
    <span style="background-color:black; color:white">COCINA</span>
    </center>
    <br>

                <center><p>NUEVO</p></center>
            <table>
                <tbody>
                    <tr>
                    <td style="width: 30px; text-align: left">
                        +1
                    </td>
                    <td>
                        <p>ALMUERZITO</p>
<br>
                    </td>
                    </tr>
                    <tr>
                    <td style="width: 30px; text-align: left">
                        +1
                    </td>
                    <td>
                        <p>ALMUERZITO</p>
<br>
                    </td>
                    </tr>
                </tbody>
            </table>

        <br>
    <p>Usuario: RUNFOOD</p>
    <p>última modificación: 2025-02-17 22:33:44</p>
    <style>
    td,
    th {
        vertical-align: baseline;
    }
    </style>

<img height="300" src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&amp;data=Example">`

function RENDER() {
  const width = 384
  document.getElementById("iframe").style.width = width + 60;
  document.getElementById("iframe").contentWindow.postMessage({
    type: "RENDER",
    payload: {
      title: "Factura",
      width: width + "px",
      fontSize: "40px",
      content_template,
      data: {
        updatedAt: new Date().toLocaleString("es-EC")
        , formaDespacho: "Mesa #10"
        , numero: "10"
        , detalle: [
          { idDetalle: 1, descripcion: "Natú cosmétics 😃 🐛🐜", cantidad: 10 }
          , { idDetalle: 2, descripcion: "SEMPI . 无论你多么想要，你都无法再拥有我", cantidad: 10 }
          , { idDetalle: 2, descripcion: "SEMPI . 无论你多么想要，你都无法再拥有我", cantidad: 10 }
          , { idDetalle: 2, descripcion: "SEMPI . 无论你多么想要，你都无法再拥有我", cantidad: 10 }
          , { idDetalle: 2, descripcion: "SEMPI . 无论你多么想要，你都无法再拥有我", cantidad: 10 }
          , { idDetalle: 2, descripcion: "SEMPI . 无论你多么想要，你都无法再拥有我", cantidad: 10 }
        ]
      },
      Usuario: "Pablo Neruda"
    },
  });
}

function TO_IMAGE(chunks) {

  const iframe = document.getElementById("iframe");
  iframe.contentWindow.postMessage({
    type: "TO_B64IMG",
    payload: {
      grayscale: true,
      chunks: chunks
    }
  });
}



function MOVE_FRAME_BETWEEN_CONTAINERS() {
  const iframe = document.getElementById("iframe");
  if (!iframe) return;

  const originalContainer = document.getElementById("frame_container");
  if (!originalContainer) return;

  const nested = document.getElementById("nested_component");
  if (!nested) return;

  if (isChild(originalContainer, iframe))
    return nested.appendChild(iframe);

  originalContainer.appendChild(iframe);
}

function isChild(parent, child) {
  return parent.contains(child);
}