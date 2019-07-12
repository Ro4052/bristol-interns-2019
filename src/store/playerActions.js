import axios from "axios";

export const types = {
    FETCH_CARDS_BEGIN: 'FETCH_CARDS_BEGIN',
    FETCH_CARDS_SUCCESS: 'FETCH_CARDS_SUCCESS',
    FETCH_CARDS_FAILURE: 'FETCH_CARDS_FAILURE',
    REQUEST_PLAY_CARD: 'REQUEST_PLAY_CARD',
    FINISH_PLAY_CARD: 'FINISH_PLAY_CARD',
    PLAY_WORD: 'PLAY_WORD',
    VOTE_FOR_CARD_BEGIN: 'VOTE_FOR_CARD_BEGIN',
    VOTE_FOR_CARD_SUCCESS: 'VOTE_FOR_CARD_SUCCESS',
    VOTE_FOR_CARD_FAILURE: 'VOTE_FOR_CARD_FAILURE',
    MY_TURN: 'MY_TURN',
    OTHERS_TURN: 'OTHERS_TURN',
    SET_PLAY_WORD_AND_CARD: 'SET_PLAY_WORD_AND_CARD',
    SET_PLAY_CARD: 'SET_PLAY_CARD',
    SET_VOTE_CARD: 'SET_VOTE_CARD',
    SET_VOTED_CARD: 'SET_VOTED_CARD',
    SET_PLAYED_CARD: "SET_PLAYED_CARD",
    RESET_PLAYER_STATE: "RESET_PLAYER_STATE",
    RESET_FINISH_ROUND: 'RESET_FINISH_ROUND'
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
    .then(res => {
        dispatch(voteForCardSuccess(id));
    })
    .catch(error => dispatch(voteForCardFailure(error)));
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
})

export const resetFinishRound = bool => ({
    type: types.RESET_FINISH_ROUND,
    bool
})
