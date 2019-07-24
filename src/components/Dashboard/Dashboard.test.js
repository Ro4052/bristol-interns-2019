import React from 'react';
import MyCards from '../MyCards/MyCards';
import { shallow } from 'enzyme';
import { Dashboard } from './Dashboard';
import StartGame from '../StartGame/StartGame';
import GameOver from '../GameOver/GameOver';
import PlayerInteractions from '../PlayerInteractions/PlayerInteractions';

describe('on status NOT_STARTED', () => {
    it('displays the start game component', () => {
        const wrapper = shallow(<Dashboard status={"NOT_STARTED"} />);
        expect(wrapper.exists(StartGame)).toEqual(true);
    });
    it("doesn't display the cards", () => {
        const wrapper = shallow(<Dashboard status={"NOT_STARTED"}/>);
        expect(wrapper.exists(MyCards)).toEqual(false);
    });
});

describe('on any status other than NOT_STARTED', () => {
    it("doesn't display the start game component", () => {
        const wrapper = shallow(<Dashboard status={"STARTED"} />);
        expect(wrapper.exists(StartGame)).toEqual(false);
    });
    it('displays cards', () => {
        const wrapper = shallow(<Dashboard status={"STARTED"}/>);
        expect(wrapper.exists(MyCards)).toEqual(true);
    });
});

describe('on winner', () => {
    it('displays GameOver', () => {
        const wrapper = shallow(<Dashboard winner={{ username: 'username' }} />);
        expect(wrapper.exists(GameOver)).toEqual(true);
    })
});

describe('on no winner', () => {
    it("doesn't display GameOver", () => {
        const wrapper = shallow(<Dashboard />);
        expect(wrapper.exists(GameOver)).toEqual(false);
    });
});

describe('on play card', () => {
    it('displays player interaction', () => {
        const wrapper = shallow(<Dashboard playCard={true} />);
        expect(wrapper.exists(PlayerInteractions)).toEqual(true);
    });
});

describe('on play word', () => {
    it('displays player interaction', () => {
        const wrapper = shallow(<Dashboard playWord={true} />);
        expect(wrapper.exists(PlayerInteractions)).toEqual(true);
    });
});

describe('on vote card', () => {
    it('displays player interaction', () => {
        const wrapper = shallow(<Dashboard voteCard={true} />);
        expect(wrapper.exists(PlayerInteractions)).toEqual(true);
    });
});

describe('on end of turn', () => {
    it('displays player interaction', () => {
        const wrapper = shallow(<Dashboard finishedRound={false} username={'username'} currentPlayer={{ username: 'username' }} status={'WAITING_FOR_CURRENT_PLAYER'} playedCardId={1} />);
        expect(wrapper.exists(PlayerInteractions)).toEqual(true);
    });
});
