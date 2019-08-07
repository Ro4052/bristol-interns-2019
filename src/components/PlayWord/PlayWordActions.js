import axios from "axios";
import { types } from './PlayWordActionTypes';

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const resetWord = () => ({
    type: types.RESET_PLAY_WORD
});

export const setPlayWord = playWord => ({
    type: types.SET_PLAY_WORD,
    playWord
});

export const sendWordSuccess = word => ({
    type: types.SEND_WORD_SUCCESS,
    word
});

export const sendWordFailure = error => ({
    type: types.SEND_WORD_FAILURE,
    error
});

export const sendWord = word => (dispatch, getState) => {
    const state = getState();
    const cardId = state.myCardsReducer.playedCardId;
    axiosInstance.post('/api/play-card-word', { cardId, word })
    .then(res => {
        if (res.status === 200) {
            dispatch(sendWordSuccess(word));
        } else {
            throw Error(res.data.message);
        }
    })
    .catch(err => dispatch(sendWordFailure(err.message)));
};
