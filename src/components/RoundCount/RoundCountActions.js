import { types } from './RoundCountActionTypes';

export const setRoundCount = numRounds => ({
    type: types.SET_ROUND_COUNT,
    numRounds
});
