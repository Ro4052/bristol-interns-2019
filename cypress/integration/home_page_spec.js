const username = 'jane';

describe('The Login Page', function () {
    it('sets auth cookie when logging in via form submission', function () {
    // destructuring assignment of the this.currentUser object
    cy.login(username);

    // we should be redirected to /dashboard
    cy.url().should('include', '/dashboard');

    // our auth cookie should be present
    cy.getCookie('username').should('exist');

    // UI should reflect this user being logged in
    cy.get('#players').should('contain', 'jane');
    });
})
describe('Username already exists', function() {
    it('returns error', function () {
        cy.request('POST', '/auth/login', { username });
        cy.login(username);
        cy.get('h3').should('contain', 'Username already exists');
    })
})
// TO BE COMPLETED IN A TIC
// describe('Game already started', function() {
//     afterEach(() => {
//         cy.request({
//             url: '/api/end',
//             method: 'GET'
//         });
//         cy.visit('/');
//         });
//     it('returns error', function () { 
//         const username = 'Jane'
//         cy.request('POST', '/auth/login', { username: 'Blane' });
//         cy.
//         cy.get('input').type(username);
//         cy.get('button').click();
//         cy.get('h3').should('contain', 'Game has already started');
//     });
// });
