import axios from "axios";
import connectSocket from '../services/socket';
import types from './playerActionTypes';
import { resetState } from "./gameActions";

let instance = axios.create({
    validateStatus: function (status) {
        return status >= 200 && status < 500;
    }
});

export const resetPlayerState = () => ({
    type: types.RESET_PLAYER_STATE
});

export const fetchCardsBegin = () => ({
    type: types.FETCH_CARDS_BEGIN
});

export const fetchCardsSuccess = (cards) => ({
    type: types.FETCH_CARDS_SUCCESS,
    payload: { cards }
});

export const fetchCardsFailure = (error) => ({
    type: types.FETCH_CARDS_FAILURE,
    payload: { error }
});

export const fetchCards = () => (dispatch) => {
    dispatch(fetchCardsBegin());
    instance.get('/api/cards')
    .then(res => {
        if (res.status === 200) {
            dispatch(fetchCardsSuccess(res.data));
        } else {
            dispatch(fetchCardsFailure(res.data.message));
        }
    })
    .catch(err => dispatch(fetchCardsFailure(err.message)));
}

export const requestPlayCard = (cardId) => ({
    type: types.REQUEST_PLAY_CARD,
    cardId
});

export const finishPlayCard = (cardId) => ({
    type: types.FINISH_PLAY_CARD,
    cardId
});

export const playWord = (word) => ({
    type: types.PLAY_WORD,
    word
});

export const voteForCardBegin = () => ({
    type: types.VOTE_FOR_CARD_BEGIN
});

export const voteForCardSuccess = (card) => ({
    type: types.VOTE_FOR_CARD_SUCCESS,
    payload: { card }
});

export const voteForCardFailure = (error) => ({
    type: types.VOTE_FOR_CARD_FAILURE,
    payload: { error }
});

export const voteForCard = (cardId) => (dispatch) => {
    dispatch(voteForCardBegin());
    instance.post('/api/voteCard', { cardId })
    .then((res) => {
        if (res.status === 200) {
            dispatch(voteForCardSuccess(cardId));
        } else {
            dispatch(voteForCardFailure(res.data.message));
        }
    })
    .catch(err => dispatch(voteForCardFailure(err.message)));
}

export const setPlayedCard = cardId => ({
    type: types.SET_PLAYED_CARD,
    cardId
});

export const setVotedCard = cardId => ({
    type: types.SET_VOTED_CARD,
    cardId
});

export const setPlayCard = bool => ({
    type: types.SET_PLAY_CARD,
    bool
});

export const setPlayWord = bool => ({
    type: types.SET_PLAY_WORD,
    bool
});

export const setVoteCard = bool => ({
    type: types.SET_VOTE_CARD,
    bool
});

export const resetFinishRound = bool => ({
    type: types.RESET_FINISH_ROUND,
    bool
});

export const resetCookie = () => (dispatch) => {
    instance.get('/api/reset-cookie')
    .then((res) => {
        if (res.status === 200) {
            dispatch(resetCookieSuccess());
        } else {
            dispatch(resetCookieFailure(res.data.message));
        }
    })
    .catch((err) => dispatch(resetCookieFailure(err.message)));
};

export const resetCookieFailure = (error) => ({
    type: types.RESET_COOKIE_FAILURE,
    payload: { error }
});

export const resetCookieSuccess = () => ({
    type: types.RESET_COOKIE_SUCCESS
});

export const logIn = (username) => {
    return dispatch => {
        return instance.post('/auth/login', {
            username: username
        })
        .then((res) => {
            if (res.status === 200) {
                connectSocket().then(() => {
                    dispatch(logInSuccess(username));
                });
            } else {
                dispatch(logInFailure(res.data.message));
            }
        })
        .catch((err) => dispatch(logInFailure(err.message)));
    }
};

export const logInFailure = (error) => ({
    type: types.LOG_IN_FAILURE,
    payload: { error }
});

export const logInSuccess = (cookie) => ({
    type: types.LOG_IN_SUCCESS,
    payload: { cookie }
});

export const authenticateUser = () => (dispatch) => {
    dispatch(authBegin());
    instance.get('/auth')
    .then(res => {            
        if (res.status === 200) {
            connectSocket().then(() => {
                dispatch(authSuccess(res.data.cookie));
            });
        } else {
            dispatch(resetState());
            dispatch(resetPlayerState());
            dispatch(authFailure(res.data.message));
        }
    })
    .catch((err) => {
        dispatch(resetState());
        dispatch(resetPlayerState());
        dispatch(authFailure(err.message));
    });
}

export const authBegin = () => ({
    type: types.AUTH_BEGIN
});

export const authFailure = (error) => ({
    type: types.AUTH_FAILURE,
    payload: { error }
});

export const authSuccess = (cookie) => ({
    type: types.AUTH_SUCCESS,
    payload: { cookie }
});

export const logOutUser = () => (dispatch) => {
    instance.get('/auth/logout')
    .then(res => {
        if (res.status === 200) {
            dispatch(resetState());
            dispatch(resetPlayerState());
            dispatch(logOutSuccess());
        } else {
            dispatch(logOutFailure(res.data.message));
            window.alert(res.data.message);
        }
    })
    .catch((err) => {
        dispatch(logOutFailure(err.message));
        window.alert(err.message);
    })
}

export const logOutSuccess = () => ({
    type: types.LOG_OUT_SUCCESS
});

export const logOutFailure = (error) => ({
    type: types.LOG_OUT_FAILURE,
    payload: { error }
});

export const setInvalidWord = bool => ({
    type: types.SET_INVALID_WORD,
    bool
});

export const validateWord = (word) => (dispatch) => {
    instance.post('/api/validWord', {
        word: word
    })
    .then(res => {
        console.log(res);
        
        if (res.status === 200) {
            dispatch(setInvalidWord(false));
            dispatch(playWord(word));
        } else {
            dispatch(setInvalidWord(true));
            dispatch(validateWordFailure(res.data.message));
        }
    })
    .catch(err => {
        dispatch(setInvalidWord(true));
        dispatch(validateWordFailure(err.message));
    })
}

export const validateWordSuccess = () => ({
    type: types.VALIDATE_WORD_SUCCESS
});

export const validateWordFailure = (error) => ({
    type: types.VALIDATE_WORD_FAILURE,
    payload: { error }
});
