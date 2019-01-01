import {replaceRecursiveRegExp} from '../helpers.js';
import encodeCode from './encodeCode.js';

/**
 *
 * @param text
 * @param globals
 */
export default function hashPreCodeTags(text, globals) {

    const repFunc = (wholeMatch, match, left, right) => {

        return '\n\n¨G'
            + (globals.ghCodeBlocks.push({text: wholeMatch, codeblock: left + encodeCode(match) + right}) - 1)
            + 'G\n\n';
    };

    return replaceRecursiveRegExp(text, repFunc, '^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>', '^ {0,3}</code>\\s*</pre>', 'gim');
}
