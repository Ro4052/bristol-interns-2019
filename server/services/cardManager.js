module.exports = class CardManager {
    constructor() {
        this.cardsSet = [];
    }

    getAllCurrentCards(users) {
        let all = [];
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < users[i].cards.length; j++) {
                all.push(users[i].cards[j]);
            }
        }    
        return all;
    }

    assign(users, number_of_cards) {
        let allCards = this.getAllCurrentCards(users);
        for (let j = 0; j < number_of_cards; j++) {
            const min = 1;
            const max = 298;
            let random = Math.floor(Math.random() * (max - min) + min);
            
            let availableGlobally = allCards.some(card => card.cardId !== random);
            let inCurrentHand = this.cardsSet.some(card => card.cardId === random);
            
            while (availableGlobally || inCurrentHand) {            
                random = Math.floor(Math.random() * (max - min) + min);
                availableGlobally = allCards.some(card => card.cardId === random);
                inCurrentHand = this.cardsSet.some(card => card.cardId === random);
            }
            this.cardsSet.push({ cardId: random, played: false });
        }
    }

    getCardSet() { return this.cardsSet; }
}
