import React from 'react';
import { shallow } from 'enzyme';
import { CardList } from './CardList';

const cardsList = [
    { cardId: 1 },
    { cardId: 2 },
    { cardId: 3 }
];

describe('on render', () => {
    it('has the correct data-cy attribute', () => {
        const wrapper = shallow(<CardList cards={[]} cy="test-cy" />);
        expect(wrapper.exists({ 'data-cy': 'test-cy' })).toEqual(true);
    });
});

describe('on given empty list', () => {
    it('displays no cards', () => {
        const wrapper = shallow(<CardList cards={[]} cy="test-cy" />);
        expect(wrapper.find({ 'data-cy': 'test-cy' }).children().length).toEqual(0);
    });
});

describe('on given a list of cards', () => {
    it('displays the correct number of cards', () => {
        const wrapper = shallow(<CardList cards={cardsList} cy="test-cy" isEnabled={jest.fn()} />);
        expect(wrapper.find({ 'data-cy': 'test-cy' }).children().length).toEqual(3);
    });
});
