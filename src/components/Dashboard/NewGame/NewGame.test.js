import React from 'react';
import { shallow } from 'enzyme';
import { NewGame } from './NewGame';
import Button from '../../shared/Button/Button';

describe('on render', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<NewGame />);
        expect(wrapper.exists(Button)).toEqual(true);
    });
});
