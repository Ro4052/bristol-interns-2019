const url = Cypress.config().baseUrl;

describe('My Cards', () => {
    beforeEach(() => {
        cy.login('unicorn');
        cy.createRoom();
        cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
        .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`));
    });
    
    describe('when the game has started', () => {
        beforeEach(() => cy.startGame());
        it("displays the correct number of cards", () => {
            cy.get('[data-cy="my-cards"]').children().its('length').should('eq', 3);
        });
    });    
});
