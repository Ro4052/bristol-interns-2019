const username = 'Jane';

describe('The Login Page', function () {
    describe('on login', () => {
        it('should set a cookie', function () {
            cy.login('username');
            cy.url().should('include', '/dashboard');
            cy.getCookie('username').should('exist');
        });
    });

    describe('on username already exists', function() {
        it('returns error', function () {
            cy.request('POST', '/auth/login', { username });
            cy.login(username);
            cy.get('h3').should('contain', 'Username already exists');
        });
    });

    describe('on game already started', function() {
        beforeEach(() => {
            /* Connect a second user using our fake client */
            const url = Cypress.config().baseUrl;
            cy.request(`http://localhost:12346/connect-and-play?url=${encodeURIComponent(url)}`);
        });
        it('returns error', function () { 
            cy.login(username);
            cy.get('h3').should('contain', 'Game has already started');
        });
    });
});
