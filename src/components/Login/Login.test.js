import React from 'react';
import {Login} from './Login';
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
        expect(wrapper.state().error).toEqual('Username can be comprised of numbers and latin letters only');
    });
    it('is not able to submit a username from a non-latin alphabet', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const wrapper = shallow(<Login logIn={() => {}} authenticateUser={() => {}}/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: 'еднорог' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}});
        expect(wrapper.state().error).toEqual('Username can be comprised of numbers and latin letters only');
    });
    it('is not able to submit a username with less than three characters', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const wrapper = shallow(<Login logIn={() => {}} authenticateUser={() => {}}/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: 'do' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}});
        expect(wrapper.state().error).toEqual('Username must be at least 3 characters');
    });
    it('is not able to submit a username with more than fifteen characters', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const wrapper = shallow(<Login logIn={() => {}} authenticateUser={() => {}}/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: 'abcdefghijklmnop' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}});
        expect(wrapper.state().error).toEqual('Username must be no longer than 15 characters');
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
