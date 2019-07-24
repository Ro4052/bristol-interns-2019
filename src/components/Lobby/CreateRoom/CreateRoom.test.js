import React from 'react';
import { shallow } from 'enzyme';
import { CreateRoom } from './CreateRoom';
import Button from '../../shared/Button/Button';

describe('on initial render', () => {
    
    it('create room button is displayed', () => {
        const wrapper = shallow(<CreateRoom />);
        expect(wrapper.exists(Button)).toEqual(true);
    });

   /* TODO: moxios when createRoom is moved into actions */
});
