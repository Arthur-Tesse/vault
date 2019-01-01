import {regexIndexOf, replaceRecursiveRegExp, splitAtIndex} from '../helpers.js';
import hashElement from './hashElement.js';

/**
 *
 * @param text
 * @param options
 * @param globals
 */
export default function hashHTMLBlocks(text, options, globals) {

    const blockTags = [
        'pre',
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'table',
        'dl',
        'ol',
        'ul',
        'script',
        'noscript',
        'form',
        'fieldset',
        'iframe',
        'math',
        'style',
        'section',
        'header',
        'footer',
        'nav',
        'article',
        'aside',
        'address',
        'audio',
        'canvas',
        'figure',
        'hgroup',
        'output',
        'video',
        'p'
    ];
    const repFunc = function (wholeMatch) {

        return '\n\n¨K' + (globals.htmlBlocks.push(wholeMatch) - 1) + 'K\n\n';
    };

    if (options.backslashEscapesHTMLTags) {

        text = text.replace(/\\<(\/?[^>]+?)>/g, function (wm, inside) {
            return '&lt;' + inside + '&gt;';
        });
    }

    for (let i = 0; i < blockTags.length; ++i) {

        let opTagPos;
        const rgx1 = new RegExp('^ {0,3}(<' + blockTags[i] + '\\b[^>]*>)', 'im');
        const patLeft = '<' + blockTags[i] + '\\b[^>]*>';
        const patRight = '</' + blockTags[i] + '>';

        while ((opTagPos = regexIndexOf(text, rgx1)) !== -1) {

            const subTexts = splitAtIndex(text, opTagPos);
            const newSubText1 = replaceRecursiveRegExp(subTexts[1], repFunc, patLeft, patRight, 'im');

            if (newSubText1 === subTexts[1]) {
                break;
            }

            text = subTexts[0].concat(newSubText1);
        }
    }
    // HR SPECIAL CASE
    text = text.replace(/(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        hashElement(globals));

    // Special case for standalone HTML comments
    text = replaceRecursiveRegExp(text, function (txt) {
        return '\n\n¨K' + (globals.htmlBlocks.push(txt) - 1) + 'K\n\n';
    }, '^ {0,3}<!--', '-->', 'gm');

    // PHP and ASP-style processor instructions (<?...?> and <%...%>)
    text = text.replace(/(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        hashElement(globals));
    return text;
}
