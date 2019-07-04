import React from 'react';
import { Message } from './Message';
import  { shallow, mount } from 'enzyme';
import SocketMock from 'socket.io-mock';

describe('on render', () => {
    it('renders without crashing', () => {
        shallow(<Message myTurn={true} currentWord={'Test word'} />);
    });
});

describe('on type in input', () => {
    it('updates the state', () => {
        const wrapper = shallow(<Message myTurn={true} currentWord={''} />)
        wrapper.find('input').simulate('change', { target: { value: 'new message' } });
        expect(wrapper.state().currentValue).toEqual('new message');
    });
});

describe('on submit message', () => {
    it('calls sendMessage', () => {
        const spy = jest.spyOn(Message.prototype, 'sendMessage');
        const socket = new SocketMock();
        const wrapper = shallow(<Message myTurn={true} currentWord={''} playWord={() => {}} socket={socket} />);
        wrapper.find('button#send-message').simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    
});

describe('on receives a message', () => {
    it('displays the message', () => {
        const wrapper = shallow(<Message myTurn={true} currentWord={'Test word'} />);
        const text = wrapper.find("#message").text();
        expect(text).toEqual('Test word');
    });
});