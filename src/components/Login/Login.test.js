import React from 'react';
import {Login} from './Login';

import { shallow, mount } from 'enzyme';

describe('on log in', () => {
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

