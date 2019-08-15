import { types } from './TimerActionTypes';
import axios from 'axios';

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setVoteCardTimer = voteCardDuration => ({
    type: types.SET_VOTE_CARD_TIMER,
    voteCardDuration
});

export const setPlayCardTimer = playCardDuration => ({
    type: types.SET_PLAY_CARD_TIMER,
    playCardDuration
});

export const setStorytellerTimer = storytellerDuration => ({
    type: types.SET_STORYTELLER_TIMER,
    storytellerDuration
});

export const nextRoundSuccess = () => ({
    type: types.REQUEST_NEXT_ROUND_SUCCESS
});

export const nextRoundFailure = (error) => ({
    type: types.REQUEST_NEXT_ROUND_FAILURE,
    error
});

export const requestNextRound = () => dispatch => {
    axiosInstance.get('/api/nextRound')
    .then((res) => {
        if (res.status === 200) {
            dispatch(nextRoundSuccess());
        } else {
            dispatch(nextRoundFailure(res.data.message));
        }
    })
    .catch(err => console.error(err.message));
};
