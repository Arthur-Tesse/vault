import encodeAmpsAndAngles from './encodeAmpsAndAngles.js';

export default function stripLinkDefinitions(text, options, globals) {

    const regex = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm;
    const base64Regex = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;

    text += '¨0';

    const replaceFunc = function (wholeMatch, linkId, url, width, height, blankLines, title) {
        linkId = linkId.toLowerCase();
        if (url.match(/^data:.+?\/.+?;base64,/)) {
            // remove newlines
            globals.urls[linkId] = url.replace(/\s/g, '');
        } else {
            globals.urls[linkId] = encodeAmpsAndAngles(url);
        }

        if (blankLines) {
            return blankLines + title;

        } else {
            if (title) {
                globals.titles[linkId] = title.replace(/["']/g, '&quot;');
            }
            if (options.parseImgDimensions && width && height) {
                globals.dimensions[linkId] = {
                    width: width,
                    height: height
                };
            }
        }
        return '';
    };

    text = text.replace(base64Regex, replaceFunc);
    text = text.replace(regex, replaceFunc);
    text = text.replace(/¨0/, '');

    return text;
}