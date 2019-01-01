export const hashHTMLSpan = (globals) => ((wholeMatch) => '¨C' + (globals.htmlSpans.push(wholeMatch) - 1) + 'C');

/**
 *
 * @param text
 * @param globals
 * @returns {*}
 */
export function hashHTMLSpans(text, globals) {

    return text.replace(/<[^>]+?\/>/gi, hashHTMLSpan(globals))
        .replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, hashHTMLSpan(globals))
        .replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, hashHTMLSpan(globals))
        .replace(/<[^>]+?>/gi, hashHTMLSpan(globals));
}

/**
 *
 * @param text
 * @param globals
 * @returns {*}
 */
export function unhashHTMLSpans(text, globals) {

    for (let i = 0; i < globals.htmlSpans.length; ++i) {
        let repText = globals.htmlSpans[i];
        let limit = 0;

        while (/¨C(\d+)C/.test(repText)) {
            const num = RegExp.$1;
            repText = repText.replace('¨C' + num + 'C', globals.gHtmlSpans[num]);
            if (limit === 10) {
                console.error('maximum nesting of 10 spans reached!!!');
                break;
            }
            ++limit;
        }
        text = text.replace('¨C' + i + 'C', repText);
    }

    return text;
}