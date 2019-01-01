/**
 *
 * @param text
 * @returns {string}
 */
export default function outdent(text) {

    return text.replace(/^(\t|[ ]{1,4})/gm, '¨0')
        .replace(/¨0/g, '');
}
