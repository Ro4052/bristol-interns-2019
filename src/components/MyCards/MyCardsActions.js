import { types } from './MyCardsActionTypes';
import axios from "axios";

const instance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setPlayCard = playCard => ({
    type: types.SET_PLAY_CARD,
    playCard
});

export const fetchCardsSuccess = cards => ({
    type: types.FETCH_CARDS_SUCCESS,
    cards
});

export const fetchCardsFailure = error => ({
    type: types.FETCH_CARDS_FAILURE,
    error
});

export const selectCardSuccess = cardId => ({
    type: types.SELECT_CARD_SUCCESS,
    cardId
});

export const removeCard = cardId => ({
    type: types.REMOVE_CARD,
    cardId
});

export const selectCard = cardId => (dispatch, getState) => {
    const status = getState().dashboardReducer.status;
    if (status === "WAITING_FOR_CURRENT_PLAYER") {
        dispatch(selectCardSuccess(cardId));
    } else if (status === "WAITING_FOR_OTHER_PLAYERS") {
        instance.post('/api/playCard', { cardId })
        .then(res => {
            if (res.status === 200) {
                console.log("success");
                dispatch(selectCardSuccess(cardId));
                dispatch(removeCard(cardId));
            } else {
                console.log("fail");
            }
        });
    }
};

export const fetchCards = () => dispatch => {
    instance.get('/api/cards')
    .then(res => {
        res.status === 200 ?
        dispatch(fetchCardsSuccess(res.data)) :
        dispatch(fetchCardsFailure(res.data.message));
    })
    .catch(err => dispatch(fetchCardsFailure(err.message)));
};
