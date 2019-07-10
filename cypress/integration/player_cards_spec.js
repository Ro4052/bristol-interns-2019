describe('The Player Cards Component', () => {
    beforeEach(() => {
        cy.visit('/');
        const username = "unicorn";
        cy.get('input').type(username);
        cy.get('button').click();
    });
    
    afterEach(() => {
        cy.request({
            url: '/api/end',
            method: 'GET'
        });
        cy.visit('/');
    });

    const cardsNumber = 3;

    describe('Player starts the game and is given a set of cards', () => {
        it("doesn't display the cards before the game has started", () => {
            cy.get('#my-cards ul').its('length').should('be', 0);
        });

        it("displays the correct number of cards when the game has started", () => {
            cy.get('#start-game').click();
            cy.get('#my-cards ul').children().should(($ul) => {
                expect($ul).to.have.length(cardsNumber)
            });
        });
    });

    describe('Player clicks on a card', () => {
        it("is able to click on a card and it is removed from the list", () => {
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