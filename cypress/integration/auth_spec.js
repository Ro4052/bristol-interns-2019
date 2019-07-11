describe('The Auth Page', function () {
    describe("if you aren't authorised", function () {
        it('stops you getting to /dashboard', function () {
            cy.visit('/dashboard');
            cy.url().should('eq', Cypress.config().baseUrl);
        }); 
    });
    describe('auth cookie', function () {
        beforeEach(function() {
            cy.visit('/');
            const username = 'jane';
            cy.get('input').type(username);
            cy.get('button').click() ;
        });
        afterEach(() => {
            cy.request({
                url: '/api/reset-server',
                method: 'POST'
            });
            cy.visit('/');
        });
        it('sends you to dashboard', function() {
            cy.visit('/dashboard');
            cy.url().should('include', '/dashboard');
        });
    });
});
