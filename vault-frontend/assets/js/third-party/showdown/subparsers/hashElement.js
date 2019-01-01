/**
 *
 * @param globals
 * @returns {function(*, *=): string}
 */
export default function hashElement(globals) {

    return function (_, m1) {

        m1 = m1.replace(/\n\n/g, '\n')
            .replace(/^\n/, '')
            .replace(/\n+$/g, '');

        return '\n\n¨K' + (globals.htmlBlocks.push(m1) - 1) + 'K\n\n';
    };
}