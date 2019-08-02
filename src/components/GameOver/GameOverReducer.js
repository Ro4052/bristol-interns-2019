import  { types } from './GameOverActionTypes';

export const initialState = {
    winner: null, /* { username } */
    drawers: []
};

const gameOverReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_WINNER:
            return {...state, winner: action.winner };
        default:
            return state;
        case types.SET_DRAWERS:
            return {...state, drawers: action.drawers};
    }
};

export default gameOverReducer;
