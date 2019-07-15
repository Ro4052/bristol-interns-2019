import React from 'react';
import {Login} from './Login';
import LogoutButton from './LogoutButton';
import { shallow } from 'enzyme';

describe('on log in', () => {
    it('is not able to submit a blank username', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const wrapper = shallow(<Login logIn={() => {}} authenticateUser={() => {}}/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: '' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}});
        expect(wrapper.state().error).toEqual('Username cannot be an empty string');
    });
    it('is not able to submit a username with special characters', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const wrapper = shallow(<Login logIn={() => {}} authenticateUser={() => {}}/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: 'unicorn_$$1' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}});
        expect(wrapper.state().error).toEqual('Username cannot contain special characters');
    });
    it('is able to input a username', () => {
        const spy = jest.spyOn(Login.prototype, 'sendLogin');
        const wrapper = shallow(<Login logIn={() => {}} authenticateUser={() => {}}/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: 'unicorn' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}});
        expect(wrapper.state().value).toEqual('unicorn');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
describe('on log out', () => {
    it('displays the logout button', () => {
        const wrapper = shallow(<LogoutButton/>);
        expect(wrapper.exists('button')).toEqual(true);
    });
    it('calls the logout function', () => {
        const spy = jest.spyOn(LogoutButton.prototype, 'logOut');
        const wrapper = shallow(<LogoutButton/>);
        wrapper.find('button').simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it("doesn't display the logout button when logged out", () => {
        const wrapper = shallow(<LogoutButton/>);
        wrapper.setState({ loggedIn: false });
        expect(wrapper.exists('button')).toEqual(false);
    });
});
