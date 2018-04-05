const { modInverse, adjMatrix } = require('./utils');

const math = require('mathjs');

const ENG_ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', '.', ','];

function encodeKey(key, dict) {
    const n = key.length ** 0.5;
    const encryptedKey = new Array(n).map(() => []);
    for (let i = 0; i < n; i++) {
        encryptedKey[i] = [];
        for (let j = 0; j < n; j++) {
            encryptedKey[i].push(dict[key[j + i * n].toLowerCase()]);
        }
    }
    return encryptedKey;
}

function encodedKeypharseToMatrix(keyphrase, dict) {
    const matrixSize = keyphrase.length ** 0.5;
    const len = keyphrase.length;
    const key = [];
    for (let i = 0; i < len; i += matrixSize) {
        let row = keyphrase
            .slice(i, i + matrixSize)
            .split('')
            .map(letter => dict[letter]);
        key.push(row)
    }
    return key;

}

function getDict(alphabet) {
    return alphabet.reduce((acc, letter, i) => {
        acc[letter] = i;
        return acc;
    }, {});
}

function updateKey(keyword, alphabet) {
    const keyLen = keyword.length;
    const addForSquare = Math.ceil(Math.sqrt(keyLen)) ** 2 - keyLen;
    if (!addForSquare) {
        return keyword;
    }
    const dictLen = Object.keys(alphabet).length;
    let randomKeys = new Array(addForSquare)
        .fill(0)
        .map(() => math.random(0, dictLen) << 0);
    return `${keyword}${randomKeys.map(key => alphabet[key]).join('')}`
}

function encode(text, keyPhrase, alphabet = ENG_ALPHABET) {
    const dict = getDict(alphabet);
    const alphabetLen = alphabet.length;
    const keyword = updateKey(keyPhrase, alphabet);
    const key = encodeKey(keyword, dict);
    if (!math.det(key)) {
        throw new Error('Invalid key');
    }
    const n = keyword.length ** 0.5;
    text += ' '.repeat(n - text.length % n);
    const len = text.length;
    const convertedText = new Array(text.length);
    for (let i = 0; i < len; i++) {
        convertedText[i] = dict[text[i].toLowerCase()];
    }
    let result = [];
    for (let i = 0; i < len; i += n) {
        const encodedPart = convertedText.slice(i, i + n);
        const encodedMatrix = math.multiply(encodedPart, key)
            .map(x => x % alphabetLen);
        result.push(...encodedMatrix);
    }
    result = result.map(x => alphabet[x]).join('');
    const keyToAlphabet = key.reduce((acc, row) => {
        row = row.map(key => alphabet[key]);
        acc.push(...row);
        return acc;
    }, []).join('');
    return { result, key: keyToAlphabet };
}

function decode(text, key, alphabet = ENG_ALPHABET) {
    const dict = getDict(alphabet);
    key = encodedKeypharseToMatrix(key, dict);
    const det = math.det(key);
    const alphabetLen = alphabet.length;
    const modInv = modInverse(det, alphabetLen);
    let adj = adjMatrix(key, alphabetLen);
    adj = adj.map(row => row.map(col => {
        const matrixVal = (col * modInv) % alphabetLen;
        return matrixVal < 0 ? matrixVal + alphabetLen : matrixVal;
    }));
    adj = math.transpose(adj);
    const decodeResult = [];
    const len = text.length;
    const keyLen = key.length;
    const ar = new Array(len);
    for (let i = 0; i < len; i++) {
        ar[i] = dict[text[i].toLowerCase()];
    }
    for (let i = 0; i < len; i += keyLen) {
        const encodedPart = ar.slice(i, i + keyLen);
        const m = math.multiply(encodedPart, adj)
            .map(element => element % alphabetLen);
        decodeResult.push(...m.map(el => alphabet[el]));
    }
    return decodeResult.join('');
}

module.exports = { encode, decode };