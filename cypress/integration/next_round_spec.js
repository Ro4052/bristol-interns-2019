describe('Next round button', () => {
    beforeEach(() => {
        cy.signup('unicorn', 'password')
        .then(() => cy.createRoom(3))
        .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
        .then(() => cy.get('[data-cy="room-title"]'))
        .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
        .then(() => cy.startGame());
    });

    describe('on everyone voted for a card and a player presses new round button', () => {
        it("moves on to the next round and updates the round number", () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.playCard();
                cy.voteCard();
                cy.nextRound();
                cy.get('[data-cy="round-number"]').should('contain', 2);
            });
        });
    });
});
