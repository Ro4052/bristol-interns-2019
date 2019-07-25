import React from 'react';
import { shallow } from 'enzyme';
import { Room } from './Room';
import StartGame from '../../StartGame/StartGame';

const emptyRoom = { roomId: 0, players: [], minPlayers: 0, started: false };
const notEnoughPlayers = { roomId: 0, players: [{ username: "player1" }], minPlayers: 2, started: false };
const readyToStart = { roomId: 0, players: [{ username: "player1" }, { username: "player2" }], minPlayers: 2, started: false };
const alreadyStarted = { roomId: 0, players: [{ username: "player1" }, { username: "player2" }], minPlayers: 2, started: true };

describe('on render', () => {
    it('displays the room id', () => {
        const wrapper = shallow(<Room room={emptyRoom} />);
        expect(wrapper.find({ 'data-cy': 'room-title' }).text()).toEqual('Room: 0');
    });
});

describe('on empty list of players', () => {
    it('displays no players', () => {
        const wrapper = shallow(<Room room={emptyRoom} />);
        expect(wrapper.find({ 'data-cy': 'room-players' }).children().length).toEqual(0);
    });
});

describe('on given list of players', () => {
    it('displays correct number of players', () => {
        const wrapper = shallow(<Room room={notEnoughPlayers} />);
        expect(wrapper.find({ 'data-cy': 'room-players' }).children().length).toEqual(1);
    });

    it('displays their usernames', () => {
        const wrapper = shallow(<Room room={notEnoughPlayers} />);
        expect(wrapper.find({ 'data-cy': 'player-username' }).first().text()).toEqual('player1');
    });
});

describe('on not started and enough players', () => {
    // TODO: Only if you've joined the room
    it('displays the start game button', () => {
        const wrapper = shallow(<Room room={readyToStart} />);
        expect(wrapper.exists(StartGame)).toEqual(true);
    });
});

describe('if not enough players and not started', () => {
    it("doesn't display the start button", () => {
        const wrapper = shallow(<Room room={notEnoughPlayers} />);
        expect(wrapper.exists(StartGame)).toEqual(false);
    });
    
    it('shows how many players are needed', () => {
        // TODO
    });
});

describe('if already started', () => {
    it("doesn't display the start button", () => {
        const wrapper = shallow(<Room room={alreadyStarted} />);
        // expect(wrapper.exists(StartGame)).toEqual(false);
    });

    it("doesn't show waiting for players", () => {
        const wrapper = shallow(<Room room={alreadyStarted} />);
        // TODO
    });

    it("doesn't display the join or leave room buttons", () => {
        const wrapper = shallow(<Room room={alreadyStarted} />);
        // TODO
    });
});

describe('if not started and not in room', () => {
    it('displays the join room button', () => {
        const wrapper = shallow(<Room room={emptyRoom} username="player1" />);
        // TODO
    });

    describe('on click the join room button', () => {
        it('calls joinRoom', () => {
            const wrapper = shallow(<Room room={emptyRoom} username="player1" />);
            // TODO
        });
    });
});

describe('if not started and in room', () => {
    it('displays the leave room button', () => {
        const wrapper = shallow(<Room room={notEnoughPlayers} username="player1" />);
        // TODO
    });

    describe('on click the leave room button', () => {
        it('calls leaveRoom', () => {
            const wrapper = shallow(<Room room={notEnoughPlayers} username="player1" />);
            // TODO
        });
    });
});
