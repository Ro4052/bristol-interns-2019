import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Lobby } from './Lobby';
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

const emptyState = { authReducer: { username: 'unicorn' }, lobbyReducer: { rooms: [] }, dashboardReducer: { status: '' } };
const emptyStore = mockStore(emptyState);

describe('on render', () => {
    it('renders a create room button', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[]} />
            </Provider>
        );
        expect(wrapper.exists({ 'data-cy': 'create-room' })).toEqual(true);
    });

    it('renders the list of rooms', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[]} />
            </Provider>
        );
        expect(wrapper.exists({ 'data-cy': 'current-rooms' })).toEqual(true);
    });
});

describe('if given an empty list rooms', () => {
    it('displays no rooms', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[]} />
            </Provider>
        );
        expect(wrapper.find({ 'data-cy': 'current-rooms' }).children().length).toEqual(0);
    });
});

describe('if given a list of rooms', () => {
    it('displays the correct number of rooms', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[room]} />
            </Provider>
        );
        expect(wrapper.find({ 'data-cy': 'current-rooms' }).children().length).toEqual(1);
    });
});

describe('on click the create room button', () => {
    it('calls createRoom', () => {
        const createRoom = jest.fn();
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Lobby authenticateUser={jest.fn()} rooms={[]} createRoom={createRoom} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'create-room' }).simulate('click');
        expect(createRoom).toHaveBeenCalled();
        createRoom.mockRestore();
    });
});
