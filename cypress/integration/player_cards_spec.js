describe('The Player Cards Component', () => {
    beforeEach(() => {
        cy.login('unicorn');
        cy.startGame();
    });
    
    describe('when the game has started', () => {
        it("displays the correct number of cards", () => {
            cy.get('[data-cy="my-cards"]').children().its('length').should('eq', 3);
        });
    });

    /* TODO: figure out how to test border */
    describe('player clicks on a card', () => {
        it("its highlighted by being moved upwards on the y axis", () => {
            cy.playCard();
            cy.get('[data-cy="my-cards"]').children().first().should('have.css', "transform", "matrix(1, 0, 0, 1, 0, -30)");
        });
    });
});
