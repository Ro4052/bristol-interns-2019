import axios from "axios";
import connectSocket from '../services/socket';

export const types = {
    LOG_IN_SUCCESS: 'LOG_IN_SUCCESS',
    LOG_IN_FAILURE: 'LOG_IN_FAILURE',
};

let instance = axios.create({
    validateStatus: function (status) {
        return status >= 200 && status < 500;
    }
});

export const logIn = (username) => {
    return dispatch => {
        return instance.post('/auth/login', {
            username: username
        })
        .then((res) => {
            if (res.status === 200) {
                connectSocket().then(() => {
                    dispatch(logInSuccess(username));
                });
            } else {
                dispatch(logInFailure(res.data.message));
            }
        })
        .catch((err) => dispatch(logInFailure(err.message)));
    }
};

export const logInFailure = (error) => ({
    type: types.LOG_IN_FAILURE,
    payload: { error }
});

export const logInSuccess = (cookie) => ({
    type: types.LOG_IN_SUCCESS,
    payload: { cookie }
});
