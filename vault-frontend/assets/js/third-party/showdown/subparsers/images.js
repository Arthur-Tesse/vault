import {escapeCharactersCallback, isUndefined, regexes} from '../helpers.js';

/**
 *
 * @param text
 * @param globals
 * @returns {string}
 */
export default function images(text, globals) {

    const inlineRegExp = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g;
    const crazyRegExp = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g;
    const base64RegExp = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g;
    const referenceRegExp = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g;
    const refShortcutRegExp = /!\[([^\[\]]+)]()()()()()/g;

    function writeImageTagBase64(wholeMatch, altText, linkId, url, width, height, m5, title) {
        url = url.replace(/\s/g, '');
        return writeImageTag(wholeMatch, altText, linkId, url, width, height, m5, title);
    }

    function writeImageTag(wholeMatch, altText, linkId, url, width, height, m5, title) {

        linkId = linkId.toLowerCase();

        if (!title) {
            title = '';
        }
        // Special case for explicit empty url
        if (wholeMatch.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1) {
            url = '';

        } else if (url === '' || url === null) {
            if (linkId === '' || linkId === null) {
                // lower-case and turn embedded newlines into spaces
                linkId = altText.toLowerCase().replace(/ ?\n/g, ' ');
            }
            url = '#' + linkId;

            if (!isUndefined(globals.urls[linkId])) {
                url = globals.urls[linkId];
                if (!isUndefined(globals.titles[linkId])) {
                    title = globals.titles[linkId];
                }
                if (!isUndefined(globals.dimensions[linkId])) {
                    width = globals.dimensions[linkId].width;
                    height = globals.dimensions[linkId].height;
                }
            } else {
                return wholeMatch;
            }
        }

        altText = altText
            .replace(/"/g, '&quot;')
            .replace(regexes.asteriskDashTildeAndColon, escapeCharactersCallback);
        url = url.replace(regexes.asteriskDashTildeAndColon, escapeCharactersCallback);
        let result = '<img src="' + url + '" alt="' + altText + '"';

        if (title && isString(title)) {
            title = title
                .replace(/"/g, '&quot;')
                .replace(regexes.asteriskDashTildeAndColon, escapeCharactersCallback);
            result += ' title="' + title + '"';
        }

        if (width && height) {
            width = (width === '*') ? 'auto' : width;
            height = (height === '*') ? 'auto' : height;

            result += ' width="' + width + '"';
            result += ' height="' + height + '"';
        }

        result += ' />';

        return result;
    }

    return text.replace(referenceRegExp, writeImageTag)
        .replace(base64RegExp, writeImageTagBase64)
        .replace(crazyRegExp, writeImageTag)
        .replace(inlineRegExp, writeImageTag)
        .replace(refShortcutRegExp, writeImageTag);
}
