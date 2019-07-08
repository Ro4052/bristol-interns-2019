import React from 'react';
import { shallow } from 'enzyme';
import { Players } from './Players';

describe('on initial render', () => {
    it("doesn't display any players", () => {
        const wrapper = shallow(<Players allPlayers={[]} />);
        expect(wrapper.find('ul#players').children().length).toEqual(0);
    });
});

describe('on start of game', () => {
    it("displays the correct number of players", () => {
        const wrapper = shallow(<Players allPlayers={["Sibela", "Tilly", "Belle"]} />);
        expect(wrapper.find('h3').text()).toEqual("Players:");
        expect(wrapper.find('ul#players').children().length).toEqual(3);
    });
});