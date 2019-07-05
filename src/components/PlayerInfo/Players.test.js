import React from 'react';
import { shallow } from 'enzyme';
import {Players} from './Players';
import {PlayerInteractions} from './PlayerInteractions';

describe('on initial render', () => {
    it("doesn't display any players", () => {
        const wrapper = shallow(<Players players={[]} />);
        expect(wrapper.find('ul#players').children().length).toEqual(0);
    });
    it("doesn't display the end turn button", () => {
        const wrapper = shallow(<PlayerInteractions myTurn={false} />);
        expect(wrapper.exists('button#end-turn')).toEqual(false);
    });
    it("displays the start game button", () => {
        const wrapper = shallow(<PlayerInteractions />);
        expect(wrapper.exists('button#start-game')).toEqual(true);
    });
    describe('on clicking the start game button', () => {
        it('calls startGame', () => {
            const spy = jest.spyOn(PlayerInteractions.prototype, 'startGame');
            const wrapper = shallow(<PlayerInteractions started={false}/>);
            wrapper.find('button#start-game').simulate('click');
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});

describe('on start of game', () => {
    it("doesn't display the start game button", () => {
        const wrapper = shallow(<PlayerInteractions started={true} />);
        expect(wrapper.exists('#start-game')).toEqual(false);
    });
});

describe('before you have finished your turn', () => {
    // TODO: Setup state for these tests
    it('displays the end turn button', () => {
        const wrapper = shallow(<PlayerInteractions started={true} myTurn={true} myWord={"hi"} playedCard={1}/>);
        expect(wrapper.exists('button#end-turn')).toEqual(true);
    });
    describe('on clicking the end turn button', () => {
        it('calls endTurn', () => {
            const spy = jest.spyOn(PlayerInteractions.prototype, 'endTurn');
            const wrapper = shallow(<PlayerInteractions started={true} myTurn={true} myWord={"hi"} playedCard={1}/>);
            wrapper.find('button#end-turn').simulate('click');
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});