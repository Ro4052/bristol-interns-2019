const fs = require('fs');

let db;
if (process.env.NODE_ENV === 'testing') {
    db = require('../../queries/testdb');
} else {
    db = require('../../queries/db');
}

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
exports.autoWord = (cardId, gameMode) => {
    const promise = gameMode === 'original' ? db.getLabelsTellTales(cardId) : db.getLabelsCustomMode(cardId);
    return promise.then(card => {
        const labels = card.dataValues.labels;
        if (labels.length) {
            return labels[Math.floor(Math.random()*labels.length)];
        }
        return "wordy"
    });
}

exports.addLabel = (cardId, word, gameMode) => {
    if (gameMode === "custom") {
        return db.addLabelCustomMode(cardId, word);
    }
    return db.addLabelTellTalesMode(cardId, word);
}
