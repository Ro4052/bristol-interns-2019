module.exports.assign = (users, number_of_cards) => {
    const allCards = getAllCurrentCards(users);
    let cardsSet = [];

    for (let j = 0; j < number_of_cards; j++) {
        const min = 1;
        const max = 50;
        const random = Math.floor(Math.random() * (max - min) + min);
        const availableGlobally = allCards.indexOf(random) < 0;
        const inCurrentHand = cardsSet.indexOf(random) >= 0;
        while (!availableGlobally || inCurrentHand) {
            const random = Math.floor(Math.random() * (max - min) + min);
            const available = allCards.indexOf(random) < 0;
            const inCurrentHand = cardsSet.indexOf(random) >= 0;
        }
        cardsSet.push(random);
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
