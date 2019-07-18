describe('The Auth Page', function () {
    describe("if you aren't authorised", function () {
        it('stops you getting to /dashboard', function () {
            cy.visit('/dashboard');
            cy.url().should('eq', Cypress.config().baseUrl);
        });
    });

    describe('if already logged in', function () {
        it('sends you to dashboard if you try to return to login', function() {
            cy.route({
                method: 'POST',
                url: '/auth/login'
            }).as('login');
            cy.login('unicorn');
            cy.wait('@login').then(() => {
                cy.visit('/');
                cy.url().should('include', '/dashboard');
            })
        });
    });
});
