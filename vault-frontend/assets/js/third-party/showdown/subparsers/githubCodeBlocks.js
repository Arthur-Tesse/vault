import encodeCode from './encodeCode.js';
import detab from './detab.js';
import hashBlock from './hashBlock.js';

/**
 *
 * @param text
 * @param options
 * @param globals
 * @returns {*}
 */
export default function githubCodeBlocks(text, options, globals) {


    if (!options.ghCodeBlocks) {
        return text;
    }

    text += '¨0';

    text = text.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, (wholeMatch, _, language, codeblock) => {
        const end = (options.omitExtraWLInCodeBlocks) ? '' : '\n';

        codeblock = encodeCode(codeblock);
        codeblock = detab(codeblock);
        codeblock = codeblock.replace(/^\n+/g, '')
            .replace(/\n+$/g, '');

        codeblock = '<pre><code' + (language ? ' class="' + language + ' language-' + language + '"' : '') + '>' + codeblock + end + '</code></pre>';

        codeblock = hashBlock(codeblock, globals);

        return '\n\n¨G' + (globals.ghCodeBlocks.push({
            text: wholeMatch,
            codeblock: codeblock
        }) - 1) + 'G\n\n';
    });

    return text.replace(/¨0/, '');
}
