import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Lobby } from './Lobby';
import { Chat } from '../Chat/Chat';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);

const room = {
    roomId: 0,
    players: [
        { username: "unicorn" },
        { username: "halfling" }
    ]
};

const emptyState = { authReducer: { username: 'unicorn' }, lobbyReducer: { rooms: [] }, dashboardReducer: { status: '' }, createRoomReducer: {}, chatReducer: { messages: [], newMessages: [] }, uploadReducer: { message: "" } };
const emptyStore = mockStore(emptyState);

describe('on render', () => {
    it('renders a drop down button', () => {
        jest.spyOn(Chat.prototype, 'scrollToBottom').mockImplementation(jest.fn());
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[]} newMessages={[]} createRoom={jest.fn()}  />
            </Provider>
        );
        expect(wrapper.exists({ 'data-cy': 'num-rounds-options' })).toEqual(true);
    });

    it('renders the list of rooms', () => {
        jest.spyOn(Chat.prototype, 'scrollToBottom').mockImplementation(jest.fn());
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[]} newMessages={[]} />
            </Provider>
        );
        expect(wrapper.exists({ 'data-cy': 'current-rooms' })).toEqual(true);
    });
});

describe('if given an empty list rooms', () => {
    it('displays no rooms', () => {
        jest.spyOn(Chat.prototype, 'scrollToBottom').mockImplementation(jest.fn());
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[]} newMessages={[]} />
            </Provider>
        );
        expect(wrapper.find({ 'data-cy': 'room' }).length).toEqual(0);
    });
});

describe('if given a list of rooms', () => {
    it('displays the correct number of rooms', () => {
        jest.spyOn(Chat.prototype, 'scrollToBottom').mockImplementation(jest.fn());
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[room]} newMessages={[]} />
            </Provider>
        );
        expect(wrapper.find({ 'data-cy': 'room' }).length).toEqual(1);
    });
});
