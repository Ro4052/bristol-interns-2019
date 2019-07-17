import React from 'react';
import PlayerCards from '../Cards/PlayerCards/PlayerCards';
import { shallow } from 'enzyme';
import { Dashboard } from './Dashboard';
import Prompt from '../shared/Prompt/Prompt';
import PlayWord from '../PlayWord/PlayWord';
import StartGame from './StartGame/StartGame';
import EndTurn from './EndTurn/EndTurn';

describe('on status NOT_STARTED', () => {
    it('displays the start game component', () => {
        const wrapper = shallow(<Dashboard status={"NOT_STARTED"} />);
        expect(wrapper.exists(StartGame)).toEqual(true);
    });
    it("doesn't display the cards", () => {
        const wrapper = shallow(<Dashboard status={"NOT_STARTED"}/>);
        expect(wrapper.exists(PlayerCards)).toEqual(false);
    });
});

describe('on any status other than NOT_STARTED', () => {
    it("doesn't display the start game component", () => {
        const wrapper = shallow(<Dashboard status={"STARTED"} />);
        expect(wrapper.exists(StartGame)).toEqual(false);
    });
    it('displays cards', () => {
        const wrapper = shallow(<Dashboard status={"STARTED"}/>);
        expect(wrapper.exists(PlayerCards)).toEqual(true);
    });
});

describe('on not given a current player', () => {
    it("doesn't display a current player", () => {
        const wrapper = shallow(<Dashboard />);
        expect(wrapper.exists({ 'data-cy': 'current-player' })).toEqual(false);
    });
});

describe('on given a current player', () => {
    it("displays a current player", () => {
        const wrapper = shallow(<Dashboard currentPlayer={{ username: "username"}} />);
        expect(wrapper.find({ 'data-cy': 'current-player' }).text()).toEqual("username");
    });
});

describe('on play word flag', () => {
    it('displays the play word prompt', () => {
        const wrapper = shallow(<Dashboard playWord={true} />);
        expect(wrapper.find(Prompt).prop('cy')).toEqual('play-word');
    });
    it('displays the play word input', () => {
        const wrapper = shallow(<Dashboard playWord={true} />);
        expect(wrapper.exists(PlayWord)).toEqual(true);
    });
});

describe('on play card flag', () => {
    it('displays the play card prompt', () => {
        const wrapper = shallow(<Dashboard playCard={true} />);
        expect(wrapper.find(Prompt).prop('cy')).toEqual('play-card');
    });
});

describe('on vote card flag', () => {
    it('displays the vote card prompt', () => {
        const wrapper = shallow(<Dashboard voteCard={true} />);
        expect(wrapper.find(Prompt).prop('cy')).toEqual('vote-card');
    });
});

describe('on played turn', () => {
    it('displays end turn button', () => {
        const wrapper = shallow(<Dashboard myWord={'word'} playedCard={1} finishedRound={false} />);
        expect(wrapper.exists(EndTurn)).toEqual(true);
    });
});
