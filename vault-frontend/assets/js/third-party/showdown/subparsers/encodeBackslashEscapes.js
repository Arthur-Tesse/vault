import {escapeCharactersCallback} from '../helpers.js';

/**
 *
 * @param text
 * @returns {*}
 */
export default function encodeBackslashEscapes(text) {

    return text.replace(/\\(\\)/g, escapeCharactersCallback)
        .replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, escapeCharactersCallback);
}
