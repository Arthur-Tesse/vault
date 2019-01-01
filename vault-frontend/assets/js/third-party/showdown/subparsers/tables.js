import spanGamut from './spanGamut.js';
import codeSpans from './codeSpans.js';
import {escapeCharactersCallback, isUndefined} from '../helpers.js';

export default function tables(text, options, globals) {
    'use strict';

    if (!options.tables) {
        return text;
    }

    const tableRgx = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm;
    const singeColTblRgx = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;

    function parseStyles(sLine) {
        if (/^:[ \t]*--*$/.test(sLine)) {
            return ' style="text-align:left;"';
        } else if (/^--*[ \t]*:[ \t]*$/.test(sLine)) {
            return ' style="text-align:right;"';
        } else if (/^:[ \t]*--*[ \t]*:$/.test(sLine)) {
            return ' style="text-align:center;"';
        } else {
            return '';
        }
    }

    function parseHeaders(header, style) {
        let id = '';
        header = header.trim();
        if (options.tablesHeaderId) {
            id = ' id="' + header.replace(/ /g, '_').toLowerCase() + '"';
        }

        return '<th' + id + style + '>' + spanGamut(header, options, globals) + '</th>\n';
    }

    function parseCells(cell, style) {
        return '<td' + style + '>' + spanGamut(cell, options, globals) + '</td>\n';
    }

    function buildTable(headers, cells) {
        let tb = '<table>\n<thead>\n<tr>\n';
        const tblLgn = headers.length;

        for (let i = 0; i < tblLgn; ++i) {
            tb += headers[i];
        }
        tb += '</tr>\n</thead>\n<tbody>\n';

        for (let i = 0; i < cells.length; ++i) {
            tb += '<tr>\n';
            for (let ii = 0; ii < tblLgn; ++ii) {
                tb += cells[i][ii];
            }
            tb += '</tr>\n';
        }
        tb += '</tbody>\n</table>\n';
        return tb;
    }

    function parseTable(rawTable) {
        const tableLines = rawTable.split('\n');

        for (let i = 0; i < tableLines.length; ++i) {
            // strip wrong first and last column if wrapped tables are used
            if (/^ {0,3}\|/.test(tableLines[i])) {
                tableLines[i] = tableLines[i].replace(/^ {0,3}\|/, '');
            }
            if (/\|[ \t]*$/.test(tableLines[i])) {
                tableLines[i] = tableLines[i].replace(/\|[ \t]*$/, '');
            }
            // parse code spans first, but we only support one line code spans

            tableLines[i] = codeSpans(tableLines[i], globals);
        }

        const rawHeaders = tableLines[0].split('|').map(function (s) {
                return s.trim();
            }),
            rawStyles = tableLines[1].split('|').map(function (s) {
                return s.trim();
            });
        const rawCells = [];
        const headers = [];
        const styles = [];
        const cells = [];

        tableLines.shift();
        tableLines.shift();

        for (let i = 0; i < tableLines.length; ++i) {
            if (tableLines[i].trim() === '') {
                continue;
            }
            rawCells.push(
                tableLines[i]
                    .split('|')
                    .map(function (s) {
                        return s.trim();
                    })
            );
        }

        if (rawHeaders.length < rawStyles.length) {
            return rawTable;
        }

        for (let i = 0; i < rawStyles.length; ++i) {
            styles.push(parseStyles(rawStyles[i]));
        }

        for (let i = 0; i < rawHeaders.length; ++i) {
            if (isUndefined(styles[i])) {
                styles[i] = '';
            }
            headers.push(parseHeaders(rawHeaders[i], styles[i]));
        }

        for (let i = 0; i < rawCells.length; ++i) {
            const row = [];
            for (let ii = 0; ii < headers.length; ++ii) {
                if (isUndefined(rawCells[i][ii])) {

                }
                row.push(parseCells(rawCells[i][ii], styles[ii]));
            }
            cells.push(row);
        }

        return buildTable(headers, cells);
    }

    // find escaped pipe characters
    text = text.replace(/\\(\|)/g, escapeCharactersCallback);

    // parse multi column tables
    text = text.replace(tableRgx, parseTable);

    // parse one column tables
    text = text.replace(singeColTblRgx, parseTable);

    return text;
}