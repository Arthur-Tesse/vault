/**
 *
 * @param text
 * @param options
 * @param globals
 * @returns {*}
 */
export default function completeHTMLDocument(text, options, globals) {

    if (!options.completeHTMLDocument) {
        return text;
    }

    let doctype = 'html';
    let doctypeParsed = '<!DOCTYPE HTML>\n';
    let title = '';
    let charset = '<meta charset="utf-8">\n';
    let lang = '';
    let metadata = '';

    if (typeof globals.metadata.parsed.doctype !== 'undefined') {
        doctypeParsed = '<!DOCTYPE ' + globals.metadata.parsed.doctype + '>\n';
        doctype = globals.metadata.parsed.doctype.toString().toLowerCase();
        if (doctype === 'html' || doctype === 'html5') {
            charset = '<meta charset="utf-8">';
        }
    }

    for (let meta in globals.metadata.parsed) {
        if (globals.metadata.parsed.hasOwnProperty(meta)) {
            switch (meta.toLowerCase()) {
                case 'doctype':
                    break;

                case 'title':
                    title = '<title>' + globals.metadata.parsed.title + '</title>\n';
                    break;

                case 'charset':
                    if (doctype === 'html' || doctype === 'html5') {
                        charset = '<meta charset="' + globals.metadata.parsed.charset + '">\n';
                    } else {
                        charset = '<meta name="charset" content="' + globals.metadata.parsed.charset + '">\n';
                    }
                    break;

                case 'language':
                case 'lang':
                    lang = ' lang="' + globals.metadata.parsed[meta] + '"';
                    metadata += '<meta name="' + meta + '" content="' + globals.metadata.parsed[meta] + '">\n';
                    break;

                default:
                    metadata += '<meta name="' + meta + '" content="' + globals.metadata.parsed[meta] + '">\n';
            }
        }
    }

    return `${doctypeParsed}<html${lang}>
<head>
${title}${charset}${metadata}</head>
<body>
${text.trim()}
</body>
</html>`;
}