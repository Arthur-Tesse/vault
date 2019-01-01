/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */

const re_btou = new RegExp([
    '[\xC0-\xDF][\x80-\xBF]',
    '[\xE0-\xEF][\x80-\xBF]{2}',
    '[\xF0-\xF7][\x80-\xBF]{3}'
].join('|'), 'g');

const cb_btou = function (c) {
    switch (c.length) {
        case 4:
            const cp = ((0x07 & c.charCodeAt(0)) << 18)
                | ((0x3f & c.charCodeAt(1)) << 12)
                | ((0x3f & c.charCodeAt(2)) << 6)
                | (0x3f & c.charCodeAt(3)),
                offset = cp - 0x10000;
            return (String.fromCharCode((offset >>> 10) + 0xD800)
                + String.fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return String.fromCharCode(
                ((0x0f & c.charCodeAt(0)) << 12)
                | ((0x3f & c.charCodeAt(1)) << 6)
                | (0x3f & c.charCodeAt(2))
            );
        default:
            return String.fromCharCode(
                ((0x1f & c.charCodeAt(0)) << 6)
                | (0x3f & c.charCodeAt(1))
            );
    }
};

function btou(b) {
    return b.replace(re_btou, cb_btou);
}

function _decode(a) {
    return btou(atob(a));
}

function decode(a) {
    return _decode(
        String(a).replace(/[-_]/g, function (m0) {
            return m0 === '-' ? '+' : '/';
        })
            .replace(/[^A-Za-z0-9+\/]/g, '')
    );
}

export default {
    decode: decode
};