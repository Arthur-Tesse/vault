function isFunction(a) {

    return a && typeof a === 'function';
}

export function isString(a) {

    return (typeof a === 'string' || a instanceof String);
}

export function isUndefined(value) {
    'use strict';
    return typeof value === 'undefined';
}

export const regexes = {
    asteriskDashTildeAndColon: /([*_:~])/g,
    asteriskDashAndTilde: /([*_~])/g
};

export function encodeEmailAddress(mail) {

    const encode = [
        function (ch) {
            return '&#' + ch.charCodeAt(0) + ';';
        },
        function (ch) {
            return '&#x' + ch.charCodeAt(0).toString(16) + ';';
        },
        function (ch) {
            return ch;
        }
    ];

    mail = mail.replace(/./g, function (ch) {
        if (ch === '@') {
            // this *must* be encoded. I insist.
            ch = encode[Math.floor(Math.random() * 2)](ch);
        } else {
            var r = Math.random();
            // roughly 10% raw, 45% hex, 45% dec
            ch = (
                r > 0.9 ? encode[2](ch) : r > 0.45 ? encode[1](ch) : encode[0](ch)
            );
        }
        return ch;
    });

    return mail;
}

function regexFindMatchPosition(str, left, right, flags) {

    flags = flags || '';
    const x = new RegExp(left + '|' + right, 'g' + flags.replace(/g/g, ''));
    const l = new RegExp(left, flags.replace(/g/g, ''));
    const pos = [];
    let t;
    let s;
    let m;
    let start;
    let end;

    do {

        t = 0;
        while ((m = x.exec(str))) {

            if (l.test(m[0])) {

                if (!(t++)) {

                    s = x.lastIndex;
                    start = s - m[0].length;
                }
            } else if (t) {

                if (!--t) {

                    end = m.index + m[0].length;
                    const obj = {
                        left: {start: start, end: s},
                        match: {start: s, end: m.index},
                        right: {start: m.index, end: end},
                        wholeMatch: {start: start, end: end}
                    };
                    pos.push(obj);

                    if (!g) {

                        return pos;
                    }
                }
            }
        }
    } while (t && (x.lastIndex = s));

    return pos;
}

export function replaceRecursiveRegExp(str, replacement, left, right, flags) {

    if (!isFunction(replacement)) {

        const repStr = replacement;
        replacement = () => repStr;
    }

    const matchPos = regexFindMatchPosition(str, left, right, flags);
    let finalStr = str;
    const lng = matchPos.length;

    if (lng > 0) {

        const bits = [];

        if (matchPos[0].wholeMatch.start !== 0) {

            bits.push(str.slice(0, matchPos[0].wholeMatch.start));
        }
        for (let i = 0; i < lng; ++i) {

            bits.push(
                replacement(
                    str.slice(matchPos[i].wholeMatch.start, matchPos[i].wholeMatch.end),
                    str.slice(matchPos[i].match.start, matchPos[i].match.end),
                    str.slice(matchPos[i].left.start, matchPos[i].left.end),
                    str.slice(matchPos[i].right.start, matchPos[i].right.end)
                )
            );

            if (i < lng - 1) {

                bits.push(str.slice(matchPos[i].wholeMatch.end, matchPos[i + 1].wholeMatch.start));
            }
        }
        if (matchPos[lng - 1].wholeMatch.end < str.length) {
            bits.push(str.slice(matchPos[lng - 1].wholeMatch.end));
        }

        finalStr = bits.join('');
    }

    return finalStr;
}

export const escapeCharactersCallback = (_, m1) => '¨E' + m1.charCodeAt(0) + 'E';

export function splitAtIndex(str, index) {

    if (!isString(str)) {
        throw 'InvalidArgumentError: first parameter of regexIndexOf function must be a string';
    }
    return [str.substring(0, index), str.substring(index)];
}

export function regexIndexOf(str, regex, fromIndex) {

    if (!isString(str)) {
        throw 'InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string';
    }
    if (regex instanceof RegExp === false) {
        throw 'InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp';
    }
    const indexOf = str.substring(fromIndex || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (fromIndex || 0)) : indexOf;
}