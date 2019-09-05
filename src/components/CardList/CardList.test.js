import React from 'react';
import { mount } from 'enzyme';
import CardList from './CardList';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);
const emptyState = { myCardsReducer: {}, playersReducer: {}, createRoomReducer: { gameMode: "original" } };
const emptyStore = mockStore(emptyState);

const cardsList = [
    { cardId: 1 },
    { cardId: 2 },
    { cardId: 3 }
];

describe('on given empty list', () => {
    it('displays no cards', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <CardList cards={[]} />
            </Provider>
        );
        expect(wrapper.find({ 'data-cy': 'card-wrapper' }).length).toEqual(0);
    });
});

describe('on given a list of cards', () => {
    it('displays the correct number of cards', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <CardList cards={cardsList} isEnabled={jest.fn()} />
            </Provider>
        );
        expect(wrapper.find({ 'data-cy': 'card-wrapper' }).length).toEqual(3);
    });
});
