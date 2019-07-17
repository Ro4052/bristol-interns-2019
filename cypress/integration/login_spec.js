import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { logIn, logInSuccess, logInFailure } from '../../src/store/playerActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const username = 'unicorn';

describe('The Login Page', function () {
    describe('on login', () => {
        it('should set a cookie', function () {
            cy.login(username);
            cy.getCookie('username').should('exist');
        });
        it('dispatches a log in success action if user has succesfully logged in', function () {
            // Initialise mockstore with empty state
            const initialState = {cookie: null};
            const store = mockStore(initialState);

            // Initialise a cypress server to stub the login request
            cy.server();
            cy.route({
                method: 'POST',
                url: '/auth/login'
            }).as('login');
            cy.login(username);

            store.dispatch(logIn(username));
            cy.wait('@login').then(() => {
                const actions = store.getActions();
                expect(actions[0].type).to.equal(logInSuccess().type);
            });
        });
        it('dispatches a log in failure action if user cannot log in', function () {
            // Initialise mockstore with empty state
            const initialState = {cookie: null};
            const store = mockStore(initialState);

            // Connect a user to occupy a username
            cy.request('POST', '/auth/login', { username }).then(() => {
                // Initialise a cypress server to stub the login request
                cy.server();
                cy.route({
                    method: 'POST',
                    url: '/auth/login'
                }).as('login');
                // Log in with the same username
                cy.login(username)
                store.dispatch(logIn(username));
                cy.wait('@login').then(() => {
                    const actions = store.getActions();
                    expect(actions[0].type).to.equal(logInFailure().type);
                });
            })
        });
    });

    describe('on username already exists', function() {
        it('returns error', function () {
            cy.request('POST', '/auth/login', { username });
            cy.login(username);
            cy.get('[data-cy="login-error"]').should('contain', 'Username already exists');
        });
    });

    describe('on game already started', function() {
        it('displays an error', function () {
            /* Connect a second user using our fake client */
            const url = Cypress.config().baseUrl;
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
