import React from 'react';
import { shallow } from 'enzyme';
import { Timothy } from './Timothy';

describe('on render', () => {
    it('renders correctly', () => {
        shallow(<Timothy />);
    });
});
