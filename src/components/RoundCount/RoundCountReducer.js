import { types } from './RoundCountActionTypes';

export const initialState = {
    numRounds: null
}

const roundCountReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_ROUND_COUNT:
            return {...state, numRounds: action.numRounds};
        default:
            return state;
    }
}

export default roundCountReducer
