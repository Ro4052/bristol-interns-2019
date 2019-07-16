import React from 'react';
import { Prompt } from './Prompt';
import { shallow } from 'enzyme';

describe('on render', () => {
    it('displays the correct text', () => {
        const wrapper = shallow(<Prompt cy="test" text="This is a prompt" />);
        expect(wrapper.find({ 'data-cy': 'test' }).text()).toEqual('This is a prompt');
    });
});
