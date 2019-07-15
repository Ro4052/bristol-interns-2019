import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { Auth } from './Auth';
import { Prompt } from '../Prompt/Prompt';

describe('on initial mount', () => {
    it('returns null if still loading', () => {
        const wrapper = shallow(<Auth render={() => <Prompt cy="test" text="test" />}/>);
        expect(wrapper.type()).toEqual(null);
        expect(wrapper.find(Redirect).length).toEqual(0);
        expect(wrapper.find(Prompt).length).toEqual(0);
    });
    it('redirects if stopped loading and unauthenticated', () => {
        const wrapper = shallow(<Auth render={() => <Prompt cy="test" text="test" />}/>);
        wrapper.setState({ loading: false, authenticated: false });
        expect(wrapper.find(Redirect).length).toEqual(1);
        expect(wrapper.find(Prompt).length).toEqual(0);
    });
    it('renders the component if stopped loading and authenticated', () => {
        const wrapper = shallow(<Auth render={() => <Prompt cy="test" text="test" />}/>);
        wrapper.setState({ loading: false, authenticated: true });
        expect(wrapper.find(Redirect).length).toEqual(0);
        expect(wrapper.find(Prompt).length).toEqual(1);
    });
});
