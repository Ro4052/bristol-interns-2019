describe('The Home Page', function() {
    it('successfully loads', function() {
      cy.visit('/') // change URL to match your dev URL
    });
});
describe('The Login Page', function () {
    afterEach(() => {
    cy.request({
        url: '/api/reset-server',
        method: 'GET'
    });
    cy.visit('/');
    })
    it('sets auth cookie when logging in via form submission', function () {
    // destructuring assignment of the this.currentUser object
    const username = 'jane';

    cy.get('input').type(username);
    cy.get('button').click();

    // we should be redirected to /dashboard
    cy.url().should('include', '/dashboard');

    // our auth cookie should be present
    cy.getCookie('username').should('exist');

    // UI should reflect this user being logged in
    cy.get('#players').should('contain', 'jane');
    });
});
describe('Username already exists', function() {
    afterEach(() => {
        cy.request({
            url: '/api/reset-server',
            method: 'GET'
        });
        cy.visit('/');
        });
    it('returns error', function () {
        const username = 'Jane'
        cy.request('POST', '/auth/login', { username: 'Jane' });
        cy.get('input').type(username);
        cy.get('button').click();
        cy.get('h3').should('contain', 'Username already exists');
    });
});
describe('Game already started', function() {
    afterEach(() => {
        cy.request({
            url: '/api/end',
            method: 'GET'
        });
        cy.visit('/');
        });
    beforeEach(() => {
        /* Connect a second user using our fake client */
        const url = Cypress.config().baseUrl;
        cy.request(`http://localhost:8081/connect?url=${encodeURIComponent(url)}`);
        cy.visit('/');
        });
    it('returns error', function () { 
        const username = 'Jane';
        cy.get('input').type(username);
        cy.get('button').click();
        cy.get('h3').should('contain', 'Game has already started');
    });
});