import outdent from './outdent.js';
import paragraphs from './paragraphs.js';
import spanGamut from './spanGamut.js';
import blockGamut from './blockGamut.js';
import githubCodeBlocks from './githubCodeBlocks.js';
import hashHTMLBlocks from './hashHTMLBlocks.js';

export default function lists(text, options, globals) {

    function processListItems(listStr, trimTrailing) {

        globals.listLevel++;

        listStr = listStr.replace(/\n{2,}$/, '\n');

        listStr += '¨0';

        const rgx = options.disableForced4SpacesIndentedSublists
            ? /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[([xX ])?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm
            : /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[([xX ])?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm;
        const isParagraphed = (/\n[ \t]*\n(?!¨0)/.test(listStr));


        listStr = listStr.replace(rgx, function (wholeMatch, m1, m2, m3, m4, taskbtn, checked) {
            checked = (checked && checked.trim() !== '');

            let item = outdent(m4);
            let bulletStyle = '';

            // Support for github tasklists
            if (taskbtn && options.tasklists) {
                bulletStyle = ' class="task-list-item" style="list-style-type: none;"';
                item = item.replace(/^[ \t]*\[([xX ])?]/m, function () {
                    let otp = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
                    if (checked) {
                        otp += ' checked';
                    }
                    otp += '>';
                    return otp;
                });
            }
            item = item.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function (wm2) {
                return '¨A' + wm2;
            });
            if (/^#+.+\n.+/.test(item)) {
                item = item.replace(/^(#+.+)$/m, '$1\n');
            }

            // m1 - Leading line or
            // Has a double return (multi paragraph)
            if (m1 || (item.search(/\n{2,}/) > -1)) {
                item = githubCodeBlocks(item, options, globals);
                item = blockGamut(item, options, globals);
            } else {

                // Recursion for sub-lists:
                item = lists(item, options, globals);
                item = item.replace(/\n$/, ''); // chomp(item)
                item = hashHTMLBlocks(item, options, globals);

                // Colapse double linebreaks
                item = item.replace(/\n\n+/g, '\n\n');

                if (isParagraphed) {
                    item = paragraphs(item, options, globals);
                } else {
                    item = spanGamut(item, options, globals);
                }
            }

            item = item.replace('¨A', '');
            item = '<li' + bulletStyle + '>' + item + '</li>\n';

            return item;
        });

        listStr = listStr.replace(/¨0/g, '');

        globals.listLevel--;

        if (trimTrailing) {
            listStr = listStr.replace(/\s+$/, '');
        }

        return listStr;
    }

    function styleStartNumber(list, listType) {
        // check if ol and starts by a number different than 1
        if (listType === 'ol') {
            const res = list.match(/^ *(\d+)\./);
            if (res && res[1] !== '1') {
                return ' start="' + res[1] + '"';
            }
        }
        return '';
    }

    /**
     * Check and parse consecutive lists (better fix for issue #142)
     * @param {string} list
     * @param {string} listType
     * @param {boolean} trimTrailing
     * @returns {string}
     */
    function parseConsecutiveLists(list, listType, trimTrailing) {
        // check if we caught 2 or more consecutive lists by mistake
        // we use the counterRgx, meaning if listType is UL we look for OL and vice versa
        const olRgx = (options.disableForced4SpacesIndentedSublists) ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm;
        const ulRgx = (options.disableForced4SpacesIndentedSublists) ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm;
        let counterRxg = (listType === 'ul') ? olRgx : ulRgx;
        let result = '';

        if (list.search(counterRxg) !== -1) {
            (function parseCL(txt) {
                const pos = txt.search(counterRxg);
                const style = styleStartNumber(list, listType);
                if (pos !== -1) {
                    // slice
                    result += '\n\n<' + listType + style + '>\n' + processListItems(txt.slice(0, pos), !!trimTrailing) + '</' + listType + '>\n';

                    // invert counterType and listType
                    listType = (listType === 'ul') ? 'ol' : 'ul';
                    counterRxg = (listType === 'ul') ? olRgx : ulRgx;

                    //recurse
                    parseCL(txt.slice(pos));
                } else {
                    result += '\n\n<' + listType + style + '>\n' + processListItems(txt, !!trimTrailing) + '</' + listType + '>\n';
                }
            })(list);
        } else {
            const style = styleStartNumber(list, listType);
            result = '\n\n<' + listType + style + '>\n' + processListItems(list, !!trimTrailing) + '</' + listType + '>\n';
        }

        return result;
    }

    const subListRgx = /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
    const mainListRgx = /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
    text += '¨0';

    if (globals.listLevel) {
        text = text.replace(subListRgx, function (wholeMatch, list, m2) {
            const listType = (m2.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
            return parseConsecutiveLists(list, listType, true);
        });
    } else {
        text = text.replace(mainListRgx, function (wholeMatch, m1, list, m3) {
            const listType = (m3.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
            return parseConsecutiveLists(list, listType, false);
        });
    }

    // strip sentinel
    text = text.replace(/¨0/, '');
    return text;
}