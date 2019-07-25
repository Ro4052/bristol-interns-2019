import axios from "axios";
import connectSocket from '../../../services/socket';
import { types } from './AuthActionTypes';
import { setRooms } from '../../Lobby/LobbyActions';

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
            .then(() => dispatch(authSuccess(res.data.cookie)));
        } else throw Error(res.data.message);
    })
    .catch(err => {
        dispatch(resetStore());
        dispatch(authFailure(err.message));
    });
}

export const logIn = username => dispatch => {
    axiosInstance.post('/auth/login', { username })
    .then(res => {
        if (res.status === 200) {
            connectSocket()
            .then(() => {
                dispatch(setRooms(res.data.rooms));
                dispatch(authSuccess(username))
            });
        } else throw Error(res.data.message);
    })
    .catch(err => dispatch(authFailure(err.message)));
};

export const logOutUser = () => dispatch => {
    axiosInstance.get('/auth/logout')
    .then(res => {
        res.status === 200 ?
        dispatch(resetStore()) :
        dispatch(logOutFailure(res.data.message));
    })
    .catch((err) => dispatch(logOutFailure(err.message)));
}

export const resetCookie = () => (dispatch) => {
    axiosInstance.get('/api/reset-cookie')
    .then((res) => {
        res.status === 200 ?
        dispatch(authReset()) :
        dispatch(authFailure(res.data.message));
    })
    .catch((err) => dispatch(authFailure(err.message)));
};