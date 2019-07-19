import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { Auth } from './Auth';
import { Prompt } from '../Prompt/Prompt';

const historyMock = { push: jest.fn() };
const authenticateUserMock = jest.fn();
const setPlayWordAndCard = jest.fn();
const setPlayCard = jest.fn();

describe('on initial mount', () => {
    it('calls authenticateUser', () => {
        shallow(<Auth history={historyMock} authenticateUser={authenticateUserMock}/>);
        expect(authenticateUserMock).toHaveBeenCalled();
        authenticateUserMock.mockRestore();
    });

    it('calls instructPlayerOnRefresh', () => {
        const instructPlayerOnRefresh = jest.spyOn(Auth.prototype, 'instructPlayerOnRefresh');
        shallow(<Auth history={historyMock} authenticateUser={authenticateUserMock}/>);
        expect(instructPlayerOnRefresh).toHaveBeenCalled();
        instructPlayerOnRefresh.mockRestore();
    });

    describe('if currentPlayer', () => {
        it('calls redux actions', (() => {
            shallow(<Auth currentPlayer={{ username: 'username' }} history={historyMock} authenticateUser={authenticateUserMock} setPlayWord={setPlayWordAndCard} setPlayCard={setPlayCard}/>);
            expect(setPlayWordAndCard).toHaveBeenCalled();
            expect(setPlayCard).toHaveBeenCalled();
            setPlayWordAndCard.mockRestore();
            setPlayCard.mockRestore();
        }));
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
        const wrapper = shallow(<Auth render={() => <Prompt/>} history={historyMock} authenticateUser={authenticateUserMock} cookie={"unicorn"}/>);
        expect(wrapper.find(Prompt).length).toEqual(1);
    });
});
