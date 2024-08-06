# @runfoodapp/template-based-document-generator

Este proyecto permite generar un documento como HTML, como imagen o como POS Commands (en lenguajeS `epson`
`tanca`
`star`
`daruma`)

Este proyecto está diseñado para ejecutarse dentro de un iframe. Se interactura con el iframe a traves de mensajes.

### Formato del mensaje
Se presta la idea de `action` (redux):
```typescript
interface Action{
    "type": string,
    "payload": any | null | undefined,
    "source": "@runfoodapp/template-based-document-generator",
    "threadId" : string | undefined
}
```


### Acciones disponibles:
| Dirección | tipo de acción (type) | carga (payload) |
|---:|---|---|
| Salida | READY |  |
| Entrada | RENDER | RenderDocumentPayload |
| Salida | RENDER.COMPLETED | RenderDocumentCompletedPayload |
| Salida | RENDER.FAILED | Error |
| Entrada | TO_POS_COMMANDS | POSCommandsPayload |
| Salida | TO_POS_COMMANDS.COMPLETED | Buffer |
| Salida | TO_POS_COMMANDS.FAILED | Error |
| Entrada | TO_B64IMG | {    grayscale?: boolean } \| null |
| Salida | TO_B64IMG.COMPLETED | Buffer |
| Salida | TO_B64IMG.FAILED | Error |


## tipos de datos:

```typescript
interface RenderDocumentPayload {
    /** Titulo del documento HTML **/
    title: string

    /** ancho máximo del documento (en `px`) **/
    width: string

    /** Cuando se ejecute window.print() establece la escala de impresión (zoom-in o zoom-out) **/
    htmlPrintScale?: string | number,

    /** Tamaño base de los textos (las demás etiquetas de texto se ajustarán basados en este tamaño base) **/
    fontSize: string

    /** plantilla (compatible con `handlebars`) **/
    content_template: string

    /** Datos a utilizar junto con la plantilla para generar el documento **/
    data: Object
}
```

```typescript
interface RenderDocumentCompletedPayload {
    /** texto HTML de plantilla generada **/
    content: string
    
    /** texto HTML del documento completo generado (`document.documentElement.innerHTML`) **/
    html: string
    
    /** ancho total del documento en pixeles (`document.documentElement.offsetWidth`) **/
    width: number
    
    /** alto total del documento en pixeles (`document.documentElement.offsetHeight`) **/
    height: number
}
```

```typescript
interface Error {
    message : string,
    name : string,
    code : string | number
}
```

```typescript
interface POSCommandsPayload {
    /** Lenguaje de comandos **/
    pos_lang: "epson" | "tanca" | "star" | "daruma"

    /** Si se agrega o no el comando de cortar papel **/
    cut?: boolean

    /** Contiene 2 numeros, el primero es el número de sonidos, y el segundo la duración de cada sonido (en ms) **/
    beep?: [number, number]

    /** Si se debe agregar el comando de abrir cajón de monedas al inicio **/
    cash_drawer?: boolean;
}

```

## FIXME:
[] Para que el proyecto sea compatible con `es3` necesitas quitar el uso de object-spread (`var a = { ...b }` ) en la dependencia `node-thermal-printer`.
[] La dependencia `node-thermal-printer` no tiene mucha sensibilidad a los grises, practicamente los ignora al momento de traducir la imagen. Sin embargo otras librerías procesan correctamente las imagenes (vease: [Solución de ESCPOS-ThermalPrinter-Android en JAVA](https://github.com/DantSu/ESCPOS-ThermalPrinter-Android/blob/f61030e46269319e2d72b938501676420657b9c8/escposprinter/src/main/java/com/dantsu/escposprinter/EscPosPrinterCommands.java#L166))