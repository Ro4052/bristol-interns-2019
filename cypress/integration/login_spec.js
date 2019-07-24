const url = Cypress.config().baseUrl;
const username = 'unicorn';

describe('Login', () => {
    describe('on login', () => {
        it('should set a cookie', () => {
            cy.login(username);
            cy.getCookie('username').should('exist');
        });
    });

    describe('on username already exists', () => {
        it('returns error', () => {
            cy.request('POST', '/auth/login', { username })
            .then(() => cy.login(username));
            cy.get('[data-cy="login-error"]').should('contain', 'Username already exists');
        });
    });
});
