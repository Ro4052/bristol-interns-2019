import React from 'react';
import { EndTurnButton } from './EndTurnButton';
import { shallow } from 'enzyme';

describe('on render', () => {
    it('displays the correct text', () => {
        const wrapper = shallow(<EndTurnButton />);
        expect(wrapper.find({ 'data-cy': 'end-turn' }).text()).toEqual('End my turn');
    });
});

describe('on click', () => {
    it('calls the end turn function', () => {
        const spy = jest.spyOn(EndTurnButton.prototype, 'endTurn');
        const wrapper = shallow(<EndTurnButton />);
        wrapper.find('button').simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
