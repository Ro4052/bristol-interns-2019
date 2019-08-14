// where the maths will be, ie functionality for the AI person

/* Random card picked*/
exports.autoPickCard = cards => {
    const randomCard = cards[Math.floor(Math.random()*cards.length)];
    return cardId = randomCard.cardId;
}

exports.autoWord = () => {
    return word = "hello";
}
