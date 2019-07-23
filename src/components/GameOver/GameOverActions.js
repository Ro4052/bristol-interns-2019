import { types } from './GameOverActionTypes';

export const setWinner = winner => ({
    type: types.SET_WINNER,
    winner
});
