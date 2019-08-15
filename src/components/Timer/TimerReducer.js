import { types } from './TimerActionTypes';

export const initialState = {
    playCardDuration: 0,
    voteCardDuration: 0,
    storytellerDuration: 0,
    error: null
};

const timerReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_PLAY_CARD_TIMER:
            return { ...state, playCardDuration: action.playCardDuration };
        case types.SET_VOTE_CARD_TIMER:
            return { ...state, voteCardDuration: action.voteCardDuration };
        case types.SET_STORYTELLER_TIMER:
            return { ...state, storytellerDuration: action.storytellerDuration };
        case types.REQUEST_NEW_ROUND_SUCCESS:
            return { ...state, error: null };
        case types.REQUEST_NEW_ROUND_FAILURE:
            return { ...state, error: action.error };
        default:
            return state;
    }   
}

export default timerReducer;
