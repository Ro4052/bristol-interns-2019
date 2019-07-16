import React from 'react';
import { MyCards } from './MyCards';
import moxios from 'moxios'
import axios from 'axios';
import { shallow } from 'enzyme';
import SocketMock from 'socket.io-mock';

describe('on initial render', () => {
    it("doesn't display all cards", () => {
        const wrapper = shallow(<MyCards fetchCards={() => {}} myCards={[]} requestPlayCard={() => {}}/>);
        expect(wrapper.exists('#my-cards li')).toEqual(false)
    })
})

describe('on given a set of cards', () => {
    let playerCards = [{cardId: 1}, {cardId: 2}, {cardId: 3}];
    it('displays the correct number of cards', () => {
        const wrapper = shallow(<MyCards myCards={playerCards} fetchCards={() => {}} requestPlayCard={() => {}}/>);
        expect(wrapper.find('ul').children().length).toEqual(3);
    })
    it('displays the correct card images', () => {
        const wrapper = shallow(<MyCards myCards={playerCards} fetchCards={() => {}} requestPlayCard={() => {}}/>);        
        expect(wrapper.find('ul').children().length).toEqual(3);
    })
    it('is able to play a chosen card', () => {
        const socket = new SocketMock();
        const mockedEvent = { target: {cardId: '1'} }
        const spy = jest.spyOn(MyCards.prototype, 'playCard');
        const wrapper = shallow(<MyCards socket={socket} myCards={playerCards} playedCard={0} fetchCards={() => {}} requestPlayCard={() => {}}/>);
        wrapper.find('#card-1').simulate('click', mockedEvent);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    })
})

describe('moxios', () => {
    it('should install', () => {
      let defaultAdapter = axios.defaults.adapter
      moxios.install()
      expect(axios.defaults.adapter === defaultAdapter).toEqual(false);
      moxios.uninstall()
    })

    it('should uninstall', () => {
        let defaultAdapter = axios.defaults.adapter
        moxios.install()
        moxios.uninstall()
        expect(axios.defaults.adapter === defaultAdapter).toEqual(true);
    })    

    describe('GET /api/cards', () => {
        beforeEach(() => {
            moxios.install()
        })
    
        afterEach(() => {
            moxios.uninstall()
        })

        it('should get cards', () => {
            moxios.stubRequest('/api/cards', {
                status: 200,
                response: {
                    cards: [1, 2, 3]
                }
            });

            axios.get('/api/cards').then(response => {
                let cards = response.data.cards;
                const wrapper = shallow(<MyCards cards={cards} fetchCards={() => {}} playCard={() => {}}/>);
                expect(wrapper.find('ul').children().length).toEqual(3)
            })
            
        })
    })
    describe('when myTurn is true and click', () => {
        let playerCards = [{cardId: 1}, {cardId: 2}, {cardId: 3}];
        it('calls sendCard and playCard', () => {
            const socket = new SocketMock();
            const mockedEvent = { target: {cardId: '1'} }
            const spy = jest.spyOn(MyCards.prototype, 'playCard')
            const wrapper = shallow(<MyCards socket={socket} myCards={playerCards} playedCard={0} fetchCards={() => {}} requestPlayCard={() => {}} />);
            wrapper.find('#card-1').simulate('click', mockedEvent);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        })

    })
})
