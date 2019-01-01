/**
 * @param text
 * @returns {string}
 */
export default function encodeAmpsAndAngles(text) {

    return text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;')
        .replace(/<(?![a-z\/?$!])/gi, '&lt;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

}
