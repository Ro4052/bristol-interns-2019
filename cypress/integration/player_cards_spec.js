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

    describe('player clicks on a card', () => {
        it("its border becomes red", () => {
            cy.playCard();
            cy.get('[data-cy="my-cards"]').children().first().should('have.class', "Card_cardWrapper__1BfyR Card_disabled__1skTK Card_selected__2XUfm");
        });
    });
});
