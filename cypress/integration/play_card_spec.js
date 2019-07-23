describe('Play card', () => {
    beforeEach(() => {
        cy.login('unicorn')
        cy.createRoom();
    });

    describe('when first player has played card and word', () => {
        it('is prompted to play a card', () => {
            cy.request({
                method: 'GET',
                url: `http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`,
                followRedirect: false
            }).then(() => {
                cy.startGame();
                cy.request({
                    method: 'GET',
                    url: `http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`,
                    followRedirect: false
                }).then(() => {
                    cy.get('[data-cy="play-card"]').should('exist');
                });
            });
            
        });
    });
});
