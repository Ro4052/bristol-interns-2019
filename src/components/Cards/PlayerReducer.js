import {FETCH_CARDS_BEGIN, FETCH_CARDS_SUCCESS, FETCH_CARDS_FAILURE, REQUEST_PLAY_CARD, FINISH_PLAY_CARD, PLAY_WORD} from './playerActions';

export const initialState = {
    myCards: [],
    playedCard: 0,
    myWord: "",
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
            console.log(state.myCards);
            
            return {
                ...state,
                myCards: state.myCards.filter((card) => card.toString() !== action.id)
            }
        case PLAY_WORD:
            return {
                ...state,
                myWord: action.word
            }
        default:
            return state;
    }
}

export default cardReducer;