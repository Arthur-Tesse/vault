import {hashHTMLSpan, hashHTMLSpans} from './hashHTMLSpans.js';
import codeSpans from './codeSpans.js';
import emoji from './emoji.js';
import underline from './underline.js';
import strikethrough from './strikethrough.js';
import ellipsis from './ellipsis.js';
import {encodeEmailAddress, escapeCharactersCallback, isUndefined, regexes} from '../helpers.js';
import unescapeSpecialChars from './unescapeSpecialChars.js';
import italicsAndBold from './italicsAndBold.js';

/**
 *
 * @param options
 * @param globals
 * @param emptyCase
 * @returns {Function}
 */
function replaceAnchorTag(options, globals, emptyCase = false) {
    emptyCase = !!emptyCase;
    return function (wholeMatch, text, id, url, m5, m6, title) {

        if (/\n\n/.test(wholeMatch)) {
            return wholeMatch;
        }
        return writeAnchorTag({
            wholeMatch: wholeMatch,
            text: text,
            id: id,
            url: url,
            title: title
        }, options, globals, emptyCase);
    };
}

function writeAnchorTag({wholeMatch, id, text, url, title}, options, globals, emptyCase) {

    let target = '';

    if (!title) {
        title = '';
    }
    id = (id) ? id.toLowerCase() : '';

    if (emptyCase) {
        url = '';
    } else if (!url) {
        if (!id) {
            id = text.toLowerCase().replace(/ ?\n/g, ' ');
        }
        url = '#' + id;

        if (!isUndefined(globals.urls[id])) {
            url = globals.urls[id];
            if (!isUndefined(globals.titles[id])) {
                title = globals.titles[id];
            }
        } else {
            return wholeMatch;
        }
    }
    url = url.replace(regexes.asteriskDashTildeAndColon, escapeCharactersCallback);

    if (title !== '' && title !== null) {
        title = title.replace(/"/g, '&quot;');
        title = title.replace(regexes.asteriskDashTildeAndColon, escapeCharactersCallback);
        title = ' title="' + title + '"';
    }

    if (options.openLinksInNewWindow && !/^#/.test(url)) {
        target = ' target="¨E95Eblank"';
    }

    // Text can be a markdown element, so we run through the appropriate parsers
    text = codeSpans(text, globals);
    text = emoji(text, options);
    text = underline(text, options, globals);
    text = italicsAndBold(text, options);
    text = strikethrough(text, options);
    text = ellipsis(text);
    text = hashHTMLSpans(text, globals);

    let result = '<a href="' + url + '"' + title + target + '>' + text + '</a>';

    result = hashHTMLSpans(result, globals);

    return result;
}

export default function links(text, options, globals) {

    text = linksReference(text, options, globals);
    text = linksInline(text, options, globals);
    text = linksReference(text, options, globals);
    text = linksReferenceShortcut(text, options, globals);
    text = angleBrackets(text, options, globals);
    text = ghMentions(text, options, globals);
    text = text.replace(/<a\s[^>]*>[\s\S]*<\/a>/g, function (wholeMatch) {
        return hashHTMLSpan(wholeMatch, globals);
    });

    text = text.replace(/<img\s[^>]*\/?>/g, function (wholeMatch) {
        return hashHTMLSpan(wholeMatch, globals);
    });
    text = linksNaked(text, options, globals);

    return text;
}

function linksInline(text, options, globals) {


    const rgxEmpty = /\[(.*?)]()()()()\(<? ?>? ?(?:["'](.*)["'])?\)/g;
    text = text.replace(rgxEmpty, replaceAnchorTag(options, globals, true));
    const rgxCrazy = /\[((?:\[[^\]]*]|[^\[\]])*)]()\s?\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g;
    text = text.replace(rgxCrazy, replaceAnchorTag(options, globals));
    const rgx2 = /\[([\S ]*?)]\s?()\( *<?([^\s'"]*?(?:\([\S]*?\)[\S]*?)?)>?\s*(?:()(['"])(.*?)\5)? *\)/g;
    text = text.replace(rgx2, replaceAnchorTag(options, globals));
    const rgx3 = /\[([\S ]*?)]\s?()\( *<?([^\s'"]*?(?:\([\S]*?\)[\S]*?)?)>?\s+()()\((.*?)\) *\)/g;
    text = text.replace(rgx3, replaceAnchorTag(options, globals));

    return text;
}

function linksReference(text, options, globals) {

    const rgx = /\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g;
    text = text.replace(rgx, replaceAnchorTag(options, globals));

    return text;
}

function linksReferenceShortcut(text, options, globals) {

    const rgx = /\[([^\[\]]+)]()()()()()/g;
    text = text.replace(rgx, replaceAnchorTag(options, globals));

    return text;
}

function ghMentions(text, options, globals) {

    if (!options.ghMentions) {
        return text;
    }

    const rgx = /(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d._-]+?[a-z\d]+)*))/gi;

    text = text.replace(rgx, function (wholeMatch, st, escape, mentions, username) {
        if (escape === '\\') {
            return st + mentions;
        }

        const url = options.ghMentionsLink.replace(/{u}/g, username);
        return st + writeAnchorTag({
            wholeMatch: wholeMatch,
            text: mentions,
            id: null,
            url: url,
            title: null
        }, options, globals);
    });

    return text;
}

function angleBrackets(text, options, globals) {

    const urlRgx = /<(((?:https?|ftp):\/\/|www\.)[^'">\s]+)>/gi;
    text = text.replace(urlRgx, function (wholeMatch, url, urlStart) {
        const text = url;
        url = (urlStart === 'www.') ? 'http://' + url : url;
        return writeAnchorTag({wholeMatch: wholeMatch, text: text, id: null, url: url, title: null}, options, globals);
    });

    const mailRgx = /<(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi;
    text = text.replace(mailRgx, function (wholeMatch, mail) {
        let url = 'mailto:';
        mail = unescapeSpecialChars(mail);
        if (options.encodeEmails) {
            url = encodeEmailAddress(url + mail);
            mail = encodeEmailAddress(mail);
        } else {
            url = url + mail;
        }
        return writeAnchorTag({wholeMatch: wholeMatch, text: mail, id: null, url: url, title: null}, options, globals);
    });

    return text;
}

function linksNaked(text, options, globals) {

    if (!options.simplifiedAutoLink) {
        return text;
    }

    const urlRgx = /([_*~]*?)(((?:https?|ftp):\/\/|www\.)[^\s<>"'`´.-][^\s<>"'`´]*?\.[a-z\d.]+[^\s<>"']*)\1/gi;
    text = text.replace(urlRgx, function (wholeMatch, leadingMDChars, url, urlPrefix) {

        const len = url.length;
        let suffix = '';
        for (let i = len - 1; i >= 0; --i) {
            const char = url.charAt(i);

            if (/[_*~,;:.!?]/.test(char)) {
                url = url.slice(0, -1);
                suffix = char + suffix;
            } else if (/\)/.test(char)) {
                const opPar = url.match(/\(/g) || [];
                const clPar = url.match(/\)/g);

                if (opPar.length < clPar.length) {
                    url = url.slice(0, -1);
                    suffix = char + suffix;
                } else {

                    break;
                }
            } else if (/]/.test(char)) {
                const opPar2 = url.match(/\[/g) || [];
                const clPar2 = url.match(/]/g);

                if (opPar2.length < clPar2.length) {

                    url = url.slice(0, -1);
                    suffix = char + suffix;
                } else {

                    break;
                }
            } else {
                break;
            }
        }

        let text = url;
        url = (urlPrefix === 'www.') ? 'http://' + url : url;
        text = text.replace(regexes.asteriskDashTildeAndColon, escapeCharactersCallback);
        return leadingMDChars + writeAnchorTag({
            wholeMatch: wholeMatch,
            text: text,
            id: null,
            url: url,
            title: null
        }, options, globals) + suffix + leadingMDChars;
    });

    const mailRgx = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi;
    text = text.replace(mailRgx, function (wholeMatch, leadingChar, mail) {
        let url = 'mailto:';
        mail = unescapeSpecialChars(mail);
        if (options.encodeEmails) {
            url = encodeEmailAddress(url + mail);
            mail = encodeEmailAddress(mail);
        } else {
            url = url + mail;
        }
        return leadingChar + writeAnchorTag({
            wholeMatch: wholeMatch,
            text: mail,
            id: null,
            url: url,
            title: null
        }, options, globals);
    });
    return text;
}