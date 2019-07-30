import axios from "axios";
import connectSocket from '../../services/socket';
import { types } from './LoginActionTypes';
import history from '../../services/history';
import { setPlayCard } from "../MyCards/MyCardsActions";
import { setPlayWord } from "../PlayWord/PlayWordActions";
import { setVoteCard } from "../PlayedCards/PlayedCardsActions";

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const resetStore = () => ({
    type: types.RESET_STORE
});

export const authReset = () => ({
    type: types.AUTH_RESET
});

export const authSuccess = username => ({
    type: types.AUTH_SUCCESS,
    username
});

export const authFailure = error => ({
    type: types.AUTH_FAILURE,
    error
});

export const logOutFailure = error => ({
    type: types.LOG_OUT_FAILURE,
    error
});

export const authenticateUser = () => dispatch => {
    axiosInstance.get('/auth')
    .then(res => {
        if (res.status === 200) {
            connectSocket()
            .then(() => {
                dispatch(authSuccess(res.data.cookie));
                dispatch(retrieveGameState());
            });
        } else {
            throw Error(res.data.message);
        }
    })
    .catch(() => {
        dispatch(resetStore());
        history.push('/');
    });
}

export const logIn = username => dispatch => {
    try {
        if (username.length < 3) throw Error("Username must be at least 3 characters");
        if (username.length > 15) throw Error("Username must be no longer than 15 characters");
        // eslint-disable-next-line
        const allowed = /^[A-Za-z0-9]*$/;
        if (!allowed.test(username)) throw Error("Username can be comprised of numbers and latin letters only");
        axiosInstance.post('/auth/login', { username })
        .then(res => {
            if (res.status === 200) {
                connectSocket()
                .then(() => dispatch(authSuccess(username)));
            } else {
                throw Error(res.data.message);
            }
        })
        .catch(err => dispatch(authFailure(err.message)));
    } catch (err) {
        dispatch(authFailure(err.message));
    }
};

export const logOut = () => dispatch => {
    axiosInstance.post('/auth/logout')
    .then(res => {
        if (res.status === 200) {
            dispatch(resetStore());
            history.push('/');
        } else {
            throw Error(res.data.message);
        }
    })
    .catch((err) => dispatch(logOutFailure(err.message)));
}

export const retrieveGameState = () => dispatch => {
    axiosInstance.get('/api/gameState')
    .then(res => {
        dispatch(setPlayCard(res.data.currentGameState.playCard));
        dispatch(setPlayWord(res.data.currentGameState.playWord));
        dispatch(setVoteCard(res.data.currentGameState.voteCard));
    })
    .catch(err => console.error(err.message));
}
