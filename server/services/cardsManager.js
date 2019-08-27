exports.assign = (users, numberOfCards, max) => {
    const allCards = getAllCurrentCards(users);
    let cardsSet = [];

    const min = 1;
    console.log("Cards", max);
    
    for (let j = 0; j < numberOfCards; j++) {
        let random = Math.floor(Math.random() * (max - min) + min);
        
        let availableGlobally = allCards.some(card => card.cardId !== random);
        let inCurrentHand = cardsSet.some(card => card.cardId === random);
        
        while (availableGlobally || inCurrentHand) {            
            random = Math.floor(Math.random() * (max - min) + min);
            availableGlobally = allCards.some(card => card.cardId === random);
            inCurrentHand = cardsSet.some(card => card.cardId === random);
        }
        cardsSet.push({ cardId: random, played: false });
    }
    return cardsSet;
}

const getAllCurrentCards = users => {
    let all = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users[i].cards.length; j++) {
            all.push(users[i].cards[j]);
        }
    }    
    return all;
}

/**
 * Shuffles cards in place.
 * @param {Array} cards
*/
exports.shuffle = cards => {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const x = cards[i];
        cards[i] = cards[j];
        cards[j] = x;
    }
    return cards;
};
