import { types } from './ChatActionTypes';

export const initialState = {
    messages: [],
    newMessages: [],
    error: null,
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RESET_CHAT:
            return { ...state, messages: [], newMessages: [], error: null };
        case types.VIEW_MESSAGES:
            return { ...state, newMessages: [] };
        case types.ADD_MESSAGE:
            return { ...state, messages: [...state.messages, action.message], newMessages: [...state.newMessages, action.message], error: null };
        case types.SEND_CHAT_SUCCESS:
            return { ...state, error: null};
        case types.SEND_CHAT_FAILURE:
            return { ...state, messages: [], newMessages: [], error: action.error };
        default:
            return state;
    }
}

export default chatReducer;
