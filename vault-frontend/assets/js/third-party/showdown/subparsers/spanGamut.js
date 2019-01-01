import codeSpans from './codeSpans.js';
import escapeSpecialCharsWithinTagAttributes from './escapeSpecialCharsWithinTagAttributes.js';
import encodeBackslashEscapes from './encodeBackslashEscapes.js';
import {hashHTMLSpans} from './hashHTMLSpans.js';
import encodeAmpsAndAngles from './encodeAmpsAndAngles.js';
import ellipsis from './ellipsis.js';
import underline from './underline.js';
import strikethrough from './strikethrough.js';
import emoji from './emoji.js';
import images from './images.js';
import links from './links.js';
import italicsAndBold from './italicsAndBold.js';

/**
 * @param text
 * @param options
 * @param globals
 */
export default function spanGamut(text, options, globals) {

    text = codeSpans(text, globals);
    text = escapeSpecialCharsWithinTagAttributes(text);
    text = encodeBackslashEscapes(text);
    text = images(text, globals);
    text = links(text, options, globals);
    text = emoji(text, options);
    text = underline(text, options);
    text = italicsAndBold(text, options);
    text = strikethrough(text, options);
    text = ellipsis(text);
    text = hashHTMLSpans(text, globals);
    text = encodeAmpsAndAngles(text);

    if (options.simpleLineBreaks) {
        if (!/\n\n¨K/.test(text)) {
            text = text.replace(/\n+/g, '<br />\n');
        }
    } else {
        text = text.replace(/  +\n/g, '<br />\n');
    }

    return text;
}
