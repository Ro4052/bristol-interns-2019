import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { logIn, logInSuccess, logInFailure } from '../../src/store/playerActions';

const url = Cypress.config().baseUrl;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const username = 'unicorn';

describe('Login', () => {
    describe('on login', () => {
        it('should set a cookie', () => {
            cy.login(username);
            cy.getCookie('username').should('exist');
        });
        it('dispatches a log in success action if user has succesfully logged in', () => {
            const initialState = {cookie: null};
            const store = mockStore(initialState);
            cy.login(username);
            store.dispatch(logIn(username));
            const actions = store.getActions();
            // expect(actions[0].type).to.equal(logInSuccess().type);
        });
        it('dispatches a log in failure action if user cannot log in', () => {
            const initialState = {cookie: null};
            const store = mockStore(initialState);
            cy.request('POST', '/auth/login', { username }).then(() => {
                cy.login(username)
                store.dispatch(logIn(username));
                const actions = store.getActions();
                // expect(actions[0].type).to.equal(logInFailure().type);
            })
        });
    });

    describe('on username already exists', () => {
        it('returns error', () => {
            cy.request('POST', '/auth/login', { username });
            cy.login(username);
            cy.get('[data-cy="login-error"]').should('contain', 'Username already exists');
        });
    });

    describe('on game already started', () => {
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
