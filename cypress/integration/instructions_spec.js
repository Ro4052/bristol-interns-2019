const url = Cypress.config().baseUrl;

describe('Waiting', () => {
    beforeEach(() => cy.login('unicorn'));

    describe('when storyteller is playing card and word', () => {
        beforeEach(() => {
            cy.createRoom(3);
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => {
                cy.startGame();
            });
        });

        it('other players are told to wait', () => {
            cy.get('[data-cy="wait-for-storyteller"]').should('exist');
        });
    });
});
