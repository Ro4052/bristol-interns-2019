import { types } from './CreateRoomActionTypes';

export const initialState = {
    numRounds: 3,
    gameMode: "telltales",
    error: null
}

const createRoomReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_ROUND_COUNT:
            return { ...state, numRounds: action.numRounds, error: null };
        case types.SET_GAME_MODE:
            return { ...state, gameMode: action.gameMode, error: null };
        case types.CREATE_ROOM_FAILURE:
            return { ...state, error: action.error };
        case types.CREATE_ROOM_SUCCESS:
            return { ...state, error: null };
        default:
            return state;
    }
}

export default createRoomReducer;
