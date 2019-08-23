import axios from "axios";
import { connectSocket } from '../../services/socket';
import { types } from './LoginActionTypes';
import history from '../../services/history';

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

export const getURISuccess = uri => ({
    type: types.GET_URI_SUCCESS,
    uri
});

export const getURIFailure = error => ({
    type: types.GET_URI_FAILURE,
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
            });
        } else {
            dispatch(getURI());
            throw Error(res.data.message);
        }
    })
    .catch(() => {
        dispatch(resetStore());
        history.push('/');
    });
}

export const getURI = () => dispatch => {
    axiosInstance.get('/api/oauth/uri')
    .then(res => {
        if (res.status === 200) {
            dispatch(getURISuccess(res.data.uri));
        } else {
            dispatch(getURIFailure(res.data.message));
        }
    })
    .catch(err => {
        dispatch(getURIFailure(err.message));
    })
}

export const logIn = (username, password) => dispatch => {
    try {
        if (username.length < 3) throw Error("Username must be at least 3 characters");
        if (username.length > 15) throw Error("Username must be no longer than 15 characters");
        if (password.length < 8) throw Error("Password must be at least 8 characters");
        // eslint-disable-next-line
        const allowed = /\w*/;
        if (!allowed.test(username)) throw Error("Username can be comprised of numbers and latin letters only");
        axiosInstance.post('/auth/login', { username, password })
        .then(res => {
            if (res.status === 200) {
                connectSocket()
                .then(() => dispatch(authSuccess(username)));
            } else {
                dispatch(authFailure(res.data.message));
            }
        })
        .catch(err => dispatch(authFailure(err.message)));
    } catch (err) {
        dispatch(authFailure(err.message));
    }
};

export const signUp = (username, password) => dispatch => {
    try {
        if (username.length < 3) throw Error("Username must be at least 3 characters");
        if (username.length > 15) throw Error("Username must be no longer than 15 characters");
        if (password.length < 8) throw Error("Password must be at least 8 characters");
        // eslint-disable-next-line
        const allowed = /\w*/;
        if (!allowed.test(username)) throw Error("Username can be comprised of numbers and latin letters only");
        axiosInstance.post('/auth/signup', { username, password })
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
