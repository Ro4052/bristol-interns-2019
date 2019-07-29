import React from 'react';
import { mount } from 'enzyme';
import { Logout } from './Logout';

describe('on render', () => {
    it('renders correctly', () => {
        const logOutUser = jest.fn();
        const wrapper = mount(<Logout logOutUser={logOutUser} />);
        wrapper.find({ 'data-cy': 'logout' }).simulate('click');
        expect(logOutUser).toHaveBeenCalled();
    });
});
