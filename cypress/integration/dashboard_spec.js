describe('Dashboard', () => {
    beforeEach(() => cy.login('unicorn'));

    describe('before start of game', () => {
        it("should display start button and shouldn't display any round information", () => {
            cy.get('[data-cy="start-game"]').should('exist');
            cy.get('[data-cy="round-number"]').should('not.exist');
            cy.get('[data-cy="current-player"]').should('not.exist');
            cy.get('[data-cy="current-word"]').should('not.exist');
        });
    });

    describe('after start of game', () => {
        it("should hide start button and display the round information", () => {
            cy.startGame();
            cy.get('[data-cy="start-game"]').should('not.exist');
            cy.get('[data-cy="round-number"]').should('exist');
            cy.get('[data-cy="current-player"]').should('exist');
            cy.get('[data-cy="current-word"]').should('not.exist');
        });
    });
});
