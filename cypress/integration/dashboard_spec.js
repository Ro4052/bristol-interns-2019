describe('The Dashboard Page', function () {
    beforeEach(() => {
        cy.login('unicorn'); 
    });

    describe('before start of game', () => {
        it("should display start button and shouldn't display any round information", () => {
            cy.get('#start-game').should('exist');
            cy.get('#round-number').should('not.exist');
            cy.get('#current-player').should('not.exist');
            cy.get('#message').should('not.exist');
        });
    });

    describe('after start of game', () => {
        it("should hide start button and display the round information", () => {
            cy.startGame();
            cy.get('#round-number').should('exist');
            cy.get('#current-player').should('exist');
            cy.get('#message').should('not.exist');
        });
    });
});
