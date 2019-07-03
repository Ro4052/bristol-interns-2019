import {FETCH_CARDS_BEGIN, FETCH_CARDS_SUCCESS, FETCH_CARDS_FAILURE, PLAY_CARD} from './cardsActions';

export const initialState = {
    cards: [],
    loading: true,
    error: null
}

const cardReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CARDS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_CARDS_SUCCESS:
            return {
                ...state,
                loading: false,
                cards: action.payload.cards
            };
        case FETCH_CARDS_FAILURE: 
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                cards: []
            }
        case PLAY_CARD:
            return {
                ...state,
                cards: state.cards.filter((card) => card.toString() !== action.id)
            }
        default:
            return state;
    }
}

export default cardReducer;