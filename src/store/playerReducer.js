import types from './playerActionTypes';

export const initialState = {
    cookie: null,
    playWordAndCard: false,
    playWord: false,
    playCard: false,
    voteCard: false,
    myCards: [],
    allCards: [],
    playedCard: 0,
    votedCard: 0,
    myWord: "",
    error: null,
    finishedRound: false,
    endTurn: false
}

const cardReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RESET_PLAYER_STATE:
            return initialState;
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
                playCard: false,
                playedCard: action.cardId
            }
        case types.SET_PLAYED_CARD:
            return {
                ...state,
                playedCard: action.cardId
            }
        case types.SET_VOTED_CARD:
            return {
                ...state,
                votedCard: action.cardId
            }
        case types.FINISH_PLAY_CARD:
            return {
                ...state,
                finishedRound: true,
                myCards: state.myCards.filter(card => card.cardId !== action.cardId)
            }
        case types.PLAY_WORD:
            return {
                ...state,
                myWord: action.word,
                playWord: false
            };
        case types.VOTE_FOR_CARD_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case types.VOTE_FOR_CARD_SUCCESS:            
            return {
                ...state,
                loading: false,
                votedCard: action.payload.card,
                voteCard: false
            };
        case types.VOTE_FOR_CARD_FAILURE: 
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                votedCard: 0
            };
        case types.SET_PLAY_CARD:
            return {
                ...state,
                playCard: action.bool
            };
        case types.SET_PLAY_WORD:
            return {
                ...state,
                playWord: action.bool
            };
        case types.SET_VOTE_CARD:
            return {
                ...state,
                voteCard: action.bool
            };
        case types.RESET_FINISH_ROUND:
            return {
                ...state,
                finishedRound: false
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
        case types.RESET_COOKIE_FAILURE:
            return {
                ...state,
                error: action.payload.error
            };
        case types.RESET_COOKIE_SUCCESS:
            return {
                ...state,
                cookie: null
            };
        case types.LOG_IN_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                cookie: null
            };
        case types.LOG_IN_SUCCESS:
            return {
                ...state,
                cookie: action.payload.cookie
            };
        case types.AUTH_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            }
        case types.AUTH_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                cookie: null,
                loading: false
            }
        case types.AUTH_SUCCESS:
            return {
                ...state,
                cookie: action.payload.cookie,
                loading: false
            }
        case types.LOG_OUT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            }
        case types.LOG_OUT_SUCCESS:
            return {
                ...state,
                cookie: null,
                loading: false,
                error: null
            }
        case types.SET_INVALID_WORD:
            return {
                ...state, 
                invalidWord: action.bool
            }
        case types.VALIDATE_WORD_FAILURE:
            return {
                ...state,
                error: action.payload.error
            }
        default:
            return state;
    }
}

export default cardReducer;
