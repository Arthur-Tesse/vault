import {escapeCharactersCallback} from '../helpers.js';

/**
 *
 * @param text
 * @returns {string}
 */
export default function encodeCode(text) {

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/([*_{}\[\]\\=~-])/g, escapeCharactersCallback);
}