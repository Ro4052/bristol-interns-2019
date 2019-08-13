import { types } from './ChatActionTypes';

export const initialState = {
    messages: [],
    error: null,
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RESET_CHAT:
            return { ...state, messages: [], error: null };
        case types.ADD_MESSAGE:
            return { ...state, messages: [...state.messages, action.message], error: null };
        case types.SEND_CHAT_SUCCESS:
            return { ...state, error: null};
        case types.SEND_CHAT_FAILURE:
            return { ...state, messages: [], error: action.error };
        default:
            return state;
    }
}

export default chatReducer;
