const username = 'halfling';

describe('Login', () => {
    describe('on login', () => {
        it('should set a cookie', () => {
            cy.login(username);
            cy.getCookie('username').should('exist');
        });
    });

    // TODO: Comment back in when we implement authentication
    describe('on username already exists', () => {
        it('returns error', () => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.login(username));
            cy.get('[data-cy="login-error"]').should('contain', 'A user with this username is currently in the game');
        });
    });
});
