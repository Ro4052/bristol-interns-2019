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
            .then(() => {
                cy.get('[data-cy="room-title"]').then(($title) => {
                    let id = $title.text().split(" ")[1];
                    cy.request(`http://localhost:12346/joinRoom?roomId=${id}&url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                    .then(() => {
                        cy.get('[data-cy="player-username"]').first().should('have.text', 'unicorn');
                        cy.get('[data-cy="player-username"]').last().should('have.text', 'halfling');
                    });
                });
            })
        });
    });
});
