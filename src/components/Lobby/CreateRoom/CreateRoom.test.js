import React from 'react';
import { shallow, mount } from 'enzyme';
import { CreateRoom } from './CreateRoom';

describe('on selects a drop down option', () => {
    it('calls setRoundCount', () => {
        const setRoundCount = jest.fn();
        const wrapper = shallow(<CreateRoom setRoundCount={setRoundCount} />);
        wrapper.find({ 'data-cy': 'num-rounds-options' }).simulate('change', { preventDefault: () => {}, target: { value: 1 } });
        expect(setRoundCount).toHaveBeenCalled();
        setRoundCount.mockRestore();
    });
});

describe('on submit the create room form', () => {
    it('calls createRoom', () => {
        const createRoom = jest.fn();
        const wrapper = mount(<CreateRoom createRoom={createRoom} />);
        wrapper.find({ 'data-cy': 'create-room-form' }).simulate('submit');
        expect(createRoom).toHaveBeenCalled();
        createRoom.mockRestore();
    });
});
