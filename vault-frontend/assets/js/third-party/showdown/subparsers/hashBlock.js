/**
 * @param text
 * @param globals
 * @returns {string}
 */
export default function hashBlock(text, globals) {

    text = text.replace(/(^\n+|\n+$)/g, '');
    return '\n\n¨K' + (globals.htmlBlocks.push(text) - 1) + 'K\n\n';
}
