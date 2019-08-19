import React from 'react';
import { shallow } from 'enzyme';
import { Timer } from './Timer';

describe('on render', () => {
    it('has the initial number to be the number given from the server', () => {
        const duration = 2;
        jest.spyOn(Timer.prototype, 'componentDidMount').mockImplementation(jest.fn());
        const wrapper = shallow(<Timer cy="card-timer" reset={() => this.props.setPlayCardTimer(0)} duration={duration} />);
        expect(wrapper.find({'data-cy' :"card-timer"}).text()).toEqual(duration.toString());
    });
});
