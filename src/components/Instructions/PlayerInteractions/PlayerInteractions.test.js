import React from 'react';
import { mount } from 'enzyme';
import PlayerInteractions from './PlayerInteractions';
import { statusTypes } from '../../services/statusTypes';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../Timer/TimerActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
    authReducer: {},
    dashboardReducer: {
        status: statusTypes.DISPLAY_ALL_VOTES
    },
    myCardsReducer: {},
    playedCardsReducer: {},
    playWordReducer: {},
    playersReducer: {},
    timerReducer: {}
});

describe('PlayerInteractions', () => {
    let wrapper;
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);
    const requestNextRoundSpy = jest.spyOn(actions, 'requestNextRound');

    beforeEach(() => {
        store.clearActions();
        wrapper = mount(
            <Provider store={store}>
                <PlayerInteractions />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on click next round button', () => {
        it('dispatches requestNextRound', () => {
            wrapper.find({ 'data-cy': 'next-round' }).props().onClick();
            expect(requestNextRoundSpy).toHaveBeenCalled();
        });
    });
});
