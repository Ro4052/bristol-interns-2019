import React from 'react';
import { Message } from './Message';
import  { shallow, mount } from 'enzyme';

describe('on render', () => {
    it('renders without crashing', () => {
        shallow(<Message myTurn={true} message={'Test message'} />);
    });
    it('displays a message', () => {
        const wrapper = shallow(<Message myTurn={true} message={'Test message'} />);
        const text = wrapper.find("#message").text();
        expect(text).toEqual('Test message');
    });
    it('can type in input', () => {
        const wrapper = shallow(<Message myTurn={true} message={''} />)
        wrapper.find('input').simulate('change', { target: { value: 'new message' } });
        expect(wrapper.state().currentValue).toEqual('new message');
    });
    it('can press button', () => {
        const spy = jest.spyOn(Message.prototype, 'sendMessage');
        const wrapper = shallow(<Message myTurn={true} message={''} />)
        wrapper.find('.chat-button').simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

});