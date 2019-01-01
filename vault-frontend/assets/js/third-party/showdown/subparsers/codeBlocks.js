import hashBlock from './hashBlock.js';
import detab from './detab.js';
import encodeCode from './encodeCode.js';
import outdent from './outdent.js';

/**
 *
 * @param text
 * @param options
 * @param globals
 * @returns {*}
 */
export default function codeBlocks(text, options, globals) {

    text += '¨0';

    const pattern = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
    return text.replace(pattern, function (wholeMatch, m1, m2) {
        let end = '\n';

        m1 = outdent(m1);
        m1 = encodeCode(m1);
        m1 = detab(m1);
        m1 = m1.replace(/^\n+/g, '');
        m1 = m1.replace(/\n+$/g, '');

        if (options.omitExtraWLInCodeBlocks) {
            end = '';
        }

        m1 = '<pre><code>' + m1 + end + '</code></pre>';

        return hashBlock(m1, globals) + m2;
    }).replace(/¨0/, '');
}
