import  { types } from './GameOverActionTypes';

export const initialState = {
    winner: null, /* { username } */
    drawers: []
};

const gameOverReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_WINNER:
            return {...state, winner: action.winner };
        case types.SET_DRAWERS:
            return {...state, drawers: action.drawers};
        default:
            return state;
    }
};

export default gameOverReducer;
