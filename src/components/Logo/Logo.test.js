import React from 'react';
import { shallow } from 'enzyme';
import Logo from './Logo';

describe('on render', () => {
    it('renders correctly', () => {
        shallow(<Logo />);
    });
});
