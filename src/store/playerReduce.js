import {FETCH_CARDS_BEGIN, SET_PLAYED_CARD, SET_PLAY_WORD_AND_CARD, SET_PLAY_CARD, FETCH_CARDS_SUCCESS, FETCH_CARDS_FAILURE, REQUEST_PLAY_CARD, FINISH_PLAY_CARD, PLAY_WORD, MY_TURN, OTHERS_TURN} from './playerActions';

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
                myCards: action.payload.cards
            };
        case FETCH_CARDS_FAILURE: 
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                myCards: []
            };
        case REQUEST_PLAY_CARD:
            return {
                ...state,
                playedCard: action.id,
                myCards: state.myCards.filter((card) => card.toString() !== action.id)
            }
        case SET_PLAYED_CARD:
            return {
                ...state,
                playedCard: 0
            }
        case FINISH_PLAY_CARD:
            return {
                ...state,
                finishedRound: true
            }
        case PLAY_WORD:
            return {
                ...state,
                myWord: action.word
            };
        case SET_PLAY_WORD_AND_CARD:
            return {
                ...state,
                playWordAndCard: action.bool
            };
        case SET_PLAY_CARD:
            return {
                ...state,
                playCard: action.bool
            };
        case MY_TURN:
            return {
                ...state,
                myTurn: true
            };
        case OTHERS_TURN:
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
