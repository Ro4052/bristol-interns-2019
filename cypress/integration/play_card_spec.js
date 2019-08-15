const url = Cypress.config().baseUrl;

describe('Play card', () => {
    beforeEach(() => cy.login('unicorn'));

    describe('when first player has played card and word', () => {
        beforeEach(() => {
            cy.createRoom(3);
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

        describe('at the end of the round', () => {
            it('draws you a new card', () => {
                cy.get('[data-cy="round-number"]', { timeout: 20000 }).should('contain', '2');
                cy.get('[data-cy="my-cards"] [data-cy="card-wrapper"]', { timeout: 20000 }).should('have.length', 6);
            });
        });
    });
});
