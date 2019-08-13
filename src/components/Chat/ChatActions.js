import { types } from './ChatActionTypes';
import { sendMessage } from "../../services/socket";

export const resetChat = () => ({
    type: types.RESET_CHAT
});

export const sendChatFailure = error => ({
    type: types.SEND_CHAT_FAILURE,
    error
});

export const addMessage = (username, text) => ({
    type: types.ADD_MESSAGE,
    message: { username, text }
});

export const sendChat = (username, message) => () => {
    if (message.trim().length > 0) {
        sendMessage(username, message);
    }
}
