// if authorised, should be redirected to the dashboard

describe('No auth cookie', function () {
    it('stops you getting to /dashboard', function () {
        cy.visit('/dashboard');
        // we should not be redirected to /dashboard
        cy.url().should('eq', Cypress.config().baseUrl);
    }); 
});

describe('auth cookie', function () {
    beforeEach(function() {
        cy.visit('/');
        const username = 'jane'
        cy.get('input').type(username)
        cy.get('button').click() 
    });
    it('sends you to dashboard', function() {
        cy.visit('/dashboard');
        cy.url().should('include', '/dashboard');
    });
});