const { shuffle } = require('./utils');

const ENG_ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function encode(content, alphabet = ENG_ALPHABET) {

    let key = shuffle(alphabet);
    const dict = alphabet.reduce((acc, letter, i) => {
        acc[letter] = key[i];
        return acc;
    }, {});
    const len = content.length;
    let result = new Array(len);
    for (let i = 0; i < len; i++) {
        result[i] = dict[content[i].toLowerCase()] || content[i];
    }
    result = result.join('');
    key = key.join('');

    return { result, key };
}

function decode(content, key, alphabet = ENG_ALPHABET) {

    const dict = {};
    for (let i = 0; i < key.length; i++) {
        dict[key[i]] = alphabet[i];
    }
    const len = content.length;
    let result = new Array(len);
    for (let i = 0; i < len; i++) {
        result[i] = dict[content[i].toLowerCase()] || content[i];
    }

    return result.join('');
}

module.exports = { encode, decode };
