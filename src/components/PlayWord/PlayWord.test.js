import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlayWord } from './PlayWord';
import Button from '../shared/Button/Button';

describe('on initial render', () => {
    it('the input is empty', () => {
        const wrapper = shallow(<PlayWord />);
        expect(wrapper.find({ 'data-cy': 'type-word' }).text()).toEqual('');
    });
    it('the submit button is visible', () => {
        const wrapper = shallow(<PlayWord />);
        expect(wrapper.find(Button).prop('cy')).toEqual('send-word');
    });
});

describe('on player types a word', () => {
    it('calls handle change', () => {
        const spy = jest.spyOn(PlayWord.prototype, 'handleChange');
        const wrapper = shallow(<PlayWord validateWord={() => {}} />);
        wrapper.find({ 'data-cy': 'type-word' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('updates the state', () => {
        const wrapper = shallow(<PlayWord validateWord={() => {}}/>);
        wrapper.find({ 'data-cy': 'type-word' }).simulate('change',  { preventDefault: () => {}, target: { value: 'test' } });
        expect(wrapper.state().currentValue).toEqual('test');
    });
});

describe('on button click', () => {
    it('calls sendMessage', () => {
        const spy = jest.spyOn(PlayWord.prototype, 'sendMessage');
        const wrapper = mount(<PlayWord validateWord={() => {}}/>);
        wrapper.find({ 'data-cy': 'send-word' }).simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
    it('calls playWord', () => {
        const validateWord = jest.fn();
        const wrapper = mount(<PlayWord validateWord={validateWord}/>);
        wrapper.find({ 'data-cy': 'send-word' }).simulate('click');
        expect(validateWord).toHaveBeenCalled();
        validateWord.mockRestore();
    })
});

describe('on receive 400 from server due to invalid word entered', () => {
    it('displays error', () => {
        const wrapper = shallow(<PlayWord error={"Invalid word"} validateWord={() => {}}/>);

        // wrapper.find({'data-cy' :"send-error"}).text().toEqual('Invalid word');
        expect(wrapper.find({'data-cy' :"send-error"}).text()).toEqual('Invalid word');
    });
})
describe('on receive 200 form server due to valid word entered', () => {
    it('does not display error', () => {
        const wrapper = shallow(<PlayWord error={""} validateWord={() => {}}/>);
        expect(wrapper.find({'data-cy' :"send-error"}).text()).toEqual('');
    });
})
