import { types } from './CreateRoomActionTypes';

export const setRoundCount = numRounds => ({
    type: types.SET_ROUND_COUNT,
    numRounds
});
