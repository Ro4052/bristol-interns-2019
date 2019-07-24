import { types } from './DashboardActionTypes';

export const setStatus = status => ({
    type: types.SET_STATUS,
    status
});

export const setRoundNumber = roundNum => ({
    type: types.SET_ROUND_NUMBER,
    roundNum
});

export const setCurrentWord = currentWord => ({
    type: types.SET_CURRENT_WORD,
    currentWord
});
