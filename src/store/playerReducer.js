import { types } from './playerActions';

export const initialState = {
    playWordAndCard: false,
    playCard: false,
    myCards: [],
    allCards: [],
    playedCard: 0,
    myWord: "",
    loading: true,
    error: null,
    finishedRound: false
}

const cardReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RESET_PLAYER_STATE:
            return initialState;
        case types.FETCH_CARDS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case types.FETCH_CARDS_SUCCESS:
            return {
                ...state,
                loading: false,
                myCards: action.payload.cards
            };
        case types.FETCH_CARDS_FAILURE: 
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                myCards: []
            };
        case types.REQUEST_PLAY_CARD:
            return {
                ...state,
                playedCard: action.id,
                myCards: state.myCards.filter((card) => card.id.toString() !== action.id)
            }
        case types.SET_PLAYED_CARD:
            return {
                ...state,
                playedCard: 0
            }
        case types.FINISH_PLAY_CARD:
            return {
                ...state,
                finishedRound: true
            }
        case types.PLAY_WORD:
            return {
                ...state,
                myWord: action.word
            };
        case types.SET_PLAY_WORD_AND_CARD:
            return {
                ...state,
                playWordAndCard: action.bool
            };
        case types.SET_PLAY_CARD:
            return {
                ...state,
                playCard: action.bool
            };
        case types.MY_TURN:
            return {
                ...state,
                myTurn: true
            };
        case types.OTHERS_TURN:
            return {
                ...state,
                myTurn: false,
                othersTurn: true
            };
        default:
            return state;
    }
}

export default cardReducer;
