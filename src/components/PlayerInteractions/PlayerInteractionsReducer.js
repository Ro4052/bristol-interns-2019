import { types } from './PlayerInteractionsActionTypes';

export const initialState = {
    finishedRound: false,
    error: null
};

const endTurnReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FINISH_PLAY_CARD:
            return {...state, finishedRound: true };
        case types.FINISH_PLAY_CARD_FAILURE:
            return {...state, error: action.error };
        case types.RESET_FINISH_ROUND:
            return {...state, finishedRound: false };
        default:
            return state;
    }
};

export default endTurnReducer;
