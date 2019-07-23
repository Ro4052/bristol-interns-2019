describe('Auth', () => {
    describe("if you aren't authorised", () => {
        it('stops you getting to /dashboard', () => {
            cy.visit('/dashboard');
            cy.url().should('eq', Cypress.config().baseUrl);
        });
    });

    describe('if already logged in', () => {
        it('sends you to dashboard if you try to return to login', () => {
            cy.login('unicorn');
            cy.createRoom();
            cy.visit('/');
            cy.url().should('include', '/lobby');
        });
    });
});
