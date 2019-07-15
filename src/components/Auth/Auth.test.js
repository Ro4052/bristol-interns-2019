import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { Auth } from './Auth';
import { PlayCard } from '../PlayerInfo/PlayCard/PlayCard';

const historyMock = { push: jest.fn() };

describe('on initial mount', () => {
    it('returns null if still loading', () => {
        const wrapper = shallow(<Auth history={historyMock} authenticateUser={() => {}}/>);
        wrapper.setState({ loading: true });
        expect(wrapper.type()).toEqual(null);
    });
    it('redirects if stopped loading and unauthenticated', () => {
        const wrapper = shallow(<Auth history={historyMock} authenticateUser={() => {}}/>);
        wrapper.setState({ loading: false, authenticated: false });
        expect(wrapper.find(Redirect).length).toEqual(1);
    });
    it('renders the component if stopped loading and authenticated', () => {
        const wrapper = shallow(<Auth render={() => <PlayCard/>} history={historyMock} authenticateUser={() => {}}/>);
        wrapper.setState({ loading: false, authenticated: true });
        expect(wrapper.find(PlayCard).length).toEqual(1);
    });
});
