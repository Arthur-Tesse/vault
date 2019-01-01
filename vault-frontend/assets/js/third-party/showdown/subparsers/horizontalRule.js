import hashBlock from './hashBlock.js';

/**
 *
 * @param text
 * @param globals
 * @returns {*}
 */
export default function horizontalRule(text, globals) {

    const key = hashBlock('<hr />', globals);
    text = text.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, key);
    text = text.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, key);
    text = text.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, key);

    return text;
}
