import  { types } from './GameOverActionTypes';

export const initialState = {
    winner: null, /* { username } */
};

const gameOverReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_WINNER:
            return {...state, winner: action.winner };
        default:
            return state;
    }
};

export default gameOverReducer;
