import React from 'react';
import { PlayedCards } from './PlayedCards';
import { shallow } from 'enzyme';

const empty = [];

const oneCard = [1];



describe('if given no cards', () => {
    it("doesn't display any cards", () => {
        const wrapper = shallow(<PlayedCards cards={[]} />);
    });
});
