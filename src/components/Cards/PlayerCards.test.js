import React from 'react';
import { PlayerCards } from './PlayerCards';
import moxios from 'moxios'
import axios from 'axios';
const express = require('express');
import { shallow, mount } from 'enzyme';
import SocketMock from 'socket.io-mock';

describe('on initial render', () => {
    it('renders without crashing', () => {
        shallow(<PlayerCards fetchCards={() => {}} playCard={() => {}}/>);
    })
    it("doesn't display all cards", () => {
        const wrapper = shallow(<PlayerCards fetchCards={() => {}} playCard={() => {}}/>);
        expect(wrapper.exists('#my-cards li')).toEqual(false)
    })
})

describe('on given a set of cards', () => {
    let playerCards = [1, 2, 3];
    it('displays the correct number of cards', () => {
        const wrapper = shallow(<PlayerCards cards={playerCards} fetchCards={() => {}} playCard={() => {}}/>);
        expect(wrapper.find('ul').children().length).toEqual(3);
    })
    it('displays the correct card images', () => {
        const wrapper = shallow(<PlayerCards cards={playerCards} fetchCards={() => {}} playCard={() => {}}/>);        
        expect(wrapper.find('ul').children().length).toEqual(3);
    })
    it('is able to play a chosen card', () => {
        const socket = new SocketMock();
        const mockedEvent = { target: {id: '1'} }
        const spy = jest.spyOn(PlayerCards.prototype, 'playCard');
        const wrapper = shallow(<PlayerCards socket={socket} cards={playerCards} fetchCards={() => {}} playCard={() => {}}/>);
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
                const wrapper = shallow(<PlayerCards cards={cards} fetchCards={() => {}} playCard={() => {}}/>);
                expect(wrapper.find('ul').children().length).toEqual(3)
            })
            
        })
    })
})
