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

describe('if given no type', () => {
    it('defaults to "button"', () => {
        const wrapper = shallow(<Button cy="test-cy" handleClick={() => {}} text="test text" />);
        expect(wrapper.find({
            'data-cy': 'test-cy',
            'type': 'button'
        }).text()).toEqual('test text');
    });
});

describe('on click', () => {
    it('calls the handleClick function from props', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<Button cy="test-cy" type="submit" handleClick={handleClick} text="test text" />);
        wrapper.find({ 'data-cy': 'test-cy' }).simulate('click');
        expect(handleClick).toHaveBeenCalled();
        handleClick.mockRestore();
    });
});
