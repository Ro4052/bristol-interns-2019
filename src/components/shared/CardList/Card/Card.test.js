import React from 'react';
import { shallow } from 'enzyme';
import { Card } from './Card';

const card1 = {
    cardId: 1,
    username: "halfling",
    votes: [{ username: "unicorn", cardId: 1 }]
};

const newScores = [
    { username: "halfling", score: 15 }
];

describe('on enabled', () => {
    it("has the correct className", () => {
        const wrapper = shallow(<Card card={card1} newScores={newScores} enabled={true}/>);
        expect(wrapper.find({ 'data-cy': 'card-wrapper' }).first().prop('className')).toEqual('cardWrapper enabled');
    });
});

describe('on disabled', () => {
    it("has the correct className", () => {
        const wrapper = shallow(<Card card={card1} newScores={newScores} enabled={false}/>);
        expect(wrapper.find({ 'data-cy': 'card-image' }).first().prop('className')).toEqual('image fade');
    });
});

describe('on votes prop', () => {
    it("displays the votes", () => {
        const wrapper = shallow(<Card card={card1} newScores={newScores} enabled={false} />);        
        expect(wrapper.find({ 'data-cy': 'voter' }).first().text()).toEqual('unicorn');
    });
});

describe('on click', () => {
    it('calls the handleClick function', () => {
        const handleClick = jest.spyOn(Card.prototype, 'handleClick');
        const wrapper = shallow(<Card card={card1} newScores={newScores} enabled={false} />);
        wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
        expect(handleClick).toHaveBeenCalled();
        handleClick.mockRestore();
    });

    it('calls the handleClick function from props if enabled', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<Card card={card1} newScores={newScores} enabled={true} handleClick={handleClick} />);
        wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
        expect(handleClick).toHaveBeenCalled();
        handleClick.mockRestore();
    });

    it("doesn't call the handleClick function from props if disabled", () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<Card card={card1} newScores={newScores} enabled={false} handleClick={handleClick} />);
        wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
        expect(handleClick).not.toHaveBeenCalled();
        handleClick.mockRestore();
    });
});
