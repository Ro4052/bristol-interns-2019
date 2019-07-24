import { types } from './LobbyActionTypes';

export const initialState = {
    rooms: []
};

const lobbyReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_ROOMS:
            return {...state, rooms: action.rooms };
        default:
            return state;
    }
};

export default lobbyReducer;
