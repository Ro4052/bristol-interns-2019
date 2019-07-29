const url = Cypress.config().baseUrl;

describe('Logout', () => {
    beforeEach(() => cy.login('player1'));

    describe('on click logout button', () => {
        beforeEach(() => cy.logout());

        it('redirects to the login page', () => {
            cy.url().should('eq', Cypress.config().baseUrl);
        });
    });

    describe("if a player in a room logs out before game has started", () => {
        beforeEach(() => {
            cy.createRoom();
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.request(`http://localhost:12346/logout?url=${encodeURIComponent(url)}`));
        });

        it('removes them from the room', () => {
            cy.get('[data-cy="room-players"]').children().should('have.length', 1);
            cy.get('[data-cy="player-username"]').contains('player1');
            cy.get('[data-cy="player-username"]').should('not.contain', 'halfling');
        });
    });
});
