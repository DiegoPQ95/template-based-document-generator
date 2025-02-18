import { EpsonCommandEncoder } from "./EpsonCommandEncoder";

export enum Types {
    EPSON = 'epson',
    TANCA = 'tanca',
    STAR = 'star',
    DARUMA = 'daruma',
    BROTHER = 'brother',
}

export default function CreateCommandEncoder(type: Types) {
    if (type === "epson") return new EpsonCommandEncoder();
    throw new RangeError("No hay una integracion para el tipo: " + type);
}