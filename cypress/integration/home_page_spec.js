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
            
        });
        it('returns error', function () {
            /* Connect a second user using our fake client */
            const url = Cypress.config().baseUrl;
            cy
            .request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => {
                cy.request(`http://localhost:12346/startGame?url=${encodeURIComponent(url)}`)
                .then(() => {
                    cy.login(username);
                    cy.get('h3').should('contain', 'Game has already started');
                });
            }); 
        });
    });
});
