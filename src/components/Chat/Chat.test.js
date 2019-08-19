import React from 'react';
import { shallow } from 'enzyme';
import { Chat } from './Chat';

describe('on initial render', () => {
    it('displays the new message icon if there are some', () => {
        jest.spyOn(Chat.prototype, 'scrollToBottom').mockImplementation(jest.fn());
        const wrapper = shallow(<Chat messages={[]} newMessages={["Hello"]} />);
        expect(wrapper.exists({ 'data-cy': 'new-message' }));
    });
});
