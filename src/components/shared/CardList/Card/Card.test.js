import React from 'react';
import { shallow } from 'enzyme';
import { Card } from './Card';

const card1 = {
    cardId: 1,
    votes: 1
};

describe('on render', () => {
    it("has the correct className", () => {
        const wrapper = shallow(<Card card={card1} enabled={true}/>);
        expect(wrapper.find({ 'data-cy': 'card' }).first().prop('className')).toEqual('card');
    });
});

describe('on enabled', () => {
    it("has the correct className", () => {
        const wrapper = shallow(<Card card={card1} enabled={true}/>);
        expect(wrapper.find({ 'data-cy': 'card-wrapper-enabled' }).first().prop('className')).toEqual('cardWrapper enabled');
    });
});

describe('on disabled', () => {
    it("has the correct className", () => {
        const wrapper = shallow(<Card card={card1} enabled={false}/>);
        expect(wrapper.find({ 'data-cy': 'card-wrapper-disabled' }).first().prop('className')).toEqual('cardWrapper disabled');
    });
});

describe('on votes prop', () => {
    it("displays the votes", () => {
        const wrapper = shallow(<Card card={card1} enabled={false} />);
        expect(wrapper.find({ 'data-cy': 'vote' }).first().text()).toEqual('Votes: 1');
    });
});

describe('on click', () => {
    it('calls the handleClick function', () => {
        const handleClick = jest.spyOn(Card.prototype, 'handleClick');
        const wrapper = shallow(<Card card={card1} enabled={false} />);
        wrapper.find({ 'data-cy': 'card-wrapper-disabled' }).first().simulate('click');
        expect(handleClick).toHaveBeenCalled();
        handleClick.mockRestore();
    });
    it('calls the handleClick function from props if enabled', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<Card card={card1} enabled={true} handleClick={handleClick} />);
        wrapper.find({ 'data-cy': 'card-wrapper-enabled' }).first().simulate('click');
        expect(handleClick).toHaveBeenCalled();
        handleClick.mockRestore();
    });
    it("doesn't call the handleClick function from props if disabled", () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<Card card={card1} enabled={false} handleClick={handleClick} />);
        wrapper.find({ 'data-cy': 'card-wrapper-disabled' }).first().simulate('click');
        expect(handleClick).not.toHaveBeenCalled();
        handleClick.mockRestore();
    });
});
