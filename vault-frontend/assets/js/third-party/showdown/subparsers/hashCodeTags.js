import {replaceRecursiveRegExp} from '../helpers.js';
import encodeCode from './encodeCode.js';

/**
 *
 * @param text
 * @param options
 * @param globals
 */
export default function hashCodeTags(text, options, globals) {

    const repFunc = function (wholeMatch, match, left, right) {
        const codeblock = left + encodeCode(match) + right;
        return '¨C' + (globals.htmlSpans.push(codeblock) - 1) + 'C';
    };

    return replaceRecursiveRegExp(text, repFunc, '<code\\b[^>]*>', '</code>', 'gim');
}
