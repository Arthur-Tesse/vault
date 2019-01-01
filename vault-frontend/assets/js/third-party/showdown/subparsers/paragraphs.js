import spanGamut from './spanGamut.js';
import encodeCode from './encodeCode.js';

export default function paragraphs(text, options, globals) {

    text = text.replace(/^\n+/g, '');
    text = text.replace(/\n+$/g, '');

    const grafs = text.split(/\n{2,}/g);
    const grafsOut = [];
    let end = grafs.length;

    for (let i = 0; i < end; i++) {
        let str = grafs[i];

        if (str.search(/¨([KG])(\d+)\1/g) >= 0) {
            grafsOut.push(str);

        } else if (str.search(/\S/) >= 0) {
            str = spanGamut(str, options, globals);
            str = str.replace(/^([ \t]*)/g, '<p>');
            str += '</p>';
            grafsOut.push(str);
        }
    }

    end = grafsOut.length;
    for (let i = 0; i < end; i++) {
        let blockText = '';
        let grafsOutIt = grafsOut[i];
        let codeFlag = false;
        while (/¨([KG])(\d+)\1/.test(grafsOutIt)) {
            const delim = RegExp.$1,
                num = RegExp.$2;

            if (delim === 'K') {
                blockText = globals.htmlBlocks[num];
            } else {

                if (codeFlag) {

                    blockText = encodeCode(globals.ghCodeBlocks[num].text);
                } else {
                    blockText = globals.ghCodeBlocks[num].codeblock;
                }
            }
            blockText = blockText.replace(/\$/g, '$$$$');

            grafsOutIt = grafsOutIt.replace(/(\n\n)?¨([KG])\d+\2(\n\n)?/, blockText);
            if (/^<pre\b[^>]*>\s*<code\b[^>]*>/.test(grafsOutIt)) {
                codeFlag = true;
            }
        }
        grafsOut[i] = grafsOutIt;
    }
    text = grafsOut.join('\n')
        .replace(/^\n+/g, '')
        .replace(/\n+$/g, '');

    return text;
}