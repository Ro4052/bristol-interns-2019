import { types } from './PlayedCardsActionTypes';
import axios from "axios";

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const setPlayedCards = allCards => (dispatch, getState) => {
    const state = getState();
    const playedCardId = state.myCardsReducer.playedCardId;
    console.log("allCards", allCards);
    const cards = allCards.filter(card => card.cardId !== playedCardId);
    console.log("cards", cards);
    const myCard = allCards.find(card => card.cardId === playedCardId);
    console.log("myCard", myCard);
    dispatch(setFilteredCards(cards));
    dispatch(setMyCard(myCard));
};

export const setFilteredCards = cards => ({
    type: types.SET_PLAYED_CARDS,
    cards
});

export const setMyCard = myCard => ({
    type: types.SET_MY_CARD,
    myCard
});

export const voteForCard = cardId => dispatch => {
    dispatch(voteForCardBegin());
    axiosInstance.post('/api/vote-card', { cardId })
    .then(res => {
        if (res.status === 200) {
            dispatch(voteForCardSuccess(cardId));
        } else {
            dispatch(voteForCardFailure(res.data.message));
        }
    })
    .catch(err => dispatch(voteForCardFailure(err.message)));
}

export const voteForCardBegin = () => ({
    type: types.VOTE_FOR_CARD_BEGIN
});

export const voteForCardSuccess = cardId => ({
    type: types.VOTE_FOR_CARD_SUCCESS,
    cardId
});

export const voteForCardFailure = error => ({
    type: types.VOTE_FOR_CARD_FAILURE,
    error
});

export const setVoteCard = voteCard => ({
    type: types.SET_VOTE_CARD,
    voteCard
});

export const setVotedCard = cardId => ({
    type: types.SET_VOTED_CARD,
    cardId
});

export const setAllVotes = votes => ({
    type: types.SET_ALL_VOTES,
    votes
});
