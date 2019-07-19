import React from 'react';
import { shallow } from 'enzyme';
import { PlayerInteractions } from './PlayerInteractions';
import Prompt from '../shared/Prompt/Prompt';
import PlayWord from '../PlayWord/PlayWord';
import EndTurn from '../Dashboard/EndTurn/EndTurn';

describe('on play word flag', () => {
    it('displays the play word prompt', () => {
        const wrapper = shallow(<PlayerInteractions playWord={true} />);
        expect(wrapper.find(Prompt).prop('cy')).toEqual('play-word');
    });
    it('displays the play word input', () => {
        const wrapper = shallow(<PlayerInteractions playWord={true} />);
        expect(wrapper.exists(PlayWord)).toEqual(true);
    });
});

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
        const wrapper = shallow(<PlayerInteractions myWord={'word'} playedCard={1} finishedRound={false} />);
        expect(wrapper.exists(EndTurn)).toEqual(true);
    });
});
