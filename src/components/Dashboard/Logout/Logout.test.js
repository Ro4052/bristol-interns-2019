import React from 'react';
import { shallow } from 'enzyme';
import { Logout } from './Logout';
import Button from '../../Button/Button';

describe('on render', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<Logout />);
        expect(wrapper.exists(Button)).toEqual(true);
    });
});
