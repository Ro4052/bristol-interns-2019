describe('Played cards', () => {
    const numberOfPlayers = 2;

    describe("when the storyteller has played", () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.createRoom(3))
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.startGame())
            .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`));
        });

        it('all the played cards are displayed', () => {
            cy.playCard();
            cy.get('[data-cy="vote-timer"]').should('exist');
            cy.get('[data-cy="played-card"]');
            cy.get('[data-cy="played-cards"] [data-cy="card-wrapper"]').its('length').should('eq', numberOfPlayers - 1);
        });
    });
});
