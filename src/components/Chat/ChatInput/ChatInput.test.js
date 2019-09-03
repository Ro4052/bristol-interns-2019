import React from 'react';
import { mount } from 'enzyme';
import ChatInput from './ChatInput';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../ChatActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore();

describe('ChatInput', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);
    const sendChatSpy = jest.spyOn(actions, 'sendChat');

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <ChatInput />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
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
            wrapper.find({ 'data-cy': 'type-message' }).props().onChange({ preventDefault: jest.fn(), target: { value: 'test' } });
            expect(setState).toHaveBeenCalledWith('test');
        });
    });

    describe('on click send button', () => {
        it('dispatches sendChat', () => {
            wrapper.find({ 'data-cy': 'message-form' }).props().onSubmit({ preventDefault: jest.fn() });
            expect(sendChatSpy).toHaveBeenCalled();
        });

        it('clears the input', () => {
            wrapper.find({ 'data-cy': 'message-form' }).props().onSubmit({ preventDefault: jest.fn() });
            expect(setState).toHaveBeenCalledWith('');
        });
    });
});
