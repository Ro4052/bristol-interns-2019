const url = Cypress.config().baseUrl;

describe('Lobby', () => {
    beforeEach(() => cy.login('unicorn'));

    describe('when a player has successfully logged in', () => {
        it('is able to create a new room and is then added to that room', () => {
            cy.createRoom();
            cy.get('[data-cy="single-room"]').should('exist');
            cy.get('[data-cy="player-username"]').first().should('have.text', 'unicorn');
        });

        it('is not able to create a room twice', () => {
            cy.createRoom();
            cy.get('[data-cy="single-room"]').first().should('exist');
            cy.get('[data-cy="current-rooms"]').children().its('length').should('equal', 1);
        });

        it('is able to join an existing room', () => {
            cy.createRoom();
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.get('[data-cy="room-title"]'))
            .then(($title) => {
                const id = $title.text().split(" ")[1];
                return cy.request(`http://localhost:12346/joinRoom?roomId=${id}&url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            })
            .then(() => {
                cy.get('[data-cy="player-username"]').first().should('have.text', 'unicorn');
                cy.get('[data-cy="player-username"]').last().should('have.text', 'halfling');
            });
        });
    });

    describe('when a whole game has been played', () => {
        it('redirects back to the lobby', () => {
            cy.createRoom();
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.get('[data-cy="room-title"]'))
            .then(($title) => {
                const id = $title.text().split(" ")[1];
                return cy.request(`http://localhost:12346/joinRoom?roomId=${id}&url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            })
            .then(() => {
                cy.startGame();
                return cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            })
            .then(() => {
                cy.playCard();
                cy.voteCard();
                cy.wait(500);
                return cy.request(`http://localhost:12346/playCard?url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            })
            .then(() => {
                cy.playCardWord();
                return cy.request(`http://localhost:12346/playCard?url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            })
            .then(() => cy.request(`http://localhost:12346/voteCard?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => {
                cy.wait(500);
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            })
            .then(() => {
                cy.playCard();
                cy.voteCard();
                cy.wait(500);
                cy.newGame();
                cy.url().should('include', '/lobby');
            })
        });
    });
});
