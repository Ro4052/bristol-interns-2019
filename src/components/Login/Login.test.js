import React from 'react';
import { Login } from './Login';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);
const state = {
    gameOverReducer: {},
    playWordReducer: {}
};
const store = mockStore(state);

describe('on render', () => {
    it('calls authenticateUser', () => {
        const authenticateUser = jest.fn();
        mount(
            <Provider store={store}>
                <Login authenticateUser={authenticateUser} />
            </Provider>
        );
        expect(authenticateUser).toHaveBeenCalled();
        authenticateUser.mockRestore();
    });
});

describe('on type in input', () => {
    it('updates the state', () => {
        const wrapper = shallow(<Login authenticateUser={jest.fn()}/>);
        wrapper.find({ 'data-cy': 'username' }).simulate('change', { preventDefault: () => {}, target: { value: 'username' } });
        expect(wrapper.state().value).toEqual('username');
    });
});

describe('on submit', () => {
    it('calls the logIn function', () => {
        const logIn = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <Login authenticateUser={jest.fn()} logIn={logIn} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'username' }).simulate('change', { preventDefault: () => {}, target: { value: 'username' } });
        wrapper.find({ 'data-cy': 'login-form' }).simulate('submit');
        expect(logIn).toHaveBeenCalled();
        logIn.mockRestore();
    });
});
