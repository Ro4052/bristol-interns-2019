const fs = require('fs');
const wordListPath = require('word-list');
const profanities = fs.readFileSync(wordListPath, 'utf8').split('\n');

var notProfanity = function(text){
    var returnVal = false; 
    for (var i = 0; i < profanities.length; i++) {
        if(text.toLowerCase().includes(profanities[i].toLowerCase())){
            returnVal = true;
            break;
        }
    }
    return returnVal;
}
exports.notProfanity = notProfanity;
