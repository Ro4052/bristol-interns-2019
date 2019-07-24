const url = Cypress.config().baseUrl;

describe('Play card', () => {
    beforeEach(() => cy.login('unicorn'));

    describe('when first player has played card and word', () => {
        it('is prompted to play a card', () => {
            cy.createRoom();
            cy.startGame();
            cy.get('[data-cy="play-card"]').should('exist')
        });
    });
});
