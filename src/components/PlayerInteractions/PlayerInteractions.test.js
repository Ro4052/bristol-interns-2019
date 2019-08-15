import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlayerInteractions } from './PlayerInteractions';
import Prompt from '../shared/Prompt/Prompt';
import { statusTypes } from '../../services/statusTypes';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);
const state = {
    dashboardReducer: {},
    myCardsReducer: {},
    playedCardsReducer: {},
    playWordReducer: {},
    timerReducer: {}
};
const store = mockStore(state);

describe('on play card flag', () => {
    it('displays the play card prompt', () => {
        const wrapper = shallow(<PlayerInteractions playCard={true} />);
        expect(wrapper.find(Prompt).prop('cy')).toEqual('play-card');
    });
});

describe('on vote card flag', () => {
    it('displays the vote card prompt', () => {
        const wrapper = shallow(<PlayerInteractions voteCard={true} />);
        expect(wrapper.find(Prompt).prop('cy')).toEqual('vote-card');
    });
});

describe('on waiting for storyteller', () => {
    it('displays the waiting prompt', () => {
        const wrapper = shallow(<PlayerInteractions status={statusTypes.WAITING_FOR_CURRENT_PLAYER} />)
        expect(wrapper.exists({ 'data-cy': 'wait-for-storyteller' })).toEqual(true);
    });
});

describe('on word having been submitted', () => {
    it('displays the word', () => {
        const wrapper = shallow(<PlayerInteractions currentWord="dog" />)
        expect(wrapper.exists({ 'data-cy': 'current-word' })).toEqual(true);
    });
});

describe('when you have voted are waiting for others to do so', () => {
    it('tells you to wait', () => {
        const wrapper = mount(<PlayerInteractions status={statusTypes.WAITING_FOR_VOTES} voteCardDuration={2} />);
        expect(wrapper.exists({ 'data-cy': 'wait-for-votes' })).toEqual(true);
    });
});

describe('when you have played your card and are waiting for others to do so', () => {
    it('tells you to wait', () => {
        const wrapper = mount(<PlayerInteractions status={statusTypes.WAITING_FOR_OTHER_PLAYERS} playCardDuration={2} />);
        expect(wrapper.exists({ 'data-cy': 'wait-for-cards' })).toEqual(true);
    });
});  

describe('when all the votes are displayed', () => {
    it('displays the next round button', () => {
        const wrapper = mount(<PlayerInteractions status={statusTypes.DISPLAY_ALL_VOTES} />);
        expect(wrapper.exists({ 'data-cy': 'next-round' })).toEqual(true);
    });
    it('calls requestNextRound when button is clicked', () => {
        const requestNextRound = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <PlayerInteractions status={statusTypes.DISPLAY_ALL_VOTES} requestNextRound={requestNextRound} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'next-round' }).simulate('click');
        expect(requestNextRound).toHaveBeenCalled();
        requestNextRound.mockRestore();
    });
    it('displays an error if calling next round is not allowed', () => {
        const wrapper = mount(<PlayerInteractions error={"Next round is not allowed."} />);
        expect(wrapper.find({ 'data-cy': 'error' }).text()).toEqual("Error: Next round is not allowed.");
    });
});  
