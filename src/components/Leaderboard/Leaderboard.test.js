import React from 'react';
import Leaderboard from './Leaderboard';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as leaderboardActions from './LeaderboardActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
    leaderboardReducer: {
        players: [
            { id: 1, username: "unicorn" },
            { id: 2, username: "halfling" }
        ]
    }
});

describe('Leaderboard', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);
    const getPlayersSpy = jest.spyOn(leaderboardActions, 'getPlayers');

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <Leaderboard />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on render', () => {
        it('dispatches getPlayers', () => {
            expect(getPlayersSpy).toHaveBeenCalled();
        });
    });

    describe('if given a list of players', () => {
        it('displays the correct usernames and scores', () => {
            expect(wrapper.find({ 'data-cy': 'player-row' }).length).toEqual(2);
        });
    });
});
