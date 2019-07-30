import { types } from './PlayedCardsActionTypes';

export const initialState = {
    cards: [],
    hidden: true,
    voteCard: false,
    votedCardId: null,
    error: null,
    votes: []
};

const playedCardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_PLAYED_CARDS:
            return { ...state, cards: action.cards, hidden: action.hidden };
        case types.SET_VOTE_CARD:
            return { ...state, voteCard: action.voteCard };
        case types.VOTE_FOR_CARD_BEGIN:
            return { ...state, error: null };
        case types.VOTE_FOR_CARD_SUCCESS:            
            return { ...state, votedCardId: action.cardId, voteCard: false };
        case types.VOTE_FOR_CARD_FAILURE: 
            return { ...state, error: action.error };
        case types.SET_VOTED_CARD:
            return { ...state, votedCardId: action.cardId };
        case types.SET_ALL_VOTES:
            return {...state, votes: action.votes };
        default:
            return state;
    }
}

export default playedCardsReducer;
