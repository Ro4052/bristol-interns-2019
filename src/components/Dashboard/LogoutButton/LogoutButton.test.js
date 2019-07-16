import React from 'react';
import { LogoutButton } from './LogoutButton';
import { shallow } from 'enzyme';

describe('on render', () => {
    it('displays the correct text', () => {
        const wrapper = shallow(<LogoutButton logOutUser={() => {}}/>);
        expect(wrapper.find({ 'data-cy': 'logout' }).text()).toEqual('Log out');
    });
});

describe('on click', () => {
    it('calls the logout function', () => {
        const spy = jest.spyOn(LogoutButton.prototype, 'logOut');
        const wrapper = shallow(<LogoutButton logOutUser={() => {}}/>);
        wrapper.find('button').simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('calls the delete all cookies function', () => {
        // TODO: Figure out how to mock logout request to test deleteAllCookies
    });
});
