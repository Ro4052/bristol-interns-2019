describe('Players', () => {
    describe('on login', () => {
        it('your name appears in the players list', () => {
            cy.login('player1');
            cy.get('[data-cy="players-list"]').first().should('have.text', 'player1');
        });
        it('displays the players who have already joined', () => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.login('player1');
                cy.get('[data-cy="players-list"] > li').first().should('have.text', 'halfling');
                cy.get('[data-cy="players-list"] > li').first().next().should('have.text', 'player1');
            });
        });
    });

    describe('on another player log in', () => {
        it('their name is added to the players list', () => {
            cy.login('player1');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.get('[data-cy="players-list"] > li').first().should('have.text', 'player1');
                cy.get('[data-cy="players-list"] > li').first().next().should('have.text', 'halfling');
            });
        });
    });
});
