import hashHTMLBlocks from './hashHTMLBlocks.js';
import blockQuotes from './blockQuotes.js';
import headers from './headers.js';
import horizontalRule from './horizontalRule.js';
import paragraphs from './paragraphs.js';
import codeBlocks from './codeBlocks.js';
import lists from './lists.js';
import tables from './tables.js';

/**
 *
 * @param text
 * @param options
 * @param globals
 * @returns {*}
 */
export default function blockGamut(text, options, globals) {

    text = blockQuotes(text, options, globals);
    text = headers(text, options, globals);
    text = horizontalRule(text, globals);
    text = lists(text, options, globals);
    text = codeBlocks(text, options, globals);
    text = tables(text, options, globals);
    text = hashHTMLBlocks(text, options, globals);
    text = paragraphs(text, options, globals);

    return text;
}