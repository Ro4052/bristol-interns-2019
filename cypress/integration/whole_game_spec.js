const url = Cypress.config().baseUrl;

describe('Whole game', () => {
    describe('when there is a draw', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password')
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=1&url=${encodeURIComponent(url)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 20000 }));
        });
        it('displays the drawers', () => {
            cy.get('[data-cy="drawers"]').should('exist');
            cy.get('[data-cy="winner"]').should('not.exist');
        });
    });

    describe('when there is a winner', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password')
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=1&url=${encodeURIComponent(url)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.playCardWord())
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 20000 }));
        });

        it('displays the winner', () => {
            cy.get('[data-cy="winner"]').should('exist');
            cy.get('[data-cy="drawers"]').should('not.exist');
        });
    });

    describe('on gameover and click back to lobby', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password')
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=0&url=${encodeURIComponent(url)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 20000 }))
            .then(() => cy.newGame());
        });

        it('redirects back to the lobby', () => {
            cy.url().should('include', '/lobby');
        });

        it('can create a new room', () => {
            cy.createRoom(3);
        });

        it('can join an existing room', () => {
            cy.request(`http://localhost:12346/createRoom?rounds=3&url=${encodeURIComponent(url)}`)
            .then(() => cy.joinRoom());
        });

        it('can logout', () => {
            cy.logout();
            cy.url().should('eq', Cypress.config().baseUrl);
        });

        it('can start a new game and the data has been reset', () => {
            cy.request(`http://localhost:12346/createRoom?rounds=3&url=${encodeURIComponent(url)}`)
            .then(() => cy.joinRoom());
            cy.startGame();
            
        });
    });
});
