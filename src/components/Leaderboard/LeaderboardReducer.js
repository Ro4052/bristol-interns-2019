import { types } from './LeaderboardActionTypes';

export const initialState = {
    players: [],
    error: null
};

const leaderboardReducer = (state = initialState, action) => {    
    switch (action.type) {
        case types.GET_PLAYERS_SUCCESS:
            return { ...state, players: action.players, error: null };
        case types.GET_PLAYERS_FAILURE:
            return { ...state, error: action.error };
        default:
            return state;
    }
};

export default leaderboardReducer;
