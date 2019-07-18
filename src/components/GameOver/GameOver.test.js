import React from 'react';
import { shallow } from 'enzyme';
import { GameOver } from './GameOver';

const winner = { username: 'username' };

describe('on render', () => {
    it("displays the winner's username", () => {
        const wrapper = shallow(<GameOver winner={winner} />);
        expect(wrapper.find({ 'data-cy': 'winner' }).text()).toEqual(winner.username);
    });
});
