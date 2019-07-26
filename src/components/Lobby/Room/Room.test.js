import React from 'react';
import { shallow, mount } from 'enzyme';
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
    describe('if in room', () => {
        it('displays the start game button', () => {
            const wrapper = shallow(<Room room={readyToStart} username='player1' />);
            expect(wrapper.exists(StartGame)).toEqual(true);
        });
    });

    describe('if not in room', () => {
        it('displays the start game button', () => {
            const wrapper = shallow(<Room room={readyToStart} username='player3' />);
            expect(wrapper.exists(StartGame)).toEqual(false);
        });
    });
});

describe('if not enough players and not started', () => {
    it("doesn't display the start button", () => {
        const wrapper = shallow(<Room room={notEnoughPlayers} />);
        expect(wrapper.exists(StartGame)).toEqual(false);
    });
    
    it('shows how many players are needed', () => {
        const wrapper = shallow(<Room room={notEnoughPlayers} />);
        expect(wrapper.find({ 'data-cy': 'players-needed' }).text()).toContain('1');
    });
});

describe('if already started', () => {
    it("doesn't display the start button", () => {
        const wrapper = shallow(<Room room={alreadyStarted} />);
        expect(wrapper.exists(StartGame)).toEqual(false);
    });

    it("doesn't show waiting for players", () => {
        const wrapper = shallow(<Room room={alreadyStarted} />);
        expect(wrapper.exists({ 'data-cy': 'players-needed' })).toEqual(false);
    });

    it("doesn't display the join or leave room buttons", () => {
        const wrapper = mount(<Room room={alreadyStarted} />);
        expect(wrapper.exists({ 'data-cy': 'join-room' })).toEqual(false);
        expect(wrapper.exists({ 'data-cy': 'leave-room' })).toEqual(false);
    });
});

describe('if not started and not in room', () => {
    it('displays the join room button', () => {
        const wrapper = mount(<Room room={notEnoughPlayers} username="player2" />);
        expect(wrapper.exists({ 'data-cy': 'join-room' })).toEqual(true);
    });

    it("doesn't display the leave room button", () => {
        const wrapper = mount(<Room room={notEnoughPlayers} username="player2" />);
        expect(wrapper.exists({ 'data-cy': 'leave-room' })).toEqual(false);
    });

    describe('on click the join room button', () => {
        it('calls joinRoom', () => {
            const joinRoom = jest.fn();
            const wrapper = mount(<Room room={notEnoughPlayers} username="player2" joinRoom={joinRoom} />);
            wrapper.find({ 'data-cy': 'join-room' }).simulate('click');
            expect(joinRoom).toHaveBeenCalled();
            joinRoom.mockRestore();
        });
    });
});

describe('if not started and in room', () => {
    it('displays the leave room button', () => {
        const wrapper = mount(<Room room={notEnoughPlayers} username="player1" />);
        expect(wrapper.exists({ 'data-cy': 'leave-room' })).toEqual(true);
    });

    it("doesn't display the join room button", () => {
        const wrapper = mount(<Room room={readyToStart} username="player2" />);
        expect(wrapper.exists({ 'data-cy': 'join-room' })).toEqual(false);
    });

    describe('on click the leave room button', () => {
        it('calls leaveRoom', () => {
            const leaveRoom = jest.fn();
            const wrapper = mount(<Room room={notEnoughPlayers} username="player1" leaveRoom={leaveRoom} />);
            wrapper.find({ 'data-cy': 'leave-room' }).simulate('click');
            expect(leaveRoom).toHaveBeenCalled();
            leaveRoom.mockRestore();
        });
    });
});
