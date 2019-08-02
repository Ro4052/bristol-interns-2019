import { types } from './PlayerInteractionsActionTypes';
import axios from "axios";
import { removeCard, setPlayCard } from '../MyCards/MyCardsActions';
import { setPlayWord } from '../PlayWord/PlayWordActions';

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const endTurn = () => (dispatch, getState) => {
    const state = getState();
    const cardId = state.myCardsReducer.playedCardId;
    const word = state.playWordReducer.word;
    axiosInstance.post('/api/play-card-word', { cardId, word })
    .then(res => {
        if (res.status === 200) {
            dispatch(finishPlayCard());
            dispatch(setPlayCard(false));
            dispatch(setPlayWord(false));
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
