async function autoWord(cardId) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    // Performs label detection on the image file
 
    const [result] = await client.labelDetection('./src/images/cards/card (' + cardId + ').jpg');
    const labels = result.labelAnnotations;
    let descriptions = [];
    labels.forEach(label => descriptions.push(label.description));
    const randomWord = descriptions[Math.floor(Math.random()*labels.length)];
    return randomWord;
  }
  
exports.autoWord = autoWord

/* Random card picked*/
exports.autoPickCard = cards => {
    const randomCard = cards[Math.floor(Math.random()*cards.length)];
    return randomCard.cardId;
}

exports.autoWordHello = () => {
    return "hello";
}
