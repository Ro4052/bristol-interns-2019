import React from 'react';
import { shallow } from 'enzyme';
import { Dixit } from './Dixit';

describe('on render', () => {
    it('renders correctly', () => {
        shallow(<Dixit />);
    });
});
