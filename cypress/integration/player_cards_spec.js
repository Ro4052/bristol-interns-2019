const cardsNumber = 3;

describe('The Player Cards Component', () => {
    beforeEach(() => {
        cy.login('unicorn');
    });

    describe('before the game has started', () => {
        it("shouldn't display the cards", () => {
            cy.get('#my-cards ul').its('length').should('be', 0);
        });
    });

    describe('when the game has started', () => {
        it("displays the correct number of cards", () => {
            cy.get('#start-game').click();
            cy.get('#my-cards ul').children().should(($ul) => {
                expect($ul).to.have.length(cardsNumber)
            });
        });
    });

    describe('player clicks on a card', () => {
        it("is removed from the list", () => {
            cy.get('#start-game').click();
            cy.get('#my-cards ul').children().then(($li) => {
                if ($li.hasClass('singleCard')) {
                    cy.get('#my-cards').click();
                    cy.get('#my-cards ul').children().should(($ul) => {
                        expect($ul).to.have.length(cardsNumber-1)
                    });
                }
            })
        });
    });
})
