import { types } from './gameActions';

export const initialState = {
    status: "NOT_STARTED",
    roundNum: 0,
    currentPlayer: null, /* { username } */
    players: [], /* [{ username, score }] */
    currentCards: [], /* [{ cardId }] */
    currentWord: '',
    socket: null
}

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RESET_STATE:
            return initialState;
        case types.SET_STATUS:
            return {...state, status: action.status };
        case types.SET_ROUND_NUMBER:
            return {...state, roundNum: action.roundNum };
        case types.SET_CURRENT_PLAYER:
            return {...state, currentPlayer: action.currentPlayer };
        case types.SET_PLAYERS:
            return {...state, players: action.players };
        case types.SET_CURRENT_CARDS:
            return {...state, currentCards: action.currentCards };
        case types.SET_CURRENT_WORD:
            return {...state, currentWord: action.currentWord };
        case types.SET_ALL_VOTES:
            return {...state, allVotes: action.allVotes };
        case types.SET_SOCKET:
            return {...state, socket: action.socket };
        default:
            return state;
    }
}

export default gameReducer;
