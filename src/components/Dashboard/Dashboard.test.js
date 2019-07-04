import React from 'react';
import { Dashboard } from './Dashboard';
import { shallow, mount } from 'enzyme';

const initialGameState = {
    started: false,
    roundNum: 0,
    currentPlayer: null,
    players: []
};

const firstRoundGameState = {
    started: true,
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
        const wrapper = shallow(<Dashboard gameState={initialGameState} />);
        expect(wrapper.exists('#current-player')).toEqual(false);
    });
    it("doesn't display the round number", () => {
        const wrapper = shallow(<Dashboard gameState={initialGameState} />);
        expect(wrapper.exists('#round-number')).toEqual(false);
    });
    it("doesn't display the end turn button", () => {
        const wrapper = shallow(<Dashboard gameState={initialGameState} />);
        expect(wrapper.exists('button#end-turn')).toEqual(false);
    });
    it("doesn't display any players", () => {
        const wrapper = shallow(<Dashboard gameState={initialGameState} />);
        expect(wrapper.find('ul#players').children().length).toEqual(0);
    });
    it("displays the start game button", () => {
        const wrapper = shallow(<Dashboard gameState={initialGameState} />);
        expect(wrapper.exists('button#start-game')).toEqual(true);
    });
    describe('on clicking the start game button', () => {
        it('calls startGame', () => {
            const spy = jest.spyOn(Dashboard.prototype, 'startGame');
            const wrapper = shallow(<Dashboard gameState={initialGameState} />);
            wrapper.find('button#start-game').simulate('click');
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});

describe('on start of game', () => {
    it('displays the current players username', () => {
        const wrapper = shallow(<Dashboard gameState={firstRoundGameState} />);
        expect(wrapper.find('#current-player').text()).toEqual('player1');
    });
    it('displays the correct round number', () => {
        const wrapper = shallow(<Dashboard gameState={firstRoundGameState} />);
        expect(wrapper.find('#round-number').text()).toEqual('1');
    });
    it("doesn't display the start game button", () => {
        const wrapper = shallow(<Dashboard gameState={firstRoundGameState} />);
        expect(wrapper.exists('#start-game')).toEqual(false);
    });
});

describe('before you have finished your turn', () => {
    // TODO: Setup state for these tests
    it('displays the end turn button', () => {
        const wrapper = shallow(<Dashboard gameState={firstRoundGameState} />);
        expect(wrapper.exists('button#end-turn')).toEqual(true);
    });
    describe('on clicking the end turn button', () => {
        it('calls endTurn', () => {
            const spy = jest.spyOn(Dashboard.prototype, 'endTurn');
            const wrapper = shallow(<Dashboard gameState={firstRoundGameState} />);
            wrapper.find('button#end-turn').simulate('click');
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});

describe('after you have finished your turn', () => {
    it("doesn't display the end turn button", () => {
        const wrapper = shallow(<Dashboard gameState={initialGameState} />);
        expect(wrapper.exists('button#end-turn')).toEqual(false);
    });
});