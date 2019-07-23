import React from 'react';
import { shallow } from 'enzyme';
import { Logout } from './Logout';
import Button from '../shared/Button/Button';

describe('on render', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<Logout />);
        expect(wrapper.exists(Button)).toEqual(true);
    });
});

// describe('on render', () => {
//     it('displays the correct text', () => {
//         const wrapper = shallow(<LogoutButton logOutUser={() => {}}/>);
//         expect(wrapper.find({ 'data-cy': 'logout' }).text()).toEqual('Log out');
//     });
// });

// describe('on click', () => {
//     it('calls the logout function', () => {
//         const spy = jest.spyOn(LogoutButton.prototype, 'logOut');
//         const wrapper = shallow(<LogoutButton logOutUser={() => {}}/>);
//         wrapper.find('button').simulate('click');
//         expect(spy).toHaveBeenCalled();
//         spy.mockRestore();
//     });
// });
