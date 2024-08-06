type HelperOptions = import("handlebars").HelperOptions;
import { formatDate } from "./Utils/format-date";

export function setupHandlebars(handlebars: typeof import("handlebars")) {
    // Definir el helper groupBy
    handlebars.registerHelper('group', function (array: Array<{ [key: string]: any }>, options: HelperOptions) {
        const key = options.hash.by;

        if (!key) return "";
        if (!array) return "";
        if (!array.length) return "";


        const displayNameKey = options.hash.displayNameKey || key;

        const groups = array.reduce((result, item) => {
            const groupKey = item[key];
            if (!result[groupKey]) {
                result[groupKey] = { items: [], displayName: item[displayNameKey] };
            }
            result[groupKey].items.push(item);
            return result;
        }, {});

        const groupKeys = Object.keys(groups);
        if (options.hash.orientation) {
            const orientation = options.hash.orientation;
            groupKeys.sort((a, b) => {
                if (orientation === "asc") {
                    if (a[key] > b[key]) return 1;
                    if (a[key] < b[key]) return -1;
                }
                if (orientation === "desc") {
                    if (a[key] < b[key]) return 1;
                    if (a[key] > b[key]) return -1;
                }
                return 0;
            });
        }

        let output = '';
        groupKeys.forEach(groupKey => {
            output += options.fn({ key: NullToStr(groupKey), items: groups[groupKey].items, displayName: NullToStr(groups[groupKey].displayName) });
        })
        return output;
    });

    handlebars.registerHelper('order', function (array: Array<{ [key: string]: any }>, options: HelperOptions) {
        if (!array) return [];
        if (!array.length) return [];

        const key = options.hash.key;
        if (![undefined, null].includes(key)) return [];

        const orientation = (options.hash.orientation && options.hash.orientation.toLowerCase().trim()) || "asc";
        if (!["asc", "desc"].includes(orientation)) return [];
        return [...array].sort((a, b) => {
            if (orientation === "asc") {
                if (a[key] > b[key]) return 1;
                if (a[key] < b[key]) return -1;
            }
            if (orientation === "desc") {
                if (a[key] > b[key]) return -1;
                if (a[key] < b[key]) return 1;
            }
            return 0;
        });
    });

    handlebars.registerHelper('currency', function (value, options) {

        let currency = options.hash.currency || "USD";

        if ([null, undefined].includes(value)) return "";
        if (value === "") return "";
        if (isNaN(+value)) return "";
        const formattedNumber = value.toLocaleString('en-US', { style: 'currency', currency: currency });
        return new handlebars.SafeString(formattedNumber);
    });

    handlebars.registerHelper('decimal', function (value, options) {

        let places = +(options.hash.places || "0");

        if ([null, undefined].includes(value)) return "";
        if (value === "") return "";
        if (isNaN(+value)) return "";
        const formattedNumber = value.toFixed(+places);
        return new handlebars.SafeString(formattedNumber);
    });

    handlebars.registerHelper('date', function (value, options) {
        return formatDate(value, options.hash.format, options.hash.lang);
    });


    handlebars.registerHelper('is', function (property, value, options) {
        let are_the_same = false;
        if ([null, undefined].includes(property) && [null, undefined].includes(value))
            are_the_same = true;

        if (!are_the_same && property === value)
            are_the_same = true;
        if (are_the_same)
            return options.fn(options.data.root);
        else
            return "";
    });

    handlebars.registerHelper('isNot', function (property, value, options) {
        let are_the_same = false;
        if ([null, undefined].includes(property) && [null, undefined].includes(value))
            are_the_same = true;

        if (!are_the_same && property === value)
            are_the_same = true;

        if (are_the_same)
            return "";
        else
            return options.fn(options.data.root);
    });

    handlebars.registerHelper('sum', function (array: Array<{ [key: string]: any }>, key, options) {
        if (!(array && array.length)) return 0;
        if (!key) return 0;
        return array.reduce((a, b) => {
            return a + (b[key] || 0);
        }, 0);
    });

    handlebars.registerHelper('table', function (this: { [key: string]: any }, array: Array<any> | HelperOptions) {
        const options: HelperOptions = Array.from(arguments).pop();
        let output = "";

        array = options === array ? [null] : array;

        let header_output = "";
        const headers: string[] = (options.hash.headers || "").split("|");
        if (headers.length)
            header_output = `<thead><tr>${headers.map(h => `<td>${h}</td>`).join("")}</tr></thead>`;

        for (const item of array as Array<any>) {
            if (item === null) {
                output += options.fn(this);
            } else {
                output += `<tr>${options.fn(item)}</tr>`;
            }
        }
        return `<table class='${options.hash.className}' >${header_output}<tbody>${output}</tbody></table>`;
    });

    handlebars.registerHelper('row', function (this: { [key: string]: any }) {
        const column_values = Array.from(arguments);
        const options = column_values.pop();

        let output = "";
        for (const col_value of column_values) {
            output += `<td ${options.hash.className ? `class='${options.hash.className}'` : ''}>` + col_value + "</td>";
        }
        if (options.fn) output += `<td>${options.fn(this)}</td>`;
        return `<tr>${output}</tr>`;
    });

    handlebars.registerHelper('column', function (this: { [key: string]: any }, value: any) {
        const options: HelperOptions = Array.from(arguments).pop();
        value = value === options ? "" : value;

        var className = options.hash.className || "";
        if (className) className = `class='${className}'`;

        var colspan = options.hash.colspan || "";
        if (colspan) colspan = `colspan='${colspan}'`;

        return `<td ${colspan} ${className}>${value || (options.fn && options.fn(this)) || ""}</td>`;
    });

    handlebars.registerHelper('UNSECURE_displayAllContext', function (this: { [key: string]: any }) {
        const options = Array.from(arguments).pop();
        return JSON.stringify(this || {}, null, 3);
    });
}

function NullToStr(value: string | number | null | undefined) {
    if ([null, undefined].includes(value as null | undefined)) return "";
    return value;
}