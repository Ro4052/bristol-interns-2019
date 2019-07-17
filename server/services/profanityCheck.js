const fs = require('fs');
const wordListPath = require('word-list');
const validWords = fs.readFileSync(wordListPath, 'utf8').toLowerCase().split('\n');

const isValidWord = word => validWords.some(validWord => validWord === word.toLowerCase());
exports.isValidWord = isValidWord;
