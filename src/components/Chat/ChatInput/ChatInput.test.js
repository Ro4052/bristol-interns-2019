import React from 'react';
import { shallow, mount } from 'enzyme';
import { ChatInput } from './ChatInput';

describe('on initial render', () => {
    it('the input is empty', () => {
        const wrapper = shallow(<ChatInput messages={[]} />);
        expect(wrapper.find({ 'data-cy': 'type-message' }).text()).toEqual('');
    });
    it('the submit button is visible', () => {
        const wrapper = shallow(<ChatInput messages={[]} />);
        expect(wrapper.exists({ 'data-cy': 'send-message' }));
    });
    it('displays the new message icon if there are some', () => {
        const wrapper = shallow(<ChatInput messages={[]} newMessages={["Hello"]} />);
        expect(wrapper.exists({ 'data-cy': 'new-message' }));
    });
});

describe('on player types in the box', () => {
    it('calls handle change', () => {
        const spy = jest.spyOn(ChatInput.prototype, 'handleChange');
        const wrapper = shallow(<ChatInput messages={[]} />);
        wrapper.find({ 'data-cy': 'type-message' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('updates the state', () => {
        const wrapper = shallow(<ChatInput messages={[]} />);
        wrapper.find({ 'data-cy': 'type-message' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(wrapper.state().currentValue).toEqual('test');
    });
});

describe('on click send button', () => {
    it('calls sendMessage', () => {
        const spy = jest.spyOn(ChatInput.prototype, 'sendMessage');
        const wrapper = mount(<ChatInput sendChat={jest.fn()} messages={[]} />);
        wrapper.find({ 'data-cy': 'message-form' }).simulate('submit');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
