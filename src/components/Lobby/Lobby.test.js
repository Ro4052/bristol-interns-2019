import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Lobby } from './Lobby';
import configureStore from 'redux-mock-store';
import { authFailure, authSuccess } from '../shared/Auth/AuthActions';

const room = {
    id: 0,
    players: ["unicorn", "halfling"]
};

const initialState = {
    lobbyReducer: {
        rooms: []
    },
    dashboardReducer: {
        status: "NOT_STARTED"
    }
};

const afterClickState = {
    lobbyReducer: {
        rooms: [room]
    },
    dashboardReducer: {
        status: "NOT_STARTED"
    }
};

const middlewares = [];
const mockStore = configureStore(middlewares);
const initialStore = mockStore(initialState);
const afterClickStore = mockStore(afterClickState);
const authenticateUserMock = jest.fn();

describe('on initial render', () => {
    it('calls authenticateUser', () => {
        mount(<Lobby rooms={[]} authenticateUser={authenticateUserMock}/>);
        expect(authenticateUserMock).toHaveBeenCalled();
        authenticateUserMock.mockRestore();
    });
    
    it('displays no rooms', () => {
        const wrapper = mount(
            <Provider store={initialStore}>
                <Lobby rooms={[]} authenticateUser={authenticateUserMock}/>
            </Provider>
        );
        expect(wrapper.exists({ 'data-cy': 'single-room' })).toEqual(false);
    });
});

describe('on click', () => {
    it('calls createRoom', () => {
        const createRoom = jest.spyOn(Lobby.prototype, 'createRoom');
        const wrapper = mount(
            <Provider store={afterClickStore}>
                <Lobby rooms={[room]} authenticateUser={authenticateUserMock}/>
            </Provider>
        );
        wrapper.find({ 'data-cy': 'create-room' }).simulate('click');
        expect(createRoom).toHaveBeenCalled();
        createRoom.mockRestore();
    });

    it('displays the new room', () => {
        const wrapper = mount(
            <Provider store={afterClickStore}>
                <Lobby rooms={[room]} authenticateUser={authenticateUserMock}/>
            </Provider>
        );
        expect(wrapper.exists({ 'data-cy': 'single-room' })).toEqual(true);
    });

   /* TODO: moxios when createRoom is moved into actions */
});
