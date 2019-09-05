import React from 'react';
import { mount } from 'enzyme';
import Timothy from './Timothy';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);
const store = mockStore({
    authReducer: {},
    gameOverReducer: {
        winners: []
    },
    playWordReducer: {}
});

describe('Timothy', () => {
    describe('on render', () => {
        it('renders correctly', () => {
            mount(
                <Provider store={store}>
                    <Timothy />
                </Provider>
            );
        });
    });
});
