const content_template = ` <small>Fecha: {{ updatedAt }}</small>
      <h1>{{ formaDespacho }}</h1>
      <h3>PEDIDO #{{ numero}} </h3>
      <hr />
      <table cellspacing="10px" style="width:100%;">
      <thead>
        <tr>
          <th style="width:20%; min-width:20%; max-width:20%;" ></th>
          <th style="width:80%; min-width:80%; max-width:80%" ></th>
        </tr>
      </thead>
        <tbody>
        {{#each detalle}}
          <tr>
            <td style="vertical-align:baseline;" ><h1>{{cantidad}}</h1></td>
            <td>
              <p class="uppercase">{{ descripcion }}</p>
              <small>{{ observacion }}</small>
              <code>idDetalle: {{ idDetalle }}</code>
            </td>
          </tr>
          {{/each}}
        </tbody>
      </table>

      <p>Usuario: {{Usuario}}</p>
          <br/>
          <br/>`

function RENDER() {
  const width = 384
  document.getElementById("iframe").style.width = width + 60;
  document.getElementById("iframe").contentWindow.postMessage({
    type: "RENDER",
    payload: {
      title: "Factura",
      width: width + "px",
      fontSize: "25px",
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

function TO_IMAGE() {

  const iframe = document.getElementById("iframe");
  iframe.contentWindow.postMessage({
    type: "TO_B64IMG",
    payload: {
      grayscale: true
    }
  });
}


