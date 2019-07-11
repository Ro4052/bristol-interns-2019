const username = 'jane';

describe('The Login Page', function () {
    describe('on login', () => {
        it('should set a cookie', function () {
            cy.login(username);
            cy.url().should('include', '/dashboard');
            cy.getCookie('username').should('exist');
        });
    });

    describe('if username already exists', function() {
        it('should display an error', function () {
            cy.request('POST', '/auth/login', { username });
            cy.login(username);
            cy.get('h3').should('contain', 'Username already exists');
        });
    });
});

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
