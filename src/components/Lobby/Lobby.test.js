import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import Lobby from './Lobby';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const room = {
    roomId: 0,
    players: [
        { username: "unicorn" },
        { username: "halfling" }
    ]
};

const store = mockStore({
    authReducer: { username: 'unicorn' },
    lobbyReducer: { rooms: [room] },
    dashboardReducer: { status: '' },
    createRoomReducer: {},
    chatReducer: { messages: [], newMessages: [] },
    uploadReducer: { message: "" }
});

describe('Lobby', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <Lobby history={[]} />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on render', () => {
        it('renders a drop down button', () => {
            expect(wrapper.exists({ 'data-cy': 'num-rounds-options' })).toEqual(true);
        });
    });
    
    describe('if given a list of rooms', () => {
        it('displays the correct number of rooms', () => {
            expect(wrapper.find({ 'data-cy': 'room' }).length).toEqual(1);
        });
    });
});
