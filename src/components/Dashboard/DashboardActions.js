import { types } from './DashboardActionTypes';

export const setStatus = status => ({
    type: types.SET_STATUS,
    status
});

export const setRoundNumber = (roundNum, rounds) => ({
    type: types.SET_ROUND_NUMBER,
    roundNum,
    rounds
});

export const setCurrentWord = currentWord => ({
    type: types.SET_CURRENT_WORD,
    currentWord
});
