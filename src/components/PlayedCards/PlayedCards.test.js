import React from 'react';
import { PlayedCards } from './PlayedCards';
import { shallow } from 'enzyme';
import CardList from '../../shared/CardList/CardList';

describe('on render', () => {
    it('renders a CardList', () => {
        const wrapper = shallow(<PlayedCards />);
        expect(wrapper.exists(CardList)).toEqual(true);
    });
});
