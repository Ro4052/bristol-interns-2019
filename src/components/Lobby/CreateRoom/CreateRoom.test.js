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

// describe('on click', () => {
    // it('calls createRoom', () => {
    //     const createRoom = jest.spyOn(Lobby.prototype, 'createRoom');
    //     const wrapper = mount(<Lobby username='username' rooms={[]}/>);
    //     wrapper.find({ 'data-cy': 'create-room' }).simulate('click');
    //     expect(createRoom).toHaveBeenCalled();
    //     createRoom.mockRestore();
    // });

    // it('displays the new room', () => {
    //     const wrapper = mount(
    //         <Provider store={afterClickStore}>
    //             <Lobby username='username' rooms={[room]}/>
    //         </Provider>
    //     );
    //     expect(wrapper.exists({ 'data-cy': 'room' })).toEqual(true);
    // });

   /* TODO: moxios when createRoom is moved into actions */
// });
