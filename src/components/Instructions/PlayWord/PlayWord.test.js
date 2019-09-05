import React from 'react';
import { mount } from 'enzyme';
import PlayWord from './PlayWord';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './PlayWordActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
    playWordReducer: {},
    myCardsReducer: {}
});

describe('PlayWord', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);
    const sendWordSpy = jest.spyOn(actions, 'sendWord');

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <PlayWord />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on initial render', () => {
        it('the input is empty', () => {
            expect(wrapper.find({ 'data-cy': 'type-word' }).text()).toEqual('');
        });
        it('the submit button is visible', () => {
            expect(wrapper.find({ 'data-cy': 'send-word' }));
        });
    });

    describe('on player types in the box', () => {
        it('updates the state', () => {
            wrapper.find({ 'data-cy': 'type-word' }).props().onChange({ preventDefault: jest.fn(), target: { value: 'test' } });
            expect(setState).toHaveBeenCalledWith('test');
        });
    });
    
    describe('on click send button', () => {
        it('dispatches sendWord', () => {
            wrapper.find({ 'data-cy': 'play-word-form' }).props().onSubmit({ preventDefault: jest.fn() });
            expect(sendWordSpy).toHaveBeenCalled();
        });

        it('clears the input', () => {
            wrapper.find({ 'data-cy': 'play-word-form' }).props().onSubmit({ preventDefault: jest.fn() });
            expect(setState).toHaveBeenCalledWith('');
        });
    });

    describe('on error', () => {
        const errorStore = mockStore({
            playWordReducer: {
                error: 'Invalid word'
            },
            myCardsReducer: {}
        });

        beforeEach(() => {
            wrapper = mount(
                <Provider store={errorStore}>
                    <PlayWord />
                </Provider>
            );
        });

        it('displays the error', () => {
            expect(wrapper.find({'data-cy' :"send-error"}).text()).toEqual('Invalid word');
        });
    });
});
