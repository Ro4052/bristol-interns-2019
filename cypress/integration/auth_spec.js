// if authorised, should be redirected to the dashboard
describe('The Auth Page', function () {
    describe('No auth cookie', function () {
        it('stops you getting to /dashboard', function () {
            cy.visit('/dashboard');
            // we should not be redirected to /dashboard
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
