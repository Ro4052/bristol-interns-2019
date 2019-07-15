import React from 'react';
import { StartGameButton } from './StartGameButton';
import { shallow } from 'enzyme';

describe('on render', () => {
    it('displays the correct text', () => {
        const wrapper = shallow(<StartGameButton />);
        expect(wrapper.find({ 'data-cy': 'start-game' }).text()).toEqual('Start game');
    });
});

describe('on click', () => {
    it('calls startGame', () => {
        const spy = jest.spyOn(StartGameButton.prototype, 'startGame');
        const wrapper = shallow(<StartGameButton />);
        wrapper.find({ 'data-cy': 'start-game' }).simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
