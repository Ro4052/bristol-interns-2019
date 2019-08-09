import { types } from './ChatActionTypes';

export const initialState = {
    messages: [],
    error: null,
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RESET_CHAT:
            return { ...state, messages: [], error: null };
        case types.SET_CHAT:
            const newMessage = { username: action.username, text: action.message };
            return { ...state, messages: [...state.messages, newMessage], error: null };
        case types.SEND_CHAT_SUCCESS:
            return { ...state, error: null};
        case types.SEND_CHAT_FAILURE:
            return { ...state, messages: [], error: action.error };
        default:
            return state;
    }
}

export default chatReducer;
