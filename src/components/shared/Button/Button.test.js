import React from 'react';
import { Button } from './Button';
import { shallow } from 'enzyme';

describe('on render', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<Button cy="test-cy" type="submit" handleClick={() => {}} text="test text" />);
        expect(wrapper.find({
            'data-cy': 'test-cy',
            'type': 'submit'
        }).text()).toEqual('test text');
    });
});
