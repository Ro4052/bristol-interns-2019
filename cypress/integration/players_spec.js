describe('Players', () => {
    describe('on login', () => {
        it('your name appears in the players list', () => {
            cy.login('player1');
            cy.get('[data-cy="player-username"]').first().should('have.text', 'player1');
        });
        it('displays the initial scores of zero', () => {
            cy.login('player1');
            cy.get('[data-cy="player-score"]').first().should('have.text', '0');
            cy.get('[data-cy="player-score"]').last().should('have.text', '0');
        });
        it('displays the players who have already joined', () => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.login('player1');
                cy.get('[data-cy="player-username"]').first().should('have.text', 'halfling');
                cy.get('[data-cy="player-username"]').last().should('have.text', 'player1');
            });
        });
    });

    describe('on another player log in', () => {
        it('their name is added to the players list', () => {
            cy.login('player1');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.get('[data-cy="player-username"]').first().should('have.text', 'player1');
                cy.get('[data-cy="player-username"]').last().should('have.text', 'halfling');
            });
        });
    });

    describe('on completing a round', () => {
        it('updates the scores', () => {
            cy.login('player1');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.startGame();
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                .then(() => {
                    cy.playCard();
                    cy.voteCard();
                    cy.get('[data-cy="player-score"]').first().should('have.text', '2');
                    cy.get('[data-cy="player-score"]').last().should('have.text', '0');
                });
            });
        });
    });
});
