export default function (text) {

    return text.replace(/\t(?=\t)/g, '    ')
        .replace(/\t/g, '¨A¨B')
        .replace(/¨B(.+?)¨A/g, (_, match) => {

            for (let i = 0; i < 4 - match.length % 4; i++) {
                match += ' ';
            }

            return match;
        })
        .replace(/¨A/g, '    ')
        .replace(/¨B/g, '');
}