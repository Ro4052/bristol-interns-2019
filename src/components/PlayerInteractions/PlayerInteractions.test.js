import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlayerInteractions } from './PlayerInteractions';
import Prompt from '../shared/Prompt/Prompt';

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

describe('on played turn', () => {
    it('displays end turn button', () => {
        const wrapper = mount(<PlayerInteractions word={'word'} playedCardId={1} finishedRound={false} />);
        expect(wrapper.exists({ 'data-cy': 'end-turn' })).toEqual(true);
    });
});
