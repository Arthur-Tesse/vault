/**
 *
 * @param text
 * @returns {*}
 */
export default function unescapeSpecialChars(text) {

    text = text.replace(/¨E(\d+)E/g, function (wholeMatch, m1) {
        const charCodeToReplace = parseInt(m1);
        return String.fromCharCode(charCodeToReplace);
    });
    return text;
}
