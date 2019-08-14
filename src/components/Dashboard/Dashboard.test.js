import React from 'react';
import MyCards from '../MyCards/MyCards';
import { shallow } from 'enzyme';
import { Dashboard } from './Dashboard';
import GameOver from '../GameOver/GameOver';
import PlayerInteractions from '../PlayerInteractions/PlayerInteractions';
import PlayWord from '../PlayWord/PlayWord';

const authenticateUserMock = jest.fn();
const drawers = [];

describe('on initial render', () => {
    it('calls authenticateUser', () => {
        shallow(<Dashboard playedCards={[]} authenticateUser={authenticateUserMock} drawers={drawers}/>);
        expect(authenticateUserMock).toHaveBeenCalled();
        authenticateUserMock.mockRestore();
    });
});

describe('on playCard false', () => {
    it("doesn't display the cards", () => {
        const wrapper = shallow(<Dashboard playedCards={[]} playCard={false} authenticateUser={authenticateUserMock} drawers={drawers} />);
        expect(wrapper.exists(MyCards)).toEqual(false);
    });
});

describe('on playCard true', () => {
    it('displays cards', () => {
        const wrapper = shallow(<Dashboard playedCards={[]} playCard={true} authenticateUser={authenticateUserMock} drawers={drawers}/>);
        expect(wrapper.exists(MyCards)).toEqual(true);
    });
});

describe('on winner', () => {
    it('displays GameOver', () => {
        const wrapper = shallow(<Dashboard playedCards={[]} winner={{ username: 'username' }} authenticateUser={authenticateUserMock} drawers={drawers}/>);
        expect(wrapper.exists(GameOver)).toEqual(true);
    })
});

describe('on no winner', () => {
    it("doesn't display GameOver", () => {
        const wrapper = shallow(<Dashboard playedCards={[]} authenticateUser={authenticateUserMock} drawers={drawers}/>);
        expect(wrapper.exists(GameOver)).toEqual(false);
    });
});

describe('on play card', () => {
    it('displays player interaction', () => {
        const wrapper = shallow(<Dashboard playedCards={[]} playCard={true} authenticateUser={authenticateUserMock} drawers={drawers}/>);
        expect(wrapper.exists(PlayerInteractions)).toEqual(true);
    });
});

describe('on play word', () => {
    it('displays play word interaction', () => {
        const wrapper = shallow(<Dashboard playedCards={[]} playWord={true} playedCardId={1} authenticateUser={authenticateUserMock} drawers={drawers}/>);
        expect(wrapper.exists(PlayWord)).toEqual(true);
    });
});

describe('on vote card', () => {
    it('displays player interaction', () => {
        const wrapper = shallow(<Dashboard playedCards={[]} voteCard={true} playCard={true} authenticateUser={authenticateUserMock} drawers={drawers}/>);
        expect(wrapper.exists(PlayerInteractions)).toEqual(true);
    });
});

describe('on end of turn', () => {
    it('displays player interaction', () => {
        const wrapper = shallow(<Dashboard playedCards={[]} finishedRound={false} username={'username'} currentPlayer={{ username: 'username' }} word={true} playedCardId={1} authenticateUser={authenticateUserMock} drawers={drawers}/>);
        expect(wrapper.exists(PlayerInteractions)).toEqual(true);
    });
});
