import React from 'react';
import { shallow } from 'enzyme';
import { PlayWord } from './PlayWord';

describe('on initial render', () => {
    it('the input is empty', () => {
        const wrapper = shallow(<PlayWord />);
        expect(wrapper.find({ 'data-cy': 'type-word' }).text()).toEqual('');
    });
    it('the submit button is visible', () => {
        const wrapper = shallow(<PlayWord />);
        expect(wrapper.find({ 'data-cy': 'send-word' }).exists()).toEqual(true);
    });
});

describe('on player types a word', () => {
    it('calls handle change', () => {
        const spy = jest.spyOn(PlayWord.prototype, 'handleChange');
        const wrapper = shallow(<PlayWord playWord={() => {}} />);
        wrapper.find({ 'data-cy': 'type-word' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('updates the state', () => {
        const wrapper = shallow(<PlayWord playWord={() => {}}/>);
        wrapper.find({ 'data-cy': 'type-word' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(wrapper.state().currentValue).toEqual('test');
    });
});

describe('on button click', () => {
    it('calls sendMessage', () => {
        const spy = jest.spyOn(PlayWord.prototype, 'sendMessage');
        const wrapper = shallow(<PlayWord playWord={() => {}}/>);
        wrapper.find({ 'data-cy': 'send-word' }).simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('calls playWord', () => {
        const playWord = jest.fn();
        const wrapper = shallow(<PlayWord playWord={playWord}/>);
        wrapper.find({ 'data-cy': 'send-word' }).simulate('click');
        expect(playWord).toHaveBeenCalled();
        playWord.mockRestore();
    })
});
