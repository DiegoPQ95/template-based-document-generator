/* @ts-ignore */
import epson from "./epson";
/* @ts-ignore */
import star from "./star";
/* @ts-ignore */
import tanca from "./tanca";
/* @ts-ignore */
import brother from "./brother";

export enum PrinterTypes {
    EPSON = "epson",
    TANCA = "tanca",
    STAR = "star",
    BROTHER = "brother"
}


export default function CommandLib(type: PrinterTypes): PrinterType {
    if (type === "epson") return new epson();
    if (type === "tanca") return new tanca();
    if (type === "brother") return new brother();
    if (type === "star") return new star();
    throw new RangeError(`el tipo ${type} no existe`);
}

export function InitializeCommand(command_lib: PrinterType) {
    return command_lib.config.HW_INIT;
}


export function CutCommand({ verticalTabAmount = 2 } = {}, command_lib: PrinterType) {
    const instruction_set = [] as Buffer[];
    for (let i = 0; i < verticalTabAmount; i++) {
        instruction_set.push(command_lib.config.CTL_VT);
    }
    instruction_set.push(command_lib.config.PAPER_FULL_CUT);
    instruction_set.push(command_lib.config.HW_INIT);
    return Buffer.concat(instruction_set);
}

export function OpenDrawerCommand(command_lib: PrinterType) {
    const command_set = [] as Buffer[];
    if ((command_lib.config.type as any) === PrinterTypes.STAR) {
        command_set.push(command_lib.config.CD_KICK);
    } else {
        command_set.push(command_lib.config.CD_KICK_2);
        command_set.push(command_lib.config.CD_KICK_5);
    }
    return Buffer.concat(command_set);
}