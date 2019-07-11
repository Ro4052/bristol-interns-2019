import React from 'react';
import { shallow } from 'enzyme';
import { PlayCard } from './PlayCard';

describe("on other players' turn", () => {
    it("displays the 'Play card' text", () => {
        const wrapper = shallow(<PlayCard />);
        expect(wrapper.find('h3').text()).toEqual("Pick a card");
    });
})