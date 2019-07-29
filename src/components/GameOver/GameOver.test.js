import React from 'react';
import { shallow } from 'enzyme';
import { GameOver } from './GameOver';

const winner = { username: 'username' };
const empty = []
const drawerstest = [{username:'one'}, {username:'two'}] 

describe('on render', () => {
    it("displays the winner's username in instance of win", () => {
        const wrapper = shallow(<GameOver winner={winner} drawers={empty}/>);
        expect(wrapper.find({ 'data-cy': 'winner' }).text()).toEqual(winner.username);
    });
    it("displays the drawers if it's a draw", () => {
        const wrapper = shallow(<GameOver drawers={drawerstest}/>);
        expect(wrapper.find({ 'data-cy': 'drawers' }).text()).toEqual("Draw between one and two ");
    });
});
