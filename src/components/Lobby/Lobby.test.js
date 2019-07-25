import React from 'react';
import { shallow } from 'enzyme';
import { Lobby } from './Lobby';
import CreateRoom from './CreateRoom/CreateRoom';

const room = {
    roomId: 0,
    players: [
        { username: "unicorn" },
        { username: "halfling" }
    ]
};

describe('on render', () => {
    it('renders a CreateRoom element', () => {
        const wrapper = shallow(<Lobby username='username' rooms={[]}/>);
        expect(wrapper.exists(CreateRoom)).toEqual(true);
    });
});

describe('if given no rooms', () => {
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
