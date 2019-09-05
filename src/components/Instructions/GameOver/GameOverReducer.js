import  { types } from './GameOverActionTypes';

export const initialState = {
    winners: []
};

const gameOverReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_WINNERS:
            return {...state, winners: action.winners };
        default:
            return state;
    }
};

export default gameOverReducer;
