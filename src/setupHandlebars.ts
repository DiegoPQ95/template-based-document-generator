export function setupHandlebars(handlebars: typeof import("handlebars")) {
    // Definir el helper groupBy
    handlebars.registerHelper('groupBy', function <T extends { [key: string]: any }>(array: Array<T>, key: string, options: Handlebars.HelperOptions) {
        const groups = array.reduce((result, item) => {
            const groupKey = item[key];
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        }, {} as { [key: string]: Array<T> });

        let output = '';
        for (const groupKey in groups) {
            output += options.fn({ key: groupKey, items: groups[groupKey] });
        }
        return output;
    });
}