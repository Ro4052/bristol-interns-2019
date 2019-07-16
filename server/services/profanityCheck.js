const fs = require('fs');
const wordListPath = require('word-list');
const validWords = fs.readFileSync(wordListPath, 'utf8').split('\n');

const isValidWord = word => validWords.some(validWord => validWord.toLowerCase() === word.toLowerCase());
exports.isValidWord = isValidWord;
