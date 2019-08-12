import React from 'react';
import { mount } from 'enzyme';
import { Logout } from './Logout';

describe('on render', () => {
    it('renders correctly', () => {
        const logOut = jest.fn();
        const wrapper = mount(<Logout logOut={logOut} />);
        wrapper.find({ 'data-cy': 'logout-form' }).simulate('submit');
        expect(logOut).toHaveBeenCalled();
    });
});
