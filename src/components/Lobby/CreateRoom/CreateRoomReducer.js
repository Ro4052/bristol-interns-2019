import { types } from './CreateRoomActionTypes';

export const initialState = {
    numRounds: null
}

const createRoomReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_ROUND_COUNT:
            return {...state, numRounds: action.numRounds};
        default:
            return state;
    }
}

export default createRoomReducer;
