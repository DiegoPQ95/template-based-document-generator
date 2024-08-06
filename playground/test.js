const content_template = ` <small>Fecha: {{ updatedAt }}</small>
      <h1>{{ formaDespacho }}</h1>
      <h3>PEDIDO #{{ numero}} </h3>

      <p>Usuario: {{Usuario}} 👋</p>
      <ol>
        <li>Hola mundo</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
        <li>Como estas?</li>
      </ol>
      <ul>
        <li>Que onda</li>
        <li>De que me sirve?</li>
      </ul>

      <div>
      <span class='barcode-128 vertical-content' data-text="Hola Mundo"></span>
      <div class='barcode-128 legend' data-text="123"></div>
      <div class="qr-code" data-text="https://runfoodapp.com" size="300" ></div>
      </div>

      <hr />
      <table>
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

<br/>
<br/>`

function RENDER() {
  const width = 200
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

function TO_IMAGE() {

  const iframe = document.getElementById("iframe");
  iframe.contentWindow.postMessage({
    type: "TO_B64IMG",
    payload: {
      grayscale: true
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