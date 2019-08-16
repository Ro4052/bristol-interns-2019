import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlayWord } from './PlayWord';

describe('on initial render', () => {
    it('the input is empty', () => {
        const wrapper = shallow(<PlayWord />);
        expect(wrapper.find({ 'data-cy': 'type-word' }).text()).toEqual('');
    });
    it('the submit button is visible', () => {
        const wrapper = shallow(<PlayWord />);
        expect(wrapper.find({ 'data-cy': 'send-word' }));
    });
});

describe('on player types in the box', () => {
    it('calls handle change', () => {
        const spy = jest.spyOn(PlayWord.prototype, 'handleChange');
        const wrapper = shallow(<PlayWord />);
        wrapper.find({ 'data-cy': 'type-word' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('updates the state', () => {
        const wrapper = shallow(<PlayWord />);
        wrapper.find({ 'data-cy': 'type-word' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(wrapper.state().currentValue).toEqual('test');
    });
});

describe('on button click', () => {
    it('calls sendWord', () => {
        const sendWord = jest.fn();
        const wrapper = mount(<PlayWord sendWord={sendWord} />);
        wrapper.find({ 'data-cy': 'play-word-form' }).simulate('submit');
        expect(sendWord).toHaveBeenCalled();
        sendWord.mockRestore();
    });
});

describe('on receive 400 from server due to invalid word entered', () => {
    it('displays error', () => {
        const wrapper = shallow(<PlayWord error={"Invalid word"} />);
        expect(wrapper.find({'data-cy' :"send-error"}).text()).toEqual('Invalid word');
    });
})
describe('on receive 200 form server due to valid word entered', () => {
    it('does not display error', () => {
        const wrapper = shallow(<PlayWord error={""} />);
        expect(wrapper.find({'data-cy' :"send-error"}).text()).toEqual('');
    });
});

describe('on play card flag', () => {
    it('displays the play word prompt', () => {
        const wrapper = shallow(<PlayWord playWord={true} />);
        expect(wrapper.find({'data-cy' :"play-word"}));
    });
});
