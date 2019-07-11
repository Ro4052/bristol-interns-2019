import React from 'react';
import { shallow } from 'enzyme';
import { VoteCard } from './VoteCard';

describe("on other players' turn", () => {
    it("displays the 'Vote card' text", () => {
        const wrapper = shallow(<VoteCard />);
        expect(wrapper.find('h3').text()).toEqual("Vote for a card");
    });
})