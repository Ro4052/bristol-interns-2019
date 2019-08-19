import React from 'react';
import { shallow, mount } from 'enzyme';
import { Chat } from './Chat';

describe('on initial render', () => {
    it('the input is empty', () => {
        const wrapper = shallow(<Chat messages={[]} newMessages={[]} />);
        expect(wrapper.find({ 'data-cy': 'type-message' }).text()).toEqual('');
    });
    it('the submit button is visible', () => {
        const wrapper = shallow(<Chat messages={[]} newMessages={[]} />);
        expect(wrapper.exists({ 'data-cy': 'send-message' }));
    });
    it('displays the new message icon if there are some', () => {
        const wrapper = shallow(<Chat messages={[]} newMessages={["Hello"]} />);
        expect(wrapper.exists({ 'data-cy': 'new-message' }));
    });
});

describe('on player types in the box', () => {
    it('calls handle change', () => {
        const spy = jest.spyOn(Chat.prototype, 'handleChange');
        const wrapper = shallow(<Chat messages={[]} newMessages={[]} />);
        wrapper.find({ 'data-cy': 'type-message' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('updates the state', () => {
        const wrapper = shallow(<Chat messages={[]} newMessages={[]} />);
        wrapper.find({ 'data-cy': 'type-message' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(wrapper.state().currentValue).toEqual('test');
    });
});

describe('on click send button', () => {
    it('calls sendMessage', () => {
        const spy = jest.spyOn(Chat.prototype, 'sendMessage');
        const wrapper = mount(<Chat sendChat={jest.fn()} messages={[]} newMessages={[]} />);
        wrapper.find({ 'data-cy': 'message-form' }).simulate('submit');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
