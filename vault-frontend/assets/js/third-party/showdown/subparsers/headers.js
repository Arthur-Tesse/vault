import hashBlock from './hashBlock.js';
import spanGamut from './spanGamut.js';
import {isString} from '../helpers.js';

/**
 *
 * @param text
 * @param options
 * @param globals
 */
export default function headers(text, options, globals) {

    const headerLevelStart = (isNaN(parseInt(options.headerLevelStart))) ? 1 : parseInt(options.headerLevelStart);
    const setextRegexH1 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm;
    const setextRegexH2 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

    text = text.replace(setextRegexH1, function (wholeMatch, m1) {

        const spanGamut = spanGamut(m1, options, globals),
            hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
            hLevel = headerLevelStart,
            hashBlockStr = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
        return hashBlock(hashBlockStr, globals);
    });

    text = text.replace(setextRegexH2, function (matchFound, m1) {
        const spanGamut = spanGamut(m1, options, globals),
            hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
            hLevel = headerLevelStart + 1,
            hashBlockStr = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
        return hashBlock(hashBlockStr, globals);
    });

    const atxStyle = (options.requireSpaceBeforeHeadingText) ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;

    text = text.replace(atxStyle, function (wholeMatch, m1, m2) {
        let hText = m2;
        if (options.customizedHeaderId) {
            hText = m2.replace(/\s?{([^{]+?)}\s*$/, '');
        }

        const span = spanGamut(hText, options, globals),
            hID = (options.noHeaderId) ? '' : ' id="' + headerId(m2) + '"',
            hLevel = headerLevelStart - 1 + m1.length,
            header = '<h' + hLevel + hID + '>' + span + '</h' + hLevel + '>';

        return hashBlock(header, globals);
    });

    function headerId(m) {
        let title;
        let prefix;

        if (options.customizedHeaderId) {
            const match = m.match(/{([^{]+?)}\s*$/);
            if (match && match[1]) {
                m = match[1];
            }
        }

        title = m;

        if (isString(options.prefixHeaderId)) {
            prefix = options.prefixHeaderId;
        } else if (options.prefixHeaderId === true) {
            prefix = 'section-';
        } else {
            prefix = '';
        }

        if (!options.rawPrefixHeaderId) {
            title = prefix + title;
        }

        if (options.ghCompatibleHeaderId) {
            title = title
                .replace(/ /g, '-')
                .replace(/&amp;/g, '')
                .replace(/¨T/g, '')
                .replace(/¨D/g, '')
                .replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, '')
                .toLowerCase();
        } else if (options.rawHeaderId) {
            title = title
                .replace(/ /g, '-')
                // replace previously escaped chars (&, ¨ and $)
                .replace(/&amp;/g, '&')
                .replace(/¨T/g, '¨')
                .replace(/¨D/g, '$')
                .replace(/["']/g, '-')
                .toLowerCase();
        } else {
            title = title
                .replace(/[^\w]/g, '')
                .toLowerCase();
        }

        if (options.rawPrefixHeaderId) {
            title = prefix + title;
        }

        if (globals.hashLinkCounts[title]) {
            title = title + '-' + (globals.hashLinkCounts[title]++);
        } else {
            globals.hashLinkCounts[title] = 1;
        }
        return title;
    }

    return text;
}
