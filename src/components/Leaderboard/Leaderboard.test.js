import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Leaderboard } from './Leaderboard';

const middlewares = [];
const mockStore = configureStore(middlewares);

const players = [
    { id: 1, username: "unicorn" },
    { id: 2, username: "halfling" }
];

const emptyState = { leaderboardReducer: { players: [] } };
const emptyStore = mockStore(emptyState);

describe('if given an empty list of players', () => {
    it('displays no players', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Leaderboard getPlayers={jest.fn()} players={[]} />
            </Provider>
        );
        expect(wrapper.find({ 'data-cy': 'player-row' }).length).toEqual(0);
    });
});

describe('if given a list of players', () => {
    it('displays the correct usernames and scores', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Leaderboard getPlayers={jest.fn()} players={players} />
            </Provider>
        );
        expect(wrapper.find({ 'data-cy': 'player-row' }).length).toEqual(2);
    });
});
