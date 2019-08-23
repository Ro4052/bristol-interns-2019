describe('Auth', () => {
    describe("if you aren't authorised", () => {
        it('stops you getting to /dashboard', () => {
            cy.visit('/dashboard');
            cy.url().should('eq', Cypress.config().baseUrl);
        });
    });

    describe('if already logged in', () => {
        it('sends you to lobby if you try to return to login', () => {
            cy.signup('unicorn', 'password');
            cy.visit('/');
            cy.url().should('include', '/lobby');
        });
    });
});
