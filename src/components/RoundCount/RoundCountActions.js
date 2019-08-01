import { types } from './RoundCountActionTypes';

export const setRoundCount = number => {
    return {
        type: types.SET_ROUND_COUNT,
        number
    };
};
