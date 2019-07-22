import React from 'react';
import { Provider } from 'react-redux';
import { MyCards } from './MyCards';
import moxios from 'moxios';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';

const initialState = {
    playerReducer: {
        playedCard: 2
    }
};
const middlewares = [];
const mockStore = configureStore(middlewares);
const store = mockStore(initialState);

const cards = [
    { cardId: 1 }
];

describe('on initial render', () => {
    it('calls fetchCards', (() => {
        const fetchCards = jest.fn();
        shallow(<MyCards fetchCards={fetchCards} myCards={[]} requestPlayCard={() => {}}/>);
        expect(fetchCards).toHaveBeenCalled();
        fetchCards.mockRestore();
    }));
});

describe('on clicking an enabled card', () => {
    it('calls playCard', () => {
        jest.spyOn(MyCards.prototype, 'isEnabled').mockImplementation(() => true);
        const playCard = jest.spyOn(MyCards.prototype, 'playCard');
        const wrapper = mount(
            <Provider store={store}>
                <MyCards fetchCards={jest.fn()} myCards={cards} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
        expect(playCard).toHaveBeenCalled();
        playCard.mockRestore();
    });

    describe('on playWordAndCard flag true', () => {
        it('calls requestPlayCard', (() => {
            jest.spyOn(MyCards.prototype, 'isEnabled').mockImplementation(() => true);
            const requestPlayCard = jest.fn();
            const wrapper = mount(
                <Provider store={store}>
                    <MyCards fetchCards={jest.fn()} myCards={cards} requestPlayCard={requestPlayCard} playWordAndCard={true} />
                </Provider>
            );
            wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
            expect(requestPlayCard).toHaveBeenCalled();
            requestPlayCard.mockRestore();
        }));
    });

    describe('on playCard flag true', () => {
        beforeEach(() => moxios.install());
        afterEach(() => moxios.uninstall());
        it('calls requestPlayCard', (() => {
            jest.spyOn(MyCards.prototype, 'isEnabled').mockImplementation(() => true);
            const requestPlayCard = jest.fn();
            const wrapper = mount(
                <Provider store={store}>
                    <MyCards fetchCards={jest.fn()} myCards={cards} requestPlayCard={requestPlayCard} playCard={true} />
                </Provider>
            );
            wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
            expect(requestPlayCard).toHaveBeenCalled();
            requestPlayCard.mockRestore();
        }));
        it('calls playCardForWord', () => {
            jest.spyOn(MyCards.prototype, 'isEnabled').mockImplementation(() => true);
            const playCardForWord = jest.spyOn(MyCards.prototype, 'playCardForWord');
            const wrapper = mount(
                <Provider store={store}>
                    <MyCards fetchCards={jest.fn()} myCards={cards} requestPlayCard={jest.fn()} playCard={true} />
                </Provider>
            );
            wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
            expect(playCardForWord).toHaveBeenCalled();
            playCardForWord.mockRestore();
        });

        describe('on successful api call', () => {
            it('calls finishPlayCard', (done) => {
                moxios.stubRequest('/api/playCard', { status: 200 });
                jest.spyOn(MyCards.prototype, 'isEnabled').mockImplementation(() => true);
                const finishPlayCard = jest.fn();
                const wrapper = mount(
                    <Provider store={store}>
                        <MyCards fetchCards={jest.fn()} myCards={cards} requestPlayCard={jest.fn()} finishPlayCard={finishPlayCard} playCard={true} />
                    </Provider>
                );
                wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
                moxios.wait(() => {
                    expect(finishPlayCard).toHaveBeenCalled();
                    finishPlayCard.mockRestore();
                    done();
                });
            });
        });

        describe('on unsuccessful api call', () => {
            it("doesn't call finishPlayCard", (done) => {
                moxios.stubRequest('/api/playCard', { status: 400 });
                jest.spyOn(MyCards.prototype, 'isEnabled').mockImplementation(() => true);
                const finishPlayCard = jest.fn().mockImplementation(() => console.log('finishPlayCard'));
                const wrapper = mount(
                    <Provider store={store}>
                        <MyCards fetchCards={jest.fn()} myCards={cards} requestPlayCard={jest.fn()} finishPlayCard={finishPlayCard} playCard={true} />
                    </Provider>
                );
                wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
                moxios.wait(() => {
                    expect(finishPlayCard).not.toHaveBeenCalled();
                    finishPlayCard.mockRestore();
                    done();
                });
            });
        });
    });
});

describe('on clicking a disabled card', () => {
    it("doesn't call playCard", () => {
        jest.spyOn(MyCards.prototype, 'isEnabled').mockImplementation(() => false);
        const playCard = jest.spyOn(MyCards.prototype, 'playCard');
        
        const wrapper = mount(
            <Provider store={store}>
                <MyCards fetchCards={jest.fn()} myCards={cards} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'card' }).first().simulate('click');
        expect(playCard).not.toHaveBeenCalled();
        playCard.mockRestore();
    });
});
