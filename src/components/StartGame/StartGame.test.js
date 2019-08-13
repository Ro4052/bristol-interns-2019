import React from 'react';
import { shallow } from 'enzyme';
import { StartGame } from './StartGame';

describe('on render', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<StartGame />);
        expect(wrapper.find({ 'data-cy': 'start-game' }));
    });
});
