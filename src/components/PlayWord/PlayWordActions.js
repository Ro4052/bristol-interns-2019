import axios from "axios";
import { types } from './PlayWordActionTypes';

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setPlayWord = playWord => ({
    type: types.SET_PLAY_WORD,
    playWord
});

export const validateWordSuccess = () => ({
    type: types.VALIDATE_WORD_SUCCESS
});

export const validateWordFailure = error => ({
    type: types.VALIDATE_WORD_FAILURE,
    error
});

export const playWord = word => ({
    type: types.PLAY_WORD,
    word
});

export const validateWord = word => dispatch => {
    axiosInstance.post('/api/validWord', { word })
    .then(res => {
        if (res.status === 200) {
            dispatch(validateWordSuccess());
            dispatch(playWord(word));
        } else throw Error(res.data.message);
    })
    .catch(err => dispatch(validateWordFailure(err.message)));
};
