import {FETCH_CARDS_BEGIN, FETCH_CARDS_SUCCESS, FETCH_CARDS_FAILURE, REQUEST_PLAY_CARD, FINISH_PLAY_CARD, PLAY_WORD, MY_TURN, OTHERS_TURN} from './playerActions';

export const initialState = {
    myCards: [],
    playedCard: 0,
    myWord: "",
    loading: true,
    error: null,
    myTurn: false /* true when player needs to play both a word and a card */,
    othersTurn: false /* true when player only needs to play a card given the word */
}

const cardReducer = (state = initialState, action) => {
    console.log(action);
    console.log(state);
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
            }
        case REQUEST_PLAY_CARD:
            return {
                ...state,
                playedCard: action.id
            }
        case FINISH_PLAY_CARD:
            return {
                ...state,
                playedCard: 0,
                myCards: state.myCards.filter((card) => card.toString() !== action.id)
            }
        case PLAY_WORD:
            return {
                ...state,
                myWord: action.word
            }
        case MY_TURN:
            return {
                ...state,
                myTurn: true
            }
        case OTHERS_TURN:
            return {
                ...state,
                myTurn: false,
                othersTurn: true
            }
        default:
            return state;
    }
}

export default cardReducer;