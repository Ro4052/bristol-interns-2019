import React from 'react';
import { mount } from 'enzyme';
import Chat from './Chat';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);
const store = mockStore({
    chatReducer: {
        messages: []
    }
});

describe('Chat', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <Chat />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on render', () => {
        it('scrolls to bottom', () => {
            // jest.spyOn(Chat.prototype, 'scrollToBottom').mockImplementation(jest.fn());
            // const wrapper = shallow(<Chat messages={[]} newMessages={["Hello"]} />);
            // expect(wrapper.exists({ 'data-cy': 'new-message' }));
        });
    });
});
