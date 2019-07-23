import { types } from './MyCardsActionTypes';

export const initialState = {
    cards: [],
    playCard: false,
    playedCardId: null,
    error: null,
    finishedRound: false
};

const myCardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_CARDS_SUCCESS:
            return {...state, cards: action.cards, error: null };
        case types.FETCH_CARDS_FAILURE: 
            return { ...state, cards: [], error: action.error };
        case types.SELECT_CARD:
            return {...state, playedCardId: action.cardId, playCard: false };
        case types.SET_PLAY_CARD:
            return {...state, playCard: action.playCard };
        case types.FINISH_PLAY_CARD:
            return {...state, finishedRound: true, cards: state.cards.filter(card => card.cardId !== action.cardId) };
        case types.RESET_FINISH_ROUND:
            return {...state, finishedRound: false };
        default:
            return state;
    }
}

export default myCardsReducer;
