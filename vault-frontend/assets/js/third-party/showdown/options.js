export default class Options {

    constructor({
                    omitExtraWLInCodeBlocks = false,
                    noHeaderId = false,
                    prefixHeaderId = false,
                    rawPrefixHeaderId = false,
                    ghCompatibleHeaderId = false,
                    rawHeaderId = false,
                    headerLevelStart = false,
                    parseImgDimensions = false,
                    simplifiedAutoLink = false,
                    literalMidWordUnderscores = false,
                    literalMidWordAsterisks = false,
                    strikethrough = false,
                    tables = false,
                    tablesHeaderId = false,
                    ghCodeBlocks = true,
                    tasklists = false,
                    smoothLivePreview = false,
                    smartIndentationFix = false,
                    disableForced4SpacesIndentedSublists = false,
                    simpleLineBreaks = false,
                    requireSpaceBeforeHeadingText = false,
                    ghMentions = false,
                    ghMentionsLink = 'https://github.com/{u}',
                    encodeEmails = true,
                    openLinksInNewWindow = false,
                    backslashEscapesHTMLTags = false,
                    emoji = false,
                    underline = false,
                    completeHTMLDocument = false,
                    metadata = false,
                    splitAdjacentBlockquotes = false,
                    customizedHeaderId = false
                }
    ) {

        this.omitExtraWLInCodeBlocks = omitExtraWLInCodeBlocks;
        this.noHeaderId = noHeaderId;
        this.prefixHeaderId = prefixHeaderId;
        this.rawPrefixHeaderId = rawPrefixHeaderId;
        this.ghCompatibleHeaderId = ghCompatibleHeaderId;
        this.rawHeaderId = rawHeaderId;
        this.headerLevelStart = headerLevelStart;
        this.parseImgDimensions = parseImgDimensions;
        this.simplifiedAutoLink = simplifiedAutoLink;
        this.literalMidWordUnderscores = literalMidWordUnderscores;
        this.literalMidWordAsterisks = literalMidWordAsterisks;
        this.strikethrough = strikethrough;
        this.tables = tables;
        this.tablesHeaderId = tablesHeaderId;
        this.ghCodeBlocks = ghCodeBlocks;
        this.tasklists = tasklists;
        this.smoothLivePreview = smoothLivePreview;
        this.smartIndentationFix = smartIndentationFix;
        this.disableForced4SpacesIndentedSublists = disableForced4SpacesIndentedSublists;
        this.simpleLineBreaks = simpleLineBreaks;
        this.requireSpaceBeforeHeadingText = requireSpaceBeforeHeadingText;
        this.ghMentions = ghMentions;
        this.ghMentionsLink = ghMentionsLink;
        this.encodeEmails = encodeEmails;
        this.openLinksInNewWindow = openLinksInNewWindow;
        this.backslashEscapesHTMLTags = backslashEscapesHTMLTags;
        this.emoji = emoji;
        this.underline = underline;
        this.completeHTMLDocument = completeHTMLDocument;
        this.metadata = metadata;
        this.splitAdjacentBlockquotes = splitAdjacentBlockquotes;
        this.customizedHeaderId = customizedHeaderId;
    }
}

export const github = new Options({
    omitExtraWLInCodeBlocks: true,
    simplifiedAutoLink: true,
    literalMidWordUnderscores: true,
    strikethrough: true,
    tables: true,
    tablesHeaderId: true,
    ghCodeBlocks: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    simpleLineBreaks: true,
    requireSpaceBeforeHeadingText: true,
    ghCompatibleHeaderId: true,
    ghMentions: true,
    backslashEscapesHTMLTags: true,
    emoji: true,
    splitAdjacentBlockquotes: true
});

export const original = new Options({
    noHeaderId: true,
    ghCodeBlocks: false
});

export const ghost = new Options({

    omitExtraWLInCodeBlocks: true,
    parseImgDimensions: true,
    simplifiedAutoLink: true,
    literalMidWordUnderscores: true,
    strikethrough: true,
    tables: true,
    tablesHeaderId: true,
    ghCodeBlocks: true,
    tasklists: true,
    smoothLivePreview: true,
    simpleLineBreaks: true,
    requireSpaceBeforeHeadingText: true,
    ghMentions: false,
    encodeEmails: true
});