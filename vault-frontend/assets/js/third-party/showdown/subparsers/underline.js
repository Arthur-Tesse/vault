import {escapeCharactersCallback} from '../helpers.js';

/**
 *
 * @param text
 * @param options
 */
export default function underline(text, options) {
    'use strict';

    if (!options.underline) {
        return text;
    }

    if (options.literalMidWordUnderscores) {
        text = text.replace(/\b\+\+(\S[\s\S]*?)\+\+\b/g, (wm, txt) => {
            return '<u>' + txt + '</u>';
        });
    } else {
        text = text.replace(/\+\+(\S[\s\S]*?)\+\+/g, (wm, m) => {
            return (/\S$/.test(m)) ? '<u>' + m + '</u>' : wm;
        });
    }
    return text.replace(/(\+)/g, escapeCharactersCallback);
}
