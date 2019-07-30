import React from 'react';
import { shallow } from 'enzyme';
import { HiddenCard } from './HiddenCard';
import cardBack from '../../../../images/cardBack.jpg';

describe('on render', () => {
    it("has the correct image", () => {
        const wrapper = shallow(<HiddenCard />);        
        expect(wrapper.find({ 'data-cy': 'card' }).first().prop('src')).toEqual(cardBack);
    });
});
