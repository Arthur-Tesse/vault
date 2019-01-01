/**
 *
 * @param text
 * @param options
 * @returns {*}
 */
export default function italicsAndBold(text, options) {


    function parseInside(txt, left, right) {
        return left + txt + right;
    }

    if (options.literalMidWordUnderscores) {

        text = text.replace(/\b___(\S[\s\S]*?)___\b/g, function (wm, txt) {
            return parseInside(txt, '<strong><em>', '</em></strong>');
        })
            .replace(/\b__(\S[\s\S]*?)__\b/g, function (wm, txt) {
                return parseInside(txt, '<strong>', '</strong>');
            })
            .replace(/\b_(\S[\s\S]*?)_\b/g, function (wm, txt) {
                return parseInside(txt, '<em>', '</em>');
            });
    } else {

        text = text.replace(/___(\S[\s\S]*?)___/g, function (wm, m) {
            return (/\S$/.test(m)) ? parseInside(m, '<strong><em>', '</em></strong>') : wm;
        })
            .replace(/__(\S[\s\S]*?)__/g, function (wm, m) {
                return (/\S$/.test(m)) ? parseInside(m, '<strong>', '</strong>') : wm;
            })
            .replace(/_([^\s_][\s\S]*?)_/g, function (wm, m) {
                // !/^_[^_]/.test(m) - test if it doesn't start with __ (since it seems redundant, we removed it)
                return (/\S$/.test(m)) ? parseInside(m, '<em>', '</em>') : wm;
            });
    }
    text = text.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function (wm, m) {
        return (/\S$/.test(m)) ? parseInside(m, '<strong><em>', '</em></strong>') : wm;
    })
        .replace(/\*\*(\S[\s\S]*?)\*\*/g, function (wm, m) {
            return (/\S$/.test(m)) ? parseInside(m, '<strong>', '</strong>') : wm;
        })
        .replace(/\*([^\s*][\s\S]*?)\*/g, function (wm, m) {
            return (/\S$/.test(m)) ? parseInside(m, '<em>', '</em>') : wm;
        });
    return text;
}
