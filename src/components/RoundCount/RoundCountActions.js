import { types } from './RoundCountActionTypes';

export const setRoundCount = number => ({
    type: types.SET_ROUND_COUNT,
    number
});
