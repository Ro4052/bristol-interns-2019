import { types } from './RoundCountActionTypes';

export const initialState = {
    number: null
}

const roundCountReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_ROUND_COUNT:
            return {...state, number: action.number};
        default:
            return state;
    }
}

export default roundCountReducer
