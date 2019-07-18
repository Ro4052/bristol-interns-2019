describe('The Dashboard Page', function () {
    beforeEach(() => {
        cy.route({
            method: "POST",
            url: "/auth/login",
        }).as('login');
        cy.login('unicorn');
        cy.wait('@login').then(() => {
            cy.url().should('include', '/dashboard');
            cy.get('[data-cy="player-username"]').first().should('have.text', 'unicorn');
        });
    });

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
            cy.route({
                method: "GET",
                url: "/api/start",
            }).as('start');
            cy.startGame();
            cy.wait('@start').then(() => {
                cy.get('[data-cy="round-number"]').should('exist');
                cy.get('[data-cy="current-player"]').should('exist');
                cy.get('[data-cy="current-word"]').should('not.exist');
            })
        });
    });
});
