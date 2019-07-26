import { types } from './TimerActionTypes';

export const setVoteCardTimer = voteCardDuration => ({
    type: types.SET_VOTE_CARD_TIMER,
    voteCardDuration
});

export const setPlayCardTimer = playCardDuration => ({
    type: types.SET_PLAY_CARD_TIMER,
    playCardDuration
});