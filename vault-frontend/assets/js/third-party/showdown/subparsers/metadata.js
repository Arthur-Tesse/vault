/**
 *
 * @param text
 * @param options
 * @param globals
 */
export default function metadata(text, options, globals) {

    if (!options.metadata) {

        return text;
    }

    return text.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, (_, __, content) => {

        parseMetadataContents(content, globals);

        return '¨M';
    }).replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, (wholematch, format, content) => {

        if (format) {

            globals.metadata.format = format;
        }

        parseMetadataContents(content, globals);

        return '¨M';
    }).replace(/¨M/g, '');
}

function parseMetadataContents(content, globals) {

    globals.metadata.raw = content;

    content = content
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/\n {4}/g, ' ');
    content.replace(/^([\S ]+): +([\s\S]+?)$/gm, function (wm, key, value) {
        globals.metadata.parsed[key] = value;
        return '';
    });
}