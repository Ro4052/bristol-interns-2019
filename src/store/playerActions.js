import axios from "axios";
import connectSocket from '../services/socket';
import types from './playerActionTypes';
import { resetState } from "./gameActions";

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
    axios.get('/api/cards')
    .then(res => {
        dispatch(fetchCardsSuccess(res.data));
    })
    .catch(error => dispatch(fetchCardsFailure(error)));
}

export const requestPlayCard = (id) => ({
    type: types.REQUEST_PLAY_CARD,
    id
});

export const finishPlayCard = (id) => ({
    type: types.FINISH_PLAY_CARD,
    id
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

export const voteForCard = (id) => (dispatch) => {
    dispatch(voteForCardBegin());
    axios.post('/api/voteCard', {
        card: id
    })
    .then(() => {
        dispatch(voteForCardSuccess(id));
    })
    .catch(error => dispatch(voteForCardFailure("Cannot vote for card")));
}

export const setPlayedCard = id => ({
    type: types.SET_PLAYED_CARD,
    id
});

export const setVotedCard = id => ({
    type: types.SET_VOTED_CARD,
    id
});

export const setPlayWordAndCard = bool => ({
    type: types.SET_PLAY_WORD_AND_CARD,
    bool
});

export const setPlayCard = bool => ({
    type: types.SET_PLAY_CARD,
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
    axios.get('/api/reset-cookie')
    .then(() => dispatch(resetCookieSuccess()))
    .catch((err) => dispatch(resetCookieFailure("Cannot reset cookie")));
};

export const resetCookieFailure = (error) => ({
    type: types.RESET_COOKIE_FAILURE,
    payload: { error }
});

export const resetCookieSuccess = () => ({
    type: types.RESET_COOKIE_SUCCESS
});

export const logIn = (username) => (dispatch) => {
    axios.post('/auth/login', {
        username: username
    })
    .then(() => {
        connectSocket();
        dispatch(logInSuccess(username))
    })
    .catch((err) => {
        if (err.message.includes(409)) dispatch(logInFailure("Username already exists"));
        else if (err.message.includes(400)) dispatch(logInFailure("Game has already started"));
        else dispatch(logInFailure("Cannot log in - Server Error"))
    });
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
    axios.get('/auth', {
    validateStatus: (status) => {
        return status < 500;
    }})
    .then(res => {            
        if (res.status === 200) {
            connectSocket();
            dispatch(authSuccess(res.data.cookie));
        } else if (res.status === 401) {
            dispatch(authFailure("Unauthorised"));
            dispatch(resetState());
            dispatch(resetPlayerState());
        } else {
            const error = new Error(res.error);
            dispatch(authFailure(""));
            dispatch(resetState());
            dispatch(resetPlayerState());
            throw error;
        }
    })
    .catch(() => {
        dispatch(authFailure(""));
        dispatch(resetState());
        dispatch(resetPlayerState());
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