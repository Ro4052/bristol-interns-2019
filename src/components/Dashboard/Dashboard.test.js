import React from 'react';
import { mount } from 'enzyme';
import Dashboard from './Dashboard';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as loginActions from '../Login/LoginActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
    authReducer: {},
    chatReducer: {
        messages: []
    },
    dashboardReducer: {
        currentPlayer: {}
    },
    gameOverReducer: {
        winners: []
    },
    myCardsReducer: {},
    playWordReducer: {},
    playedCardsReducer: {
        cards: []
    },
    playersReducer: {
        players: []
    },
    timerReducer: {}
});

describe('Dashboard', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);
    const authenticateUserSpy = jest.spyOn(loginActions, 'authenticateUser');

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on empty state render', () => {
        it('calls authenticateUser', () => {
            expect(authenticateUserSpy).toHaveBeenCalled();
        });

        it("doesn't display MyCards", () => {
            expect(wrapper.exists({ 'data-cy': 'my-cards' })).toEqual(false);
        });

        it("doesn't display PlayedCards", () => {
            expect(wrapper.exists({ 'data-cy': 'played-cards' })).toEqual(false);
        });
    });
});
