import { types } from './TimerActionTypes';

export const setVoteCardTimer = voteCardDuration => ({
    type: types.SET_VOTE_CARD_TIMER,
    voteCardDuration
});

export const resetVoteCardTimer = () => ({
    type: types.RESET_VOTE_CARD_TIMER,
});

export const setPlayCardTimer = playCardDuration => ({
    type: types.SET_PLAY_CARD_TIMER,
    playCardDuration
});

export const resetPlayCardTimer = () => ({
    type: types.RESET_PLAY_CARD_TIMER,
});

export const setStorytellerTimer = storytellerDuration => ({
    type: types.SET_STORYTELLER_TIMER,
    storytellerDuration
});

export const resetStorytellerTimer = () => ({
    type: types.RESET_STORYTELLER_TIMER
});
