describe('My Cards', () => {
    beforeEach(() => {
        cy.login('unicorn');
        cy.startGame();
    });
    
    describe('when the game has started', () => {
        it("displays the correct number of cards", () => {
            cy.get('[data-cy="my-cards"]').children().its('length').should('eq', 3);
        });
    });

    describe('player clicks on a card', () => {
        it("its highlighted by being moved upwards on the y axis", () => {
            cy.get('[data-cy="my-cards"] [data-cy="card"]').first().click();
            cy.get('[data-cy="my-cards"]').children().first().should('have.css', "transform", "matrix(1, 0, 0, 1, 0, -30)");
        });
    });
});
