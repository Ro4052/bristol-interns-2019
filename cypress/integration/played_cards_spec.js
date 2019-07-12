describe('The Played Cards Component', function() {
    const cardsNumber = 3;
    const numberOfPlayers = 2;

    describe("at end of round", () => {
        it('all the played cards are displayed', () => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.startGame();
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                .then(() => {
                    cy.playCard();
                    cy.get('[data-cy="my-cards"]').children().its('length').should('eq', cardsNumber - 1);
                    cy.get('[data-cy="played-cards"]').children().its('length').should('eq', numberOfPlayers);
                });
            });
        });
    });
});
