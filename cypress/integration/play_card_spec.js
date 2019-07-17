describe('Play card', () => {
    beforeEach(() => {
        cy.login('username');
    });

    describe('when first player has played card and word', () => {
        it('is prompted to play a card', () => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.startGame();
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                .then(() => {
                    cy.get('[data-cy="play-card"]').should('exist');
                });
            });
        });
    });
});
