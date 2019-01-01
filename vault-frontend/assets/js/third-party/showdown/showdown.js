import Options from './options.js';
import detab from './subparsers/detab.js';
import metadata from './subparsers/metadata.js';
import hashPreCodeTags from './subparsers/hashPreCodeTags.js';
import githubCodeBlocks from './subparsers/githubCodeBlocks.js';
import hashHTMLBlocks from './subparsers/hashHTMLBlocks.js';
import hashCodeTags from './subparsers/hashCodeTags.js';
import blockGamut from './subparsers/blockGamut.js';
import {isString} from './helpers.js';
import {unhashHTMLSpans} from './subparsers/hashHTMLSpans.js';
import unescapeSpecialChars from './subparsers/unescapeSpecialChars.js';
import stripLinkDefinitions from './subparsers/stripLinkDefinitions.js';

export default class Showdown {

    constructor(options = null) {

        if (options == null)
            options = new Options({});
        if (!(options instanceof Options))
            throw 'Can\'t create a Showdown instance with option of type ' + typeof (options);
        this.options = options;

        if (this.options.ghMentions && !isString(this.options.ghMentionsLink)) {
            throw new Error('ghMentionsLink option must be a string');
        }
    }

    makeHtml(text) {

        if (!text) {
            return text;
        }

        const globals = {

            htmlBlocks: [],
            htmlMdBlocks: [],
            htmlSpans: [],
            urls: {},
            titles: {},
            dimensions: {},
            listLevel: 0,
            hashLinkCounts: {},
            ghCodeBlocks: [],
            metadata: {
                parsed: {},
                raw: '',
                format: ''
            }
        };

        text = text.replace(/¨/g, '¨T')
            .replace(/\$/g, '¨D')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '/n')
            .replace(/\u00A0/g, '&nbps;');

        if (this.options.smartIndentationFix) {

            text = text.replace(new RegExp('^\\s{0,' + text.match(/^\s+/)[0].length + '}',
                'gm'));
        }

        text = '\n\n' + text + '\n\n';
        text = detab(text)
            .replace(/^[ \t]+$/mg, '');

        text = metadata(text, this.options, globals);
        text = hashPreCodeTags(text, globals);
        text = githubCodeBlocks(text, this.options, globals);
        text = hashHTMLBlocks(text, this.options, globals, this);
        text = hashCodeTags(text, globals);
        text = stripLinkDefinitions(text);
        text = blockGamut(text, this.options, globals);
        text = unhashHTMLSpans(text, globals);
        text = unescapeSpecialChars(text);

        console.log(globals);
        return text;
    }
}