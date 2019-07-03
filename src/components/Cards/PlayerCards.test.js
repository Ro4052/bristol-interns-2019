import React from 'react';
import { PlayerCards } from './PlayerCards';
import { shallow, mount } from 'enzyme';

describe('on initial render', () => {
    it('renders without crashing', () => {
        shallow(<PlayerCards fetchCards={() => {}} playCard={() => {}}/>);
    })
    it("doesn't display all cards", () => {
        const wrapper = shallow(<PlayerCards fetchCards={() => {}} playCard={() => {}}/>);
        expect(wrapper.exists('#my-cards li')).toEqual(false)
    })
})

const helper = {
    play(id) {
      return id;
    },
};


describe('on given a set of cards', () => {
    let playerCards = [1, 2, 3];
    it('displays the correct number of cards', () => {
        const wrapper = shallow(<PlayerCards cards={playerCards} fetchCards={() => {}} playCard={() => {}}/>);
        expect(wrapper.find('ul').children().length).toEqual(3);
    })
    it('displays the correct card images', () => {
        const wrapper = shallow(<PlayerCards cards={playerCards} fetchCards={() => {}} playCard={() => {}}/>);
        console.log(wrapper.find('ul').children());
        
        expect(wrapper.find('ul').children().length).toEqual(3);
    })
    it('is able to play a chosen card', () => {
        const mockedEvent = { target: {id: '1'} }
        const spy = jest.spyOn(PlayerCards.prototype, 'playCard');
        const wrapper = shallow(<PlayerCards cards={playerCards} fetchCards={() => {}} playCard={() => {}}/>);
        wrapper.find('#card-1').simulate('click', mockedEvent);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    })
})

