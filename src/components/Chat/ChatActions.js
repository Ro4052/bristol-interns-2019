import { types } from './ChatActionTypes';
import { sendMessage } from "../../services/socket";

export const resetChat = () => ({
    type: types.RESET_CHAT
});

export const sendChatFailure = error => ({
    type: types.SEND_CHAT_FAILURE,
    error
});

export const setChat = (username, message) => ({
    type: types.SET_CHAT,
    username,
    message
});

export const sendChat = (username, message) => () => {
    sendMessage(username, message);
}
