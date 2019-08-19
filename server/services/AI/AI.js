const fs = require('fs');

/* Random card picked*/
exports.pickRandomCard = cards => {
    const randomCard = cards[Math.floor(Math.random()*cards.length)];
    return randomCard.cardId;
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
        const [result] = await client.labelDetection(`./src/images/cards/card (${cardId}).jpg`);
        const labels = result.labelAnnotations;
        const descriptions = labels.map(label => label.description);
        const data = JSON.stringify({cardId, descriptions});
        fs.appendFileSync('card-labels.json', data + ", " + "\n");
    }
}  
exports.autoWordGenerator = autoWordGenerator

// Pick random word from each list of labels for a card //
exports.autoWord = (cardId) => {
    let content;
    return new Promise((resolve, reject) => {
        fs.readFile('./card-labels.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            content = data.split("\n")[cardId - 1];
            const start = content.indexOf('["');
            const end = content.indexOf('"]');
            content = content.slice(start + 2, end).split('","');
            const word = content[Math.floor(Math.random()*content.length)];
            resolve(word);
        });
    });
}
