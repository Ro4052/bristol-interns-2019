import { types } from './TimerActionTypes';

export const initialState = {
    playCardDuration: 0,
    voteCardDuration: 0
};

const timerReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_PLAY_CARD_TIMER:
            return {...state, playCardDuration: action.playCardDuration };
        case types.SET_VOTE_CARD_TIMER:
            return {...state, voteCardDuration: action.voteCardDuration };
        default:
            return state;
    }   
}

export default timerReducer;
