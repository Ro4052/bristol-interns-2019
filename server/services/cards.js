module.exports.assign = (users, number_of_cards) => {
    const allCards = getAllCurrentCards(users);
    let cardsSet = [];

    for (let j = 0; j < number_of_cards; j++) {
        const min = 1;
        const max = 249;
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

function getAllCurrentCards(users) {
    let all = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users[i].cards.length; j++) {
            all.push(users[i].cards[j]);
        }
    }    
    return all;
}
