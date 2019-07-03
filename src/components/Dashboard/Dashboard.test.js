import React from 'react';
import Dashboard from './Dashboard';
import { shallow, mount } from 'enzyme';

describe('on initial render', () => {
    it("renders without crashing", () => {
        shallow(<Dashboard />);
    });
    it("doesn't display a current player", () => {
        const wrapper = shallow(<Dashboard />);
        // expect(wrapper.exists('#current-player')).toEqual(false);
    });
});

// // describe('on given a current player', () => {
// //     it('displays the username of the current player', () => {
// //         const wrapper = shallow(<Turn />);
// //
// //         expect(wrapper.find('#current-player').text()).toEqual('player1');
// //     });
// // });

// //     it("displays the username of", () => {
// //         const turn = shallow(<Turn />);
// //         turn.setState({
// //             gameState: {
// //                 currentPlayer: "Player"
// //             }
// //         });
// //     });
// // });
