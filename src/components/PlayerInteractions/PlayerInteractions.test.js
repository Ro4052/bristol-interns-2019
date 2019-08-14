import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlayerInteractions } from './PlayerInteractions';
import Prompt from '../shared/Prompt/Prompt';
import { statusTypes } from '../../services/statusTypes';

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
