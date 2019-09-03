import React from 'react';
import { shallow, mount } from 'enzyme';
import ChatInput from './ChatInput';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);
const emptyState = {};
const emptyStore = mockStore(emptyState);

describe('ChatInput', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);

    beforeEach(() => {
        wrapper = mount(
            <Provider store={emptyStore}>
                <ChatInput />
            </Provider>
        );
    });

    describe('on initial render', () => {
        it('the input is empty', () => {
            expect(wrapper.find({ 'data-cy': 'type-message' }).text()).toEqual('');
        });
    
        it('the submit button is visible', () => {
            expect(wrapper.exists({ 'data-cy': 'send-message' }));
        });
    });
    
    describe('on player types in the box', () => {
        it('updates the state', () => {
            // wrapper.find({ 'data-cy': 'type-message' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
            wrapper.find({ 'data-cy': 'type-message' }).props().onChange({ preventDefault: () => {}, target: { value: 'test' } });

            // expect(wrapper.state().currentValue).toBe('test');
            // expect(useStateSpy).toHaveBeenCalled();
            // expect(wrapper.find({ 'data-cy': 'type-message' }).text()).toEqual('test');
            expect(setState).toHaveBeenCalledWith('test');
        });
        // useStateSpy.mockRestore();
    });

    // describe('on click send button', () => {
    //     it('calls sendMessage', () => {
    //         // const spy = jest.spyOn(ChatInput.prototype, 'sendMessage');
    //         const sendMessageSpy = wrapper.instance().sendMessage;
    //         // wrapper.find({ 'data-cy': 'message-form' }).simulate('submit');
    //         // expect(spy).toHaveBeenCalled();
    //         // spy.mockRestore();
    //     });
    // });
    
});
