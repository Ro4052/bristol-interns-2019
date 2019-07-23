import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { Auth } from './Auth';
import { Prompt } from '../Prompt/Prompt';

const historyMock = { push: jest.fn() };
const authenticateUserMock = jest.fn();

describe('on initial mount', () => {
    it('calls authenticateUser', () => {
        shallow(<Auth history={historyMock} authenticateUser={authenticateUserMock}/>);
        expect(authenticateUserMock).toHaveBeenCalled();
        authenticateUserMock.mockRestore();
    });
});

describe('on unauthenticated', () => {
    it('redirects', () => {
        const wrapper = shallow(<Auth history={historyMock} authenticateUser={authenticateUserMock}/>);
        wrapper.setState({ loading: false, authenticated: false });
        expect(wrapper.find(Redirect).length).toEqual(1);
        expect(wrapper.find(Prompt).length).toEqual(0);
    });
});

describe('on authenticated', () => {
    it('renders the protected component', () => {
        const wrapper = shallow(<Auth render={() => <Prompt/>} history={historyMock} authenticateUser={authenticateUserMock} username={"unicorn"}/>);
        expect(wrapper.find(Prompt).length).toEqual(1);
    });
});
