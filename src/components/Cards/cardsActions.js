import axios from "axios";

export const FETCH_CARDS_BEGIN   = 'FETCH_CARDS_BEGIN';
export const FETCH_CARDS_SUCCESS = 'FETCH_CARDS_SUCCESS';
export const FETCH_CARDS_FAILURE = 'FETCH_CARDS_FAILURE';
export const PLAY_CARD  = 'PLAY_CARD';


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
            return res.data;
        })
        .catch(error => dispatch(fetchCardsFailure(error)));
    }
}

export const playCard = (id) => {
    return {
        type: PLAY_CARD,
        id
    }
}