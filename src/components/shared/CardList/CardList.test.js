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

// describe('on enabled', () => {
//     it("has the correct className", () => {
//         const wrapper = shallow(<CardList card={card1} enabled={true}/>);
//         expect(wrapper.find({ 'data-cy': `card-${card1.cardId}` }).prop('className')).toEqual('card enabled');
//     });
// });

// describe('on not enabled', () => {
//     it("has the correct className", () => {
//         const wrapper = shallow(<CardList card={card1} enabled={false}/>);
//         expect(wrapper.find({ 'data-cy': `card-${card1.cardId}` }).prop('className')).toEqual('card disabled');
//     });

// });

// describe('on click', () => {
//     it('calls the handleClick function', () => {
//         const spy = jest.spyOn(CardList.prototype, 'handleClick');
//         const wrapper = shallow(<CardList card={card1} enabled={false} />);
//         wrapper.find({ 'data-cy': `card-${card1.cardId}` }).simulate('click');
//         expect(spy).toHaveBeenCalled();
//         spy.mockRestore();
//     });
//     it('calls the handleClick function from props', () => {
//         const spy = jest.fn();
//         const wrapper = shallow(<CardList card={card1} enabled={true} handleClick={spy} />);
//         wrapper.find({ 'data-cy': `card-${card1.cardId}` }).simulate('click');
//         expect(spy).toHaveBeenCalled();
//         spy.mockRestore();
//     });
// });
