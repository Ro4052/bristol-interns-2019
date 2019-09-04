import React from 'react';
import Login from './Login';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './LoginActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const state = {
    gameOverReducer: { winners: [] },
    playWordReducer: {},
    authReducer: {},
};
const store = mockStore(state);

describe('Login', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);
    const authenticateUserSpy = jest.spyOn(actions, 'authenticateUser');
    const logInSpy = jest.spyOn(actions, 'logIn');

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <Login />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on render', () => {
        it('calls authenticateUser', () => {
            expect(authenticateUserSpy).toHaveBeenCalled();
        });
    });
    
    describe('on type in input', () => {
        it('updates the state', () => {
            wrapper.find({ 'data-cy': 'username' }).simulate('change', { preventDefault: () => {}, target: { value: 'username' } });
            expect(setState).toHaveBeenCalledWith('username');
        });
    });
    
    describe('on submit', () => {
        it('calls the logIn function', () => {
            wrapper.find({ 'data-cy': 'login-form' }).simulate('submit');
            expect(logInSpy).toHaveBeenCalled();
        });
    });
});
