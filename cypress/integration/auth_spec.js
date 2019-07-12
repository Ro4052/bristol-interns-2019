describe('The Auth Page', function () {
    describe("if you aren't authorised", function () {
        it('stops you getting to /dashboard', function () {
            cy.visit('/dashboard');
            cy.url().should('eq', Cypress.config().baseUrl);
        }); 
    });

    describe('if already logged in', function () {
        beforeEach(function() {
            cy.login('jane');
        });
        it('sends you to dashboard if you try to return to login', function() {
            cy.visit('/');
            cy.url().should('include', '/dashboard');
        });
    });
});
