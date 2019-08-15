import { types } from './PlayersActionTypes';

export const initialState = {
    players: [], /* [{ username, score }] */
    newScores: [], /* [{ username, newScore }] */
    currentPlayer: null, /* { username } */
};

const playersReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_PLAYERS:
            return { ...state, players: action.players };
        case types.SET_SCORES_FOR_ROUND:
            return { 
                ...state,
                newScores: action.players.map(player => ({
                    username: player.username,
                    score: (state.players.find(other => other.username === player.username)) 
                        ? (player.score - state.players.find(other => other.username === player.username).score) 
                        : player.score
                }))
            };
        case types.SET_CURRENT_PLAYER:
            return { ...state, currentPlayer: action.currentPlayer };
        default:
            return state;
    }
};

export default playersReducer;
