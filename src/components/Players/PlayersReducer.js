import { types } from './PlayersActionTypes';

export const initialState = {
    players: [], /* [{ username, score }] */
    currentPlayer: null, /* { username } */
};

const playersReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_PLAYERS:
            return {...state, players: action.players };
        case types.SET_CURRENT_PLAYER:
            return {...state, currentPlayer: action.currentPlayer };
        default:
            return state;
    }
};

export default playersReducer;
