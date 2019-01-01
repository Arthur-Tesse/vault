import encodeCode from './encodeCode.js';
import {hashHTMLSpans} from './hashHTMLSpans.js';

/**
 * @param text
 * @param globals
 * @returns {*}
 */
export default function codeSpans(text, globals) {

    if (typeof (text) === 'undefined') {
        text = '';
    }

    text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function (wholeMatch, m1, m2, m3) {
            m3 = m3.replace(/^([ \t]*)/g, '')
                .replace(/[ \t]*$/g, '');
            m3 = encodeCode(m3);
            m3 = m1 + '<code>' + m3 + '</code>';
            m3 = hashHTMLSpans(m3, globals);
            return m3;
        }
    );

    return text;
}
