const math = require('mathjs');

function shuffle(array) {
    const length = array == null ? 0 : array.length;
    if (!length) {
        return []
    }
    let index = -1;
    const lastIndex = length - 1;
    const result = [...array];
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
        [result[rand], result[index]] = [result[index], result[rand]];
    }
    return result
}

function modInverse(a, m) {
    let atemp = a;
    atemp %= m;
    if (atemp < 0) {
        atemp = m + atemp;
    }

    for (let x = 1; x < m; x++) {
        if (((atemp * x) % m) === 1) {
            return x;
        }
    }

}

function multiplyMatrix(m1, m2) {
    const result = new Array(m1.length);
    for (let i = 0; i < m1.length; i++) {
        result[i] = new Array(m2[0].length);
        for (let j = 0; j < m2[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < m2.length; k++) {
                result[i][j] += m1[i][k] * m2[k][j]
            }
        }
    }
    return result;
}

function adjMatrix(matrix, mod = 1) {
    const [rows, cols] = [matrix.length, matrix[0].length];
    const result = new Array(rows);
    for (let i = 0; i < rows; i++) {
        result[i] = [];
        for (let j = 0; j < cols; j++) {
            const multiplier = (-1) ** (i + j);
            let m = matrix
                .slice(0, i)
                .concat(matrix.slice(i + 1))
                .map(x => x.slice(0, j)
                    .concat(x.slice(j + 1)));
            result[i].push(multiplier * math.det(math.matrix(m)));
        }
    }
    if (mod === 1) {
        return result
    } else {
        return result.map(row => row.map(col => col % mod))
    }
}

module.exports = { shuffle, modInverse, multiplyMatrix, adjMatrix };