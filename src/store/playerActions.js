import axios from "axios";

export const FETCH_CARDS_BEGIN   = 'FETCH_CARDS_BEGIN';
export const FETCH_CARDS_SUCCESS = 'FETCH_CARDS_SUCCESS';
export const FETCH_CARDS_FAILURE = 'FETCH_CARDS_FAILURE';
export const REQUEST_PLAY_CARD = 'REQUEST_PLAY_CARD';
export const FINISH_PLAY_CARD = 'FINISH_PLAY_CARD';
export const PLAY_WORD  = 'PLAY_WORD';
export const MY_TURN  = 'MY_TURN';
export const OTHERS_TURN  = 'OTHERS_TURN';
export const SET_PLAY_WORD_AND_CARD = 'SET_PLAY_WORD_AND_CARD';
export const SET_PLAY_CARD = 'SET_PLAY_CARD';
export const SET_PLAYED_CARD = "SET_PLAYED_CARD";
export const RESET_PLAYER_STATE = "RESET_PLAYER_STATE";

export const resetPlayerState = () => ({
    type: RESET_PLAYER_STATE
});

export const fetchCardsBegin = () => ({
    type: FETCH_CARDS_BEGIN
});

export const fetchCardsSuccess = (cards) => ({
    type: FETCH_CARDS_SUCCESS,
    payload: { cards }
});

export const fetchCardsFailure = (error) => ({
    type: FETCH_CARDS_FAILURE,
    payload: { error }
});

export const fetchCards = () => {
    return (dispatch) => {
        dispatch(fetchCardsBegin());
        return axios.get('/api/cards')
        .then(res => {
            dispatch(fetchCardsSuccess(res.data));
        })
        .catch(error => dispatch(fetchCardsFailure(error)));
    }
}

export const requestPlayCard = (id) => ({
    type: REQUEST_PLAY_CARD,
    id
});

export const finishPlayCard = (id) => ({
    type: FINISH_PLAY_CARD,
    id
});

export const playWord = (word) => ({
    type: PLAY_WORD,
    word
});

export const setPlayedCard = id => ({
    type: SET_PLAYED_CARD,
    id
});

export const setPlayWordAndCard = bool => ({
    type: SET_PLAY_WORD_AND_CARD,
    bool
});

export const setPlayCard = bool => ({
    type: SET_PLAY_CARD,
    bool
});
