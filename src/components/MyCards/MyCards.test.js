import React from 'react';
import { Provider } from 'react-redux';
import { MyCards } from './MyCards';
import moxios from 'moxios';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';

const initialState = {
    myCardsReducer: {
        playedCardId: 2
    },
    dashboardReducer: {
        status: ""
    }
};
const middlewares = [];
const mockStore = configureStore(middlewares);
const store = mockStore(initialState);

const cards = [
    { cardId: 1 }
];

beforeEach(() => moxios.install());
afterEach(() => moxios.uninstall());

describe('on initial render', () => {
    it('calls fetchCards', (() => {
        const fetchCards = jest.fn();
        shallow(<MyCards fetchCards={fetchCards} cards={[]} selectCard={() => {}}/>);
        expect(fetchCards).toHaveBeenCalled();
        fetchCards.mockRestore();
    }));
});

describe('on clicking an enabled card', () => {
    it('calls selectCard', (() => {
        const selectCard = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <MyCards fetchCards={jest.fn()} cards={cards} selectCard={selectCard} playCard={true} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'card-image' }).first().simulate('click');
        expect(selectCard).toHaveBeenCalled();
        selectCard.mockRestore();
    }));
});

describe('on clicking a disabled card', () => {
    it("doesn't call selectCard", () => {
        const selectCard = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <MyCards fetchCards={jest.fn()} cards={cards} selectCard={selectCard} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'card-image' }).first().simulate('click');
        expect(selectCard).not.toHaveBeenCalled();
        selectCard.mockRestore();
    });
});
