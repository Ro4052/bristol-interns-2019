import axios from "axios";

export const types = {
    FETCH_CARDS_BEGIN: 'FETCH_CARDS_BEGIN',
    FETCH_CARDS_SUCCESS: 'FETCH_CARDS_SUCCESS',
    FETCH_CARDS_FAILURE: 'FETCH_CARDS_FAILURE',
    REQUEST_PLAY_CARD: 'REQUEST_PLAY_CARD',
    FINISH_PLAY_CARD: 'FINISH_PLAY_CARD',
    PLAY_WORD: 'PLAY_WORD',
    MY_TURN: 'MY_TURN',
    OTHERS_TURN: 'OTHERS_TURN',
    SET_PLAY_WORD_AND_CARD: 'SET_PLAY_WORD_AND_CARD',
    SET_PLAY_CARD: 'SET_PLAY_CARD',
    SET_PLAYED_CARD: "SET_PLAYED_CARD",
    RESET_PLAYER_STATE: "RESET_PLAYER_STATE"
};

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

export const setPlayedCard = id => ({
    type: types.SET_PLAYED_CARD,
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
