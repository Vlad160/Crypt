const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const otosc = require('./OTOSC');
const hill = require('./hill');

const { file, mode, alg, key } = argv;
if (mode === 'decode' && !key) {
    throw new Error('Provide key for decoding');

}

const fileContent = fs.readFileSync(file, 'utf-8');
let keyText;
if (key) {
    keyText = fs.readFileSync(key, 'utf-8');
}

run(alg, mode, fileContent, keyText);

function run(alg, mode, text, key) {
    if (alg === 'otosc') {
        if (mode === 'encode') {
            console.log('HUI');
            const { result, key } = otosc.encode(text);
            writeFile('output.txt', result);
            writeFile('key.txt', key);
        }
        if (mode === 'decode') {
            const result = otosc.decode(text, key);
            writeFile('output.txt', result);
            writeFile('key.txt', key);
        }
    }
    if (alg === 'hill') {
        if (mode === 'encode') {
            const { result, key: encodedKey } = hill.encode(text, key);
            writeFile('output.txt', result);
            writeFile('key.txt', encodedKey);
        }
        if (mode === 'decode') {
            const result = hill.decode(text, key);
            writeFile('output.txt', result);
            writeFile('key.txt', key);
        }
    }


}

function writeFile(fileName, content) {
    fs.writeFileSync(fileName, content);
}