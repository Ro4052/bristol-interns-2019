import { types } from './MyCardsActionTypes';
import axios from "axios";

let instance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const fetchCardsSuccess = cards => ({
    type: types.FETCH_CARDS_SUCCESS,
    cards
});

export const fetchCardsFailure = error => ({
    type: types.FETCH_CARDS_FAILURE,
    error
});

export const setPlayCard = playCard => ({
    type: types.SET_PLAY_CARD,
    playCard
});

export const selectCard = cardId => ({
    type: types.SELECT_CARD,
    cardId
});

export const finishPlayCard = (cardId) => ({
    type: types.FINISH_PLAY_CARD,
    cardId
});

export const resetFinishRound = finishedRound => ({
    type: types.RESET_FINISH_ROUND,
    finishedRound
});

export const fetchCards = () => dispatch => {
    instance.get('/api/cards')
    .then(res => {
        res.status === 200 ?
        dispatch(fetchCardsSuccess(res.data)) :
        dispatch(fetchCardsFailure(res.data.message));
    })
    .catch(err => dispatch(fetchCardsFailure(err.message)));
}
