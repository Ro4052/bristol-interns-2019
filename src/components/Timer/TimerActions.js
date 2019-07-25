import { types } from './TimerActionTypes';

export const setVoteCardTimer = voteCardDuration => {
    console.log("setVoteCardTimer: ", voteCardDuration);
    return {
        type: types.SET_VOTE_CARD_TIMER,
        voteCardDuration
    };
};
export const setPlayCardTimer = playCardDuration => {
    console.log("setPlayCardTimer: ", playCardDuration);
    return {
        type: types.SET_PLAY_CARD_TIMER,
        playCardDuration
    };
};

