import React from 'react';
import {AllCards} from './AllCards';
import { shallow, mount } from 'enzyme';

describe('on initial render', () => {
    it('renders without crashing', () => {
        shallow(<AllCards/>);
    })
    it("doesn't display all cards", () => {
        const wrapper = shallow(<AllCards/>);
        expect(wrapper.exists('#played-cards li')).toEqual(false)
    })
})

describe('on given a set of played cards', () => {
    it('displays the cards currently played', () => {
        let cards = [
            {
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
        ]
        const wrapper = shallow(<AllCards cards={cards}/>);
        expect(wrapper.find('ul').children().length).toEqual(3);
    })
})

