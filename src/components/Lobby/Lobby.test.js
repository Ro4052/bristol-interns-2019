import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Lobby } from './Lobby';
import configureStore from 'redux-mock-store';

const room = {
    id: 0,
    players: ["unicorn", "halfling"]
};

const initialState = {
    gameReducer: {
        rooms: []
    }
};

const afterClickState = {
    gameReducer: {
        rooms: [room]
    }
};

const middlewares = [];
const mockStore = configureStore(middlewares);
const intialStore = mockStore(initialState);
const afterClickStore = mockStore(afterClickState);

describe('on initial render', () => {
    it('displays no rooms', () => {
        const wrapper = mount(
            <Provider store={intialStore}>
                <Lobby rooms={[]}/>
            </Provider>
        );
        expect(wrapper.exists({ 'data-cy': 'single-room' })).toEqual(false);
    });
});

describe('on click', () => {
    
    it('calls createRoom', () => {
        const createRoom = jest.spyOn(Lobby.prototype, 'createRoom');
        const wrapper = mount(<Lobby rooms={[]}/>);
        wrapper.find({ 'data-cy': 'create-room' }).simulate('click');
        expect(createRoom).toHaveBeenCalled();
        createRoom.mockRestore();
    });

    it('displays the new room', () => {
        const wrapper = mount(
            <Provider store={afterClickStore}>
                <Lobby rooms={[room]}/>
            </Provider>
        );
        expect(wrapper.exists({ 'data-cy': 'single-room' })).toEqual(true);
    });

   /* TODO: moxios when createRoom is moved into actions */
});
