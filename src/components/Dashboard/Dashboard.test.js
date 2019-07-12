import React from 'react';
import { Dashboard } from './Dashboard';
import { shallow } from 'enzyme';

const initialGameState = {
    status: "NOT_STARTED",
    roundNum: 0,
    currentPlayer: null,
    players: [],
    currentWord: ''
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
        expect(wrapper.exists({ 'data-cy': 'current-player' })).toEqual(false);
    });
    it("doesn't display the round number", () => {
        const wrapper = shallow(<Dashboard status={initialGameState.status} />);
        expect(wrapper.exists({ 'data-cy': 'round-number' })).toEqual(false);
    });
    it("doesn't display the current word", () => {
        const wrapper = shallow(<Dashboard currentWord={initialGameState.currentWord} />);
        expect(wrapper.exists('#message')).toEqual(false);
    });
    it("displays the start game button", () => {
        const wrapper = shallow(<Dashboard status={initialGameState.status}/>);
        expect(wrapper.exists({ 'data-cy': 'start-game' })).toEqual(true);
    });
    describe('on clicking the start game button', () => {
        it('calls startGame', () => {
            const spy = jest.spyOn(Dashboard.prototype, 'startGame');
            const wrapper = shallow(<Dashboard status={initialGameState.status}/>);
            wrapper.find({ 'data-cy': 'start-game' }).simulate('click');
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});

describe('on start of game', () => {
    it("displays the current player's username", () => {
        const wrapper = shallow(<Dashboard status={firstRoundGameState.status} currentPlayer={firstRoundGameState.currentPlayer} />);
        expect(wrapper.find({ 'data-cy': 'current-player' }).text()).toEqual('player1');
    });
    it('displays the correct round number', () => {
        const wrapper = shallow(<Dashboard status={firstRoundGameState.status} roundNum={firstRoundGameState.roundNum}/>);
        expect(wrapper.find({ 'data-cy': 'round-number' }).text()).toEqual('1');
    });
    it('displays the correct word', () => {
        const wrapper = shallow(<Dashboard currentWord={"Freedom"}/>);
        expect(wrapper.find({ 'data-cy': 'current-word' }).text()).toEqual("Freedom");
    });
    it("doesn't display the start game button", () => {
        const wrapper = shallow(<Dashboard status={firstRoundGameState.status} />);
        expect(wrapper.exists({ 'data-cy': 'start-game' })).toEqual(false);
    });
});