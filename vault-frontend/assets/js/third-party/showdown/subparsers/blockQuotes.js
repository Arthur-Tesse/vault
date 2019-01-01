import githubCodeBlocks from './githubCodeBlocks.js';
import blockGamut from './blockGamut.js';
import hashBlock from './hashBlock.js';

/**
 *
 * @param text
 * @param options
 * @param globals
 * @returns {string}
 */
export default function blockQuotes(text, options, globals) {

    text += '\n\n';

    const rgx = options.splitAdjacentBlockquotes ? /^ {0,3}>[\s\S]*?(?:\n\n)/gm : /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;

    return text.replace(rgx, function (bq) {

        bq = bq.replace(/^[ \t]*>[ \t]?/gm, '')
            .replace(/¨0/g, '')
            .replace(/^[ \t]+$/gm, '');
        bq = githubCodeBlocks(bq, options, globals);
        bq = blockGamut(bq, options, globals);
        bq = bq.replace(/(^|\n)/g, '$1  ')
            .replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function (wholeMatch, m1) {
                let pre = m1;
                pre = pre.replace(/^  /mg, '¨0');
                pre = pre.replace(/¨0/g, '');
                return pre;
            });

        return hashBlock('<blockquote>\n' + bq + '\n</blockquote>', globals);
    });
}
