const username = 'jane';

describe('The Login Page', function () {
    describe('on login', () => {
        it('should set a cookie', function () {
            cy.login(username);
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
