import React from 'react';
import { mount } from 'enzyme';
import GameOver from './GameOver';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);
const store = mockStore({
    authReducer: {},
    chatReducer: {
        messages: [{
            username: 'player1',
            text: 'hello'
        }]
    },
    gameOverReducer: {
        winners: [{
            username: 'player1'
        }]
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
                <GameOver />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on winners', () => {
        it("displays the winner's username", () => {
            expect(wrapper.find({ 'data-cy': 'winner' }).text()).toEqual('player1');
        });
    });
    
    // describe('on draw', () => {
    //     it("displays the drawers", () => {
    //         expect(wrapper.find({ 'data-cy': 'drawers' }).text()).toEqual("Draw between one and two ");
    //         expect(wrapper.find({ 'data-cy': 'winner' }).children()).toEqual({});
    //     });
    // });
});
