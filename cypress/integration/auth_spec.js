describe('The Auth Page', function () {
    describe("if you aren't authorised", function () {
        it('stops you getting to /dashboard', function () {
            cy.visit('/dashboard');
            cy.url().should('eq', Cypress.config().baseUrl);
        }); 
    });

    describe('auth cookie', function () {
        beforeEach(function() {
            cy.login('jane');
        });
        it('sends you to dashboard', function() {
            cy.visit('/dashboard');
            cy.url().should('include', '/dashboard');
        });
    });
});
