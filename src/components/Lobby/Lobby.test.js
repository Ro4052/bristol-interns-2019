import React from 'react';
import { shallow, mount } from 'enzyme';
import { Lobby } from './Lobby';

const room = {
    roomId: 0,
    players: [
        { username: "unicorn" },
        { username: "halfling" }
    ]
};

describe('on render', () => {
    it('renders a create room button', () => {
        const wrapper = mount(<Lobby username='username' rooms={[]}/>);
        expect(wrapper.exists({ 'data-cy': 'create-room' })).toEqual(true);
    });

    it('renders the list of rooms', () => {
        const wrapper = mount(<Lobby username='username' rooms={[]}/>);
        expect(wrapper.exists({ 'data-cy': 'current-rooms' })).toEqual(true);
    });
});

describe('if given an empty list rooms', () => {
    it('displays no rooms', () => {
        const wrapper = shallow(<Lobby username='username' rooms={[]}/>);
        expect(wrapper.find({ 'data-cy': 'current-rooms' }).children().length).toEqual(0);
    });
});

describe('if given a list of rooms', () => {
    it('displays the correct number of rooms', () => {
        const wrapper = shallow(<Lobby username='username' rooms={[room]}/>);
        expect(wrapper.find({ 'data-cy': 'current-rooms' }).children().length).toEqual(1);
    });
});

describe('on click the create room button', () => {
    it('calls createRoom', () => {
        const createRoom = jest.fn();
        const wrapper = mount(<Lobby username='username' rooms={[]} createRoom={createRoom} />);
        wrapper.find({ 'data-cy': 'create-room' }).simulate('click');
        expect(createRoom).toHaveBeenCalled();
        createRoom.mockRestore();
    });
});
