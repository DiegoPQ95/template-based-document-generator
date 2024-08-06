export function formatDate(dateString: string | Date, formatString: string, lang = 'es') {
    let date = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(+date.valueOf())) {
        return "Fecha inválida";
    }

    // Mapear las palabras clave a las opciones de toLocaleString()
    let formatOptions = {

        'DDDD': { weekday: 'long' }
        , 'DDD': { weekday: 'short' }
        , 'DD': { day: '2-digit' }
        , 'D': { day: 'numeric' }

        , 'MMMM': { month: 'long' }
        , 'MMM': { month: 'short' }
        , 'MM': { month: '2-digit' }
        , 'M': { month: 'numeric' }

        , 'YYYY': { year: 'numeric' }
        , 'YYY': { year: 'numeric' }
        , 'YY': { year: '2-digit' }
        , 'Y': { year: 'numeric' }

        , 'hh': { hour: '2-digit', hour12: true }
        , 'h': { hour: 'numeric', hour12: true }

        , 'HH': { hour: '2-digit', hour12: false }
        , 'H': { hour: 'numeric', hour12: false }

        , 'mm': { minute: '2-digit' }
        , 'm': { minute: 'numeric' }

        , 'ss': { second: '2-digit', hour12: false }
        , 's': { second: 'numeric' }

        , "a": { hour: "numeric", hour12: true }
        , "A": { hour: "numeric", hour12: true }
    };

    // Construir el regex para encontrar las palabras clave
    let regex = new RegExp(Object.keys(formatOptions).join('|'), 'g');

    // Reemplazar las palabras clave en el formato usando toLocaleString()
    let formattedDate = formatString.replace(regex, match => {

        if (["A", "a"].includes(match))
            return addAM_PM(date, lang, match);

        let options: { [key: string]: any } = formatOptions[match as keyof typeof formatOptions];
        let value = options ? date.toLocaleString(lang, options) : match;

        if (match === "ss")
            return ("0" + value).slice(-2);

        if (options.hour12) {
            return value.replace(/\a|\p|\m|\.|\,|\s/gi, "");
        }
        return value;
    });

    return formattedDate;
}


function addAM_PM(date: Date, lang: string, match: string) {
    const hours = +date.toLocaleString(lang, { hour: "numeric", hour12: false });
    if (match === 'A') {
        return hours < 12 ? 'AM' : 'PM';
    }
    if (match === 'a') {
        return hours < 12 ? 'am' : 'pm';
    }
    return match;
}