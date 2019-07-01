module.exports.assign = (users, number_of_cards) => {
    var allCards = getAllCurrentCards(users);
    var cardsSet = [];

    for (var j = 0; j < number_of_cards; j++) {
        var min = 1;
        var max = 50;
        var random = Math.floor(Math.random() * (max - min) + min);
        var availableGlobally = allCards.indexOf(random) < 0;
        var inCurrentHand = cardsSet.indexOf(random) >= 0;
        while (!availableGlobally || inCurrentHand) {
            random = Math.floor(Math.random() * (max - min) + min);
            available = allCards.indexOf(random) < 0;
            inCurrentHand = cardsSet.indexOf(random) >= 0;
        }
        cardsSet.push(random);
    }

    return cardsSet;
}

function getAllCurrentCards(users) {
    all = []
    for (var i = 0; i < users.length; i++) {
        for (var j = 0; j < users[i].cards.length; j++) {
            all.push(users[i].cards[j]);
        }
    }    
    return all;
}
