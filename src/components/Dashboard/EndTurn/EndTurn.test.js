import React from 'react';
import { shallow } from 'enzyme';
import { EndTurn } from './EndTurn';
import Button from '../../shared/Button/Button';

describe('on render', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<EndTurn />);
        expect(wrapper.exists(Button)).toEqual(true);
    });
});
