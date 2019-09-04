import React from 'react';
import { shallow } from 'enzyme';
import { GameOver } from './GameOver';

const winner = { username: 'username' };
const empty = [];
const drawerstest = [{username:'one'}, {username:'two'}];

describe('on render', () => {
    it("displays the winner's username", () => {
        const wrapper = shallow(<GameOver winners={[winner]} drawers={empty}/>);
        expect(wrapper.find({ 'data-cy': 'winner' }).text()).toEqual(winner.username);
    });
});

describe('on draw', () => {
    it("displays the drawers", () => {
        const wrapper = shallow(<GameOver winners= {drawerstest}/>);
        expect(wrapper.find({ 'data-cy': 'drawers' }).text()).toEqual("Draw between one and two ");
        expect(wrapper.find({ 'data-cy': 'winner' }).children()).toEqual({});
    });
});
