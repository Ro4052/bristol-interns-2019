describe('Played cards', () => {
    const cardsNumber = 5;
    const numberOfPlayers = 2;

    describe("when the storyteller has played", () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.createRoom(3))
            .then(() => cy.get('[data-cy="room-title"]'))
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.startGame())
            .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`));
        });

        it('a hidden card is displayed after first player plays', () => {
            cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 1);
        });

        it('all the played cards are displayed', () => {
            cy.playCard();
            cy.get('[data-cy="my-cards"]').children().its('length').should('eq', cardsNumber - 1);
            cy.get('[data-cy="played-cards"]').children().its('length').should('eq', numberOfPlayers);
        });
    });
});
