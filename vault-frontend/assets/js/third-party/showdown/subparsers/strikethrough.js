/**
 *
 * @param text
 * @param options
 * @returns {*}
 */
export default function strikethrough(text, options) {

    if (options.strikethrough) {
        text = text.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function (wm, txt) {
            return '<del>' + txt + '</del>';
        });
    }

    return text;
}