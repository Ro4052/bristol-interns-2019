import { SET_STATUS, SET_ROUND_NUMBER, SET_CURRENT_PLAYER, SET_PLAYERS, SET_CURRENT_CARDS, SET_CURRENT_WORD, SET_SOCKET} from './actions';
import { RESET_PLAYER_STATE } from './playerActions';

export const initialState = {
    status: "NOT_STARTED",
    roundNum: 0,
    currentPlayer: null, /* { username } */
    players: [], /* [{ username, score }] */
    currentCards: [], /* [{ cardId }] */
    currentWord: '',
    socket: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case RESET_PLAYER_STATE:
            return initialState;
        case SET_STATUS:
            return {...state, status: action.status };
        case SET_ROUND_NUMBER:
            return {...state, roundNum: action.roundNum };
        case SET_CURRENT_PLAYER:
            return {...state, currentPlayer: action.currentPlayer };
        case SET_PLAYERS:
            return {...state, players: action.players };
        case SET_CURRENT_CARDS:
            return {...state, currentCards: action.currentCards };
        case SET_CURRENT_WORD:
            return {...state, currentWord: action.currentWord };
        case SET_SOCKET:
            return {...state, socket: action.socket };
        default:
            return state;
    }
}

export default reducer;
