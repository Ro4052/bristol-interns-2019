import React from 'react';
import { mount } from 'enzyme';
import { LeaderboardButton } from './LeaderboardButton';

describe('on render', () => {
    it('renders correctly', () => {
        const spy = jest.spyOn(LeaderboardButton.prototype, 'goToLeaderBoard');
        const wrapper = mount(<LeaderboardButton/>);
        wrapper.find({ 'data-cy': 'go-leaderboard' }).simulate('click');
        expect(spy).toHaveBeenCalled();
    });
});
