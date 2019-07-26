const url = Cypress.config().baseUrl;

describe('Play card', () => {
    beforeEach(() => cy.login('unicorn'));

    describe('when first player has played card and word', () => {
        beforeEach(() => {
            cy.createRoom();
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => {
                cy.startGame();
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            });
        });

        it('is prompted to play a card', () => {
            cy.get('[data-cy="play-card"]').should('exist')
        });
    });
});
