import React from 'react';
import { mount } from 'enzyme';
import { Room } from './Room';

const room = {
    id: 0,
    players: ["unicorn", "halfling"]
};

describe('on created room', () => {

    it('displays the room id', () => {
        const wrapper = mount(<Room room={room} />);
        expect(wrapper.find({ 'data-cy': 'room-title' }).text()).toEqual("Room: 0");
    });

    it('displays the correct players', () => {
        const wrapper = mount(<Room room={room} />);
        expect(wrapper.find({ 'data-cy': 'player-username' }).at(0).text()).toEqual(room.players[0]);
        expect(wrapper.find({ 'data-cy': 'player-username' }).at(1).text()).toEqual(room.players[1]);
    })
   /* TODO: moxios when createRoom is moved into actions */
});
