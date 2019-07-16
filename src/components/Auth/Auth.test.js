import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { Auth } from './Auth';
import { Prompt } from '../Prompt/Prompt';

const historyMock = { push: jest.fn() };

describe('on initial mount', () => {
    it('redirects if user is unauthenticated', () => {
        const wrapper = shallow(<Auth history={historyMock} authenticateUser={() => {}}/>);
        wrapper.setState({ loading: false, authenticated: false });
        expect(wrapper.find(Redirect).length).toEqual(1);
        expect(wrapper.find(Prompt).length).toEqual(0);
    });
    it('renders the component if stopped loading and authenticated', () => {
        const wrapper = shallow(<Auth render={() => <Prompt/>} history={historyMock} authenticateUser={() => {}} cookie={"unicorn"}/>);
        expect(wrapper.find(Prompt).length).toEqual(1);
    });
});
