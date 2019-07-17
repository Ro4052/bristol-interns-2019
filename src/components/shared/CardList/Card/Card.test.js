import React from 'react';
import { shallow } from 'enzyme';
import { Card } from './Card';

const card1 = { cardId: 1 };

describe('on enabled', () => {
    it("has the correct className", () => {
        const wrapper = shallow(<Card card={card1} enabled={true}/>);
        expect(wrapper.find({ 'data-cy': 'card' }).first().prop('className')).toEqual('card enabled');
    });
});

describe('on not enabled', () => {
    it("has the correct className", () => {
        const wrapper = shallow(<Card card={card1} enabled={false}/>);
        expect(wrapper.find({ 'data-cy': 'card' }).first().prop('className')).toEqual('card disabled');
    });

});

describe('on click', () => {
    it('calls the handleClick function', () => {
        const spy = jest.spyOn(Card.prototype, 'handleClick');
        const wrapper = shallow(<Card card={card1} enabled={false} />);
        wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('calls the handleClick function from props', () => {
        const spy = jest.fn();
        const wrapper = shallow(<Card card={card1} enabled={true} handleClick={spy} />);
        wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
