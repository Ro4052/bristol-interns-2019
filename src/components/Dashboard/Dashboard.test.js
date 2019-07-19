import React from 'react';
import PlayerCards from '../MyCards/MyCards';
import { shallow } from 'enzyme';
import { Dashboard } from './Dashboard';
import StartGame from './StartGame/StartGame';
import GameOver from '../GameOver/GameOver';

describe('on status NOT_STARTED', () => {
    it('displays the start game component', () => {
        const wrapper = shallow(<Dashboard status={"NOT_STARTED"} />);
        expect(wrapper.exists(StartGame)).toEqual(true);
    });
    it("doesn't display the cards", () => {
        const wrapper = shallow(<Dashboard status={"NOT_STARTED"}/>);
        expect(wrapper.exists(PlayerCards)).toEqual(false);
    });
});

describe('on any status other than NOT_STARTED', () => {
    it("doesn't display the start game component", () => {
        const wrapper = shallow(<Dashboard status={"STARTED"} />);
        expect(wrapper.exists(StartGame)).toEqual(false);
    });
    it('displays cards', () => {
        const wrapper = shallow(<Dashboard status={"STARTED"}/>);
        expect(wrapper.exists(PlayerCards)).toEqual(true);
    });
});

describe('on not given a current player', () => {
    it("doesn't display a current player", () => {
        const wrapper = shallow(<Dashboard />);
        expect(wrapper.exists({ 'data-cy': 'current-player' })).toEqual(false);
    });
});

describe('on given a current player', () => {
    it("displays a current player", () => {
        const wrapper = shallow(<Dashboard currentPlayer={{ username: "username"}} />);
        expect(wrapper.find({ 'data-cy': 'current-player' }).text()).toEqual("username");
    });
});

describe('on winner', () => {
    it('displays GameOver', () => {
        const wrapper = shallow(<Dashboard winner={{ username: 'username' }} />);
        expect(wrapper.exists(GameOver)).toEqual(true);
    })
});

describe('on no winner', () => {
    it("doesn't display GameOver", () => {
        const wrapper = shallow(<Dashboard />);
        expect(wrapper.exists(GameOver)).toEqual(false);
    });
});
