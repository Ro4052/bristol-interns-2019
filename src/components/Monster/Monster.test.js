import React from 'react';
import { shallow } from 'enzyme';
import { Monster } from './Monster';

describe('on render', () => {
    it('renders correctly', () => {
        shallow(<Monster />);
    });
});
