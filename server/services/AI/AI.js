const fs = require('fs');

/* Random card picked*/
exports.autoPickCard = cards => {
    const randomCard = cards[Math.floor(Math.random()*cards.length)];
    return randomCard.cardId;
}

exports.autoWordHello = () => {
    return "hello";
}

// Generate list of labels for each picture //
async function autoWordGenerator() {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    // Performs label detection on the image file
    var cardId;
    for (cardId=1; cardId < 248; cardId++) {
        const [result] = await client.labelDetection('./src/images/cards/card (' + cardId + ').jpg');
        const labels = result.labelAnnotations;
        let descriptions = [];
        labels.forEach(label => descriptions.push(label.description));
        let data = JSON.stringify({cardId, descriptions})
        fs.appendFileSync('card-labels.json', data + ", " + "\n")

        // const randomWord = descriptions[Math.floor(Math.random()*labels.length)];
        // return randomWord;
    }
}
  
exports.autoWordGenerator = autoWordGenerator

// Pick random word from each list of labels for a card //
const autoWord = (cardId) => {
    var content;
    return new Promise((resolve, reject) => {
        fs.readFile('./card-labels.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            content = data.split("\n")[cardId-1];
            start = content.indexOf('["');
            end = content.indexOf('"]');
            content= content.slice(start+2, end).split('","');
            console.log(content)
            const word = content[Math.floor(Math.random()*content.length)];
            console.log(word)
            resolve(word);
        });
    });
}

exports.autoWord = autoWord