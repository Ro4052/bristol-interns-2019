import React from 'react';
import {Login} from './Login';

import { shallow, mount } from 'enzyme';

describe('on log in', () => {
    it('is not able to submit a blank username', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const wrapper = shallow(<Login/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: '' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}})
        expect(wrapper.state().error).toEqual('Username cannot be an empty string');
    })
    it('is not able to submit a username with special characters', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const wrapper = shallow(<Login/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: 'unicorn_$$1' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}})
        expect(wrapper.state().error).toEqual('Username cannot contain special characters');
    })
    it('is able to input a username', () => {
        const spy = jest.spyOn(Login.prototype, 'sendLogin');
        const wrapper = shallow(<Login/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: 'unicorn' } });
        wrapper.find('form').simulate('submit', { preventDefault: () => {}})
        expect(wrapper.state().value).toEqual('unicorn');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    })
})

