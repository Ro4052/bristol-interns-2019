describe('The Player Cards Component', () => {
    beforeEach(() => {
        cy.login('unicorn');
        cy.wait(500);
        cy.startGame();
    });
    
    describe('when the game has started', () => {
        it("displays the correct number of cards", () => {
            cy.get('[data-cy="my-cards"]').children().its('length').should('eq', 3);
        });
    });

    describe('player clicks on a card', () => {
        it("is removed from the list", () => {
            cy.playCard();
            cy.get('[data-cy="my-cards"]').children().its('length').should('eq', 2);
        });
    });
});
