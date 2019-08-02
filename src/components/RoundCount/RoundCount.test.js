import React from 'react';
import { shallow } from 'enzyme';
import { RoundCount } from './RoundCount';

describe('on selects a drop down option', () => {
    it('calls setRoundCount()', () => {
        const setRoundCount = jest.fn();
        const wrapper = shallow(<RoundCount setRoundCount={setRoundCount} />);
        wrapper.find({ 'data-cy': 'num-rounds-options' }).simulate('change', { preventDefault: () => {}, target: { value: 1 } });
        expect(setRoundCount).toHaveBeenCalled();
        setRoundCount.mockRestore();
    });
});
