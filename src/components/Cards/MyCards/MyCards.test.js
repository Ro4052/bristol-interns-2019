import React from 'react';
import { MyCards } from './MyCards';
import moxios from 'moxios'
import axios from 'axios';
import { shallow } from 'enzyme';

describe('on initial render', () => {
    it("doesn't display all cards", () => {
        const wrapper = shallow(<MyCards fetchCards={() => {}} myCards={[]} requestPlayCard={() => {}}/>);
        expect(wrapper.exists('#my-cards li')).toEqual(false)
    });
});

describe('on given a set of cards', () => {
    const playerCards = [{cardId: 1}, {cardId: 2}, {cardId: 3}];
    it('displays the correct number of cards', () => {
        const wrapper = shallow(<MyCards myCards={playerCards} fetchCards={() => {}} requestPlayCard={() => {}}/>);
        expect(wrapper.find('ul').children().length).toEqual(3);
    });
    it('displays the correct card images', () => {
        const wrapper = shallow(<MyCards myCards={playerCards} fetchCards={() => {}} requestPlayCard={() => {}}/>);        
        expect(wrapper.find('ul').children().length).toEqual(3);
    });
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
})
