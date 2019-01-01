import {escapeCharactersCallback} from '../helpers.js';

/**
 *
 * @param text
 * @returns {*}
 */
export default function escapeSpecialCharsWithinTagAttributes(text) {

    const tags = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi;
    const comments = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;

    text = text.replace(tags, (wholeMatch) => {
        return wholeMatch
            .replace(/(.)<\/?code>(?=.)/g, '$1`')
            .replace(/([\\`*_~=|])/g, escapeCharactersCallback);
    }).replace(comments, (wholeMatch) => {
        return wholeMatch
            .replace(/([\\`*_~=|])/g, escapeCharactersCallback);
    });
    return text;
}