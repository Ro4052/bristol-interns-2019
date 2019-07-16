import React from 'react';
import { shallow } from 'enzyme';
import { StartGame } from './StartGame';
import Button from '../../Button/Button';

describe('on render', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<StartGame />);
        expect(wrapper.exists(Button)).toEqual(true);
    });
});
