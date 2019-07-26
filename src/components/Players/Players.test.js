import React from 'react';
import { shallow } from 'enzyme';
import { Players } from './Players';

describe('on empty list of players', () => {
    it("doesn't display any players", () => {
        const wrapper = shallow(<Players players={[]} />);
        expect(wrapper.find('ul#players').children().length).toEqual(0);
    });
});

const players = [
    { username: "Sibela", score: 0 },
    { username: "Tilly", score: 5 },
    { username: "Belle", score: 2 }
];

describe('on given a list of players', () => {
    it("displays the correct number of players", () => {
        const wrapper = shallow(<Players players={players} />);
        expect(wrapper.find({ 'data-cy': 'player' }).length).toEqual(3);
    });
    it("displays the correct usernames", () => {
        const wrapper = shallow(<Players players={players} />);
        expect(wrapper.find({ 'data-cy': 'player-username' }).at(0).text()).toEqual(players[0].username);
        expect(wrapper.find({ 'data-cy': 'player-username' }).at(1).text()).toEqual(players[1].username);
        expect(wrapper.find({ 'data-cy': 'player-username' }).at(2).text()).toEqual(players[2].username);
    });
    it("displays the correct scores", () => {
        const wrapper = shallow(<Players players={players} />);
        expect(wrapper.find({ 'data-cy': 'player-score' }).at(0).text()).toEqual(players[0].score.toString());
        expect(wrapper.find({ 'data-cy': 'player-score' }).at(1).text()).toEqual(players[1].score.toString());
        expect(wrapper.find({ 'data-cy': 'player-score' }).at(2).text()).toEqual(players[2].score.toString());
    });
});
