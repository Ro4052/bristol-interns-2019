import React from 'react';
import { shallow } from 'enzyme';
import { Players } from './Players';
import { PlayWordAndCard } from './PlayWordAndCard';
import { PlayCard } from './PlayCard';

const initialState = {
    myWord: "",
    playedCard: 0,
    finishedRound: false
}

const finishedState = {
    myWord: "Hello",
    playedCard: 1,
    finishedRound: true
}

describe('on initial render', () => {
    it("doesn't display the end turn button", () => {
        const wrapper = shallow(<PlayWordAndCard myWord={initialState.myWord} playedCard={initialState.playedCard} finishedRound={initialState.finishedRound}/>);
        expect(wrapper.exists('button#end-turn')).toEqual(false);
    });
});

describe('on start of game', () => {
    it("displays the 'Play card' and 'Play word' texts", () => {
        const wrapper = shallow(<PlayWordAndCard myWord={initialState.myWord} playedCard={initialState.playedCard} finishedRound={initialState.finishedRound}/>);
        expect(wrapper.find('h3').children().length).toEqual(2);
    });
});

describe("on current player's turn", () => {
    // TODO: Setup state for these tests
    it("displays only the 'Play word' text and box if a card has been chosen", () => {
        const wrapper = shallow(<PlayWordAndCard myWord={initialState.myWord} playedCard={finishedState.playedCard} finishedRound={initialState.finishedRound}/>);
        expect(wrapper.find('h3').text()).toEqual("Type in a word");
        expect(wrapper.exists('input')).toEqual(true);
        expect(wrapper.exists('button#send-message')).toEqual(true);
    });
    it("displays only the 'Play card' text and box if a word has been chosen", () => {
        const wrapper = shallow(<PlayWordAndCard myWord={finishedState.myWord} playedCard={initialState.playedCard} finishedRound={initialState.finishedRound}/>);
        expect(wrapper.find('h3').children().length).toEqual(1);
        expect(wrapper.find('h3').text()).toEqual("Pick a card");
    });
    it('displays the end turn button', () => {
        const wrapper = shallow(<PlayWordAndCard myWord={finishedState.myWord} playedCard={finishedState.playedCard} finishedRound={initialState.finishedRound}/>);
        expect(wrapper.exists('button#end-turn')).toEqual(true);
    });
});

describe('on player plays a word', () => {
    it('is able to input a word', () => {
        const wrapper = shallow(<PlayWordAndCard myWord={initialState.myWord} playWord={() => {}}/>);
        const input = wrapper.find('input');
        input.simulate('change', { preventDefault: () => {}, target: { value: 'Freedom' } });
        expect(wrapper.state().currentValue).toEqual('Freedom');
    })
    it('calls sendMessage', () => {
        const spy = jest.spyOn(PlayWordAndCard.prototype, 'sendMessage');
        const wrapper = shallow(<PlayWordAndCard myWord={initialState.myWord} playWord={() => {}}/>);
        wrapper.find('button#send-message').simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});

describe('on clicking the end turn button', () => {
    it('calls endTurn', () => {
        const spy = jest.spyOn(PlayWordAndCard.prototype, 'endTurn');
        const wrapper = shallow(<PlayWordAndCard myWord={finishedState.myWord} playedCard={finishedState.playedCard} finishedRound={initialState.finishedRound}/>);
        wrapper.find('button#end-turn').simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});