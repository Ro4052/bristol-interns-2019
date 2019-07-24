import React from 'react';
import { mount } from 'enzyme';
import { CreateRoom } from './CreateRoom';

describe('on click', () => {
    
    it('calls createRoom', () => {
        const createRoom = jest.spyOn(CreateRoom.prototype, 'createRoom');
        const wrapper = mount(<CreateRoom />);
        wrapper.find({ 'data-cy': 'create-room' }).simulate('click');
        expect(createRoom).toHaveBeenCalled();
        createRoom.mockRestore();
    });

   /* TODO: moxios when createRoom is moved into actions */
});
