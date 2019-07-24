import { types } from './PlayerInteractionsActionTypes';
import axios from "axios";
import { removeCard } from '../MyCards/MyCardsActions';

let instance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const endTurn = () => (dispatch, getState) => {
    const cardId = getState().myCardsReducer.playedCardId;
    const word = getState().playWordReducer.word;
    instance.post('/api/playCardWord', { cardId, word })
    .then(res => {
        if (res.status === 200) {
            dispatch(finishPlayCard());
            dispatch(removeCard(cardId));
        } else {
            throw Error(res.data.message);
        }
    })
    .catch(err => dispatch(finishPlayCardFailure(err.message)));
};

export const finishPlayCard = () => ({
    type: types.FINISH_PLAY_CARD
});

export const resetFinishRound = () => ({
    type: types.RESET_FINISH_ROUND,
});

export const finishPlayCardFailure = error => ({
    type: types.FINISH_PLAY_CARD_FAILURE,
    error
});
