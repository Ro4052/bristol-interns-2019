const url = Cypress.config().baseUrl;

describe('Dashboard', () => {
    beforeEach(() => {
        cy.login('unicorn'); 
        cy.createRoom(3);
        cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
        .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`));
    });

    describe('before start of game', () => {
        it("should display start button and shouldn't display any round information", () => {
            cy.get('[data-cy="start-game"]').should('exist');
            cy.get('[data-cy="round-number"]').should('not.exist');
            cy.get('[data-cy="current-word"]').should('not.exist');
        });
    });

    describe('after start of game', () => {
        beforeEach(() => cy.startGame());
        it("should hide start button and display the round information", () => {
            cy.get('[data-cy="start-game"]').should('not.exist');
            cy.get('[data-cy="round-number"]').should('exist');
            cy.get('[data-cy="current-word"]').should('not.exist');
        });
    });
});
