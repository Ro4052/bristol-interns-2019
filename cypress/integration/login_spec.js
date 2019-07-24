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

    /* At the moment users cannot get that error message from the login page, TODO: move to lobby test after we figure out what to do on trying to join a started game */
    describe.skip('on game already started', () => {
        it('displays an error', () => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => {
                cy.request(`http://localhost:12346/startGame?url=${encodeURIComponent(url)}`)
                .then(() => {
                    cy.login(username);
                    cy.get('[data-cy="login-error"]').should('contain', 'Game has already started');
                });
            }); 
        });
    });
});
