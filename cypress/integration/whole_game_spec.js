const url = Cypress.config().baseUrl;

describe('Whole game', () => {
    describe('when a whole game has been played', () => {
        beforeEach(() => {
            cy.login('unicorn')
            .then(() => cy.createRoom(3))
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.startGame())
            // Round 1
            .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.get('[data-cy="play-word"]', { timeout: 10000 }))
            // Round 2
            .then(() => cy.playCardWord())
            .then(() => cy.get('[data-cy="vote"]', { timeout: 10000 }))
            .then(() => cy.get('[data-cy="played-cards"]').children().should('not.exist', { timeout: 10000 }))
            // Round 3
            .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 10000 }));
        });

        describe('when there is a winner', () => {
            it('displays the winner', () => {
                cy.get('[data-cy="winner"]').should('exist');
                cy.get('[data-cy="drawers"]').should('not.exist');
            });
        });

        describe('on clicking the new game button', () => {
            beforeEach(() => cy.newGame());

            it('redirects back to the lobby', () => {
                cy.url().should('include', '/lobby');
            });
    
            it('can create a new room', () => {
                cy.createRoom(3);
            });
    
            it('can join an existing room', () => {
                cy.request(`http://localhost:12346/createRoom?url=${encodeURIComponent(url)}`)
                .then(() => cy.joinRoom());
            });
    
            it('can start a new game', () => {
                cy.request(`http://localhost:12346/createRoom?url=${encodeURIComponent(url)}`)
                .then(() => {
                    cy.joinRoom();
                    cy.startGame();
                });
            });
    
            it('can logout', () => {
                cy.logout();
                cy.url().should('eq', Cypress.config().baseUrl);
            });
        });
    });

    describe.skip('when there is a draw', () => {
        it('displays the drawers', () => {
            cy.login('unicorn')
            .then(() => cy.createRoom(2))
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.startGame())
            // Round 1
            .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.get('[data-cy="play-word"]', { timeout: 10000 }))
            // Round 2
            .then(() => cy.playCardWord())
            .then(() => cy.get('[data-cy="vote"]', { timeout: 10000 }))
            .then(() => cy.get('[data-cy="played-cards"]').children().should('not.exist', { timeout: 10000 }))
            // Round 3
            .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 10000 }));
            cy.get('[data-cy="drawers"]').should('exist');
            cy.get('[data-cy="winner"]').should('not.exist');
        });
    });
});
