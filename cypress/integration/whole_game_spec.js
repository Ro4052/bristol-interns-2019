const url = Cypress.config().baseUrl;

describe('Whole game', () => {
    describe('when a whole game has been played', () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.createRoom();
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => {
                cy.startGame();
                return cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            })
            .then(() => {
                cy.playCard();
                cy.voteCard();
                cy.get('[data-cy="play-word"]');
                cy.playCardWord();
                return cy.request(`http://localhost:12346/playCard?url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            })
            .then(() => cy.request(`http://localhost:12346/voteCard?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => {
                cy.wait(2000);
                return cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            }).then(() => {
                cy.playCard();
                cy.voteCard();
            });
        });
        describe.skip('when there is a draw', () => {
            it('displays the drawers', () => {
                cy.get('[data-cy="drawers"]').should('exist');
                cy.get('[data-cy="winner"]').should('not.exist');
            });
        });
        describe('when there is a winner', () => {
            it('displays the winner', () => {
                cy.get('[data-cy="winner"]').should('exist');
                cy.get('[data-cy="drawers"]').should('not.exist');
            });
        });
        describe('when start new game', () => {
            beforeEach(() => {
                cy.newGame();
            });
            
            it('redirects back to the lobby', () => {
                cy.url().should('include', '/lobby');
            });

            it('can create a new room', () => {
                cy.createRoom();
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
});
