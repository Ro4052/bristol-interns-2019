import { types } from './LeaderBoardActionTypes';

export const initialState = {
    players: [],
    error: null
};

const leaderBoardReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_PLAYERS:
            return {...state, players: action.players };
        case types.SET_PLAYERS_SUCCESS:
            return {...state, error: null };
        case types.SET_PLAYERS_FAILURE:
            return {...state, error: action.error };
        default:
            return state;
    }
};

export default leaderBoardReducer;
