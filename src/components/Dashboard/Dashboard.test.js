import React from 'react';
import { Dashboard } from './Dashboard';
import { shallow } from 'enzyme';

const initialGameState = {
    status: "NOT_STARTED",
    roundNum: 0,
    currentPlayer: null,
    players: []
};

const firstRoundGameState = {
    status: "WAITING_FOR_CURRENT_PLAYER",
    roundNum: 1,
    currentPlayer: {
        username: 'player1'
    },
    players: [
        { username: 'player1' },
        { username: 'player2' }
    ],
    myTurn: true
};

describe('on initial render', () => {
    it("doesn't display the current player", () => {
        const wrapper = shallow(<Dashboard status={initialGameState.status} />);
        expect(wrapper.exists('#current-player')).toEqual(false);
    });
    it("doesn't display the round number", () => {
        const wrapper = shallow(<Dashboard status={initialGameState.status} />);
        expect(wrapper.exists('#round-number')).toEqual(false);
    });
});

describe('on start of game', () => {
    it('displays the current players username', () => {
        const wrapper = shallow(<Dashboard status={firstRoundGameState.status} currentPlayer={firstRoundGameState.currentPlayer} />);
        expect(wrapper.find('#current-player').text()).toEqual('player1');
    });
    it('displays the correct round number', () => {
        const wrapper = shallow(<Dashboard status={firstRoundGameState.status} roundNum={firstRoundGameState.roundNum}/>);
        expect(wrapper.find('#round-number').text()).toEqual('1');
    });
    it("doesn't display the start game button", () => {
        const wrapper = shallow(<Dashboard status={firstRoundGameState.status} />);
        expect(wrapper.exists('#start-game')).toEqual(false);
    });
});

describe('after you have played your turn', () => {
    it("doesn't display the end turn button", () => {
        const wrapper = shallow(<Dashboard />);
        expect(wrapper.exists('button#end-turn')).toEqual(false);
    });
});