import React from 'react';
import { mount } from 'enzyme';
import moxios from 'moxios';
import { EndTurn } from './EndTurn';

describe('on click', () => {
    beforeEach(() => moxios.install());
    afterEach(() => moxios.uninstall());

    it('calls endTurn', () => {
        const endTurn = jest.spyOn(EndTurn.prototype, 'endTurn');
        const wrapper = mount(<EndTurn />);
        wrapper.find({ 'data-cy': 'end-turn' }).simulate('click');
        expect(endTurn).toHaveBeenCalled();
        endTurn.mockRestore();
    });

    describe('on successful api request', () => {
        it('calls finishPlayCard', done => {
            moxios.stubRequest('/api/playCardWord', { status: 200 });
            const finishPlayCard = jest.fn();
            const wrapper = mount(<EndTurn finishPlayCard={finishPlayCard} />);  
            wrapper.find({ 'data-cy': 'end-turn' }).first().simulate('click');
            moxios.wait(() => {
                expect(finishPlayCard).toHaveBeenCalled();
                finishPlayCard.mockRestore();
                done();
            });

        });
    });

    describe('on unsuccessful api request', () => {
        it("doesn't call finishPlayCard", done => {
            moxios.stubRequest('/api/playCardWord', { status: 400 });
            const finishPlayCard = jest.fn();
            const wrapper = mount(<EndTurn finishPlayCard={finishPlayCard} />);  
            wrapper.find({ 'data-cy': 'end-turn' }).first().simulate('click');
            moxios.wait(() => {
                expect(finishPlayCard).not.toHaveBeenCalled();
                finishPlayCard.mockRestore();
                done();
            });
        });
    });
});
