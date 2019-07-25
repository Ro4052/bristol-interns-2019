import { types } from './LobbyActionTypes';

export const initialState = {
    rooms: [],
    error: null
};

const lobbyReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_ROOMS:
            return {...state, rooms: action.rooms };
        case types.JOIN_ROOM_FAILURE:
            return {...state, error: action.error };
        default:
            return state;
    }
};

export default lobbyReducer;
