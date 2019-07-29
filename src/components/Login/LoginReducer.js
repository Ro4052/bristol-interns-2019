import { types } from './LoginActionTypes';

export const initialState = {
    username: null,
    error: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.AUTH_RESET:
            return initialState;
        case types.AUTH_SUCCESS:
            return {...state, username: action.username, error: null };
        case types.AUTH_FAILURE:
            return {...state, username: null, error: action.error }; 
        case types.LOG_OUT_FAILURE:
            return {...state, error: action.error };
        default:
            return state;
    }
}

export default authReducer;
