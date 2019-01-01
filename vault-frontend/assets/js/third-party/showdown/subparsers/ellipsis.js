/**
 *
 * @param text
 * @returns {*}
 */
export default function ellipsis(text) {

    return text.replace(/\.\.\./g, '…');
}
