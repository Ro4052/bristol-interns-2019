import React from 'react';
import { mount } from 'enzyme';
import { CreateRoom } from './CreateRoom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './CreateRoomActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
    createRoomReducer: {}
});

describe('CreateRoom', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);
    const setRoundCountSpy = jest.spyOn(actions, 'setRoundCount');
    const createRoomSpy = jest.spyOn(actions, 'createRoom');

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <CreateRoom />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on selects a drop down option', () => {
        it('calls setRoundCount', () => {
            wrapper.find({ 'data-cy': 'num-rounds-options' }).simulate('change', { preventDefault: () => {}, target: { value: 1 } });
            expect(setRoundCountSpy).toHaveBeenCalled();
        });
    });
    
    describe('on submit the create room form', () => {
        it('calls createRoom', () => {
            wrapper.find({ 'data-cy': 'create-room-form' }).simulate('submit');
            expect(createRoomSpy).toHaveBeenCalled();
        });
    });
});
