import React from 'react';
import { PlayedCards } from './PlayedCards';
import { shallow } from 'enzyme';
import card1 from '../cards/card (1).jpg';

const empty = [];
const oneCard = [
    { id: 1 }
];
const twoCards = [
    { id: 1 }, 
    { id: 2 }
];

describe('if given no cards', () => {
    it("doesn't display any cards", () => {
        const wrapper = shallow(<PlayedCards cards={empty} />);
        expect(wrapper.find('#played-cards').children().length).toEqual(0);
    });
});

describe('if given one card', () => {
    it("displays one card", () => {
        const wrapper = shallow(<PlayedCards cards={oneCard} />);
        expect(wrapper.find('#played-cards').children().length).toEqual(1);
    });
    it("gives it the correct src", () => {
        const wrapper = shallow(<PlayedCards cards={oneCard} />);
        expect(wrapper.find('#played-cards img').prop("src")).toEqual(card1);
    });
});

describe('if given two cards', () => {
    it("displays two cards", () => {
        const wrapper = shallow(<PlayedCards cards={twoCards} />);
        expect(wrapper.find('#played-cards').children().length).toEqual(2);
    });
});
