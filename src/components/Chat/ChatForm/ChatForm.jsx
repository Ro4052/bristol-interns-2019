import React from 'react';
import { sendChat } from '../ChatActions';
import { useDispatch } from 'react-redux';
import styles from '../Chat.module.css';

export function ChatInput() {
    const [currentValue, setCurrentValue] = React.useState('');
    const dispatch = useDispatch();

    const sendMessage = e => {
        e.preventDefault();
        dispatch(sendChat(currentValue));
        setCurrentValue('');
    }

    return (
        <form className={styles.chatMessageForm} data-cy="message-form" onSubmit={sendMessage}>
            <input className={styles.chatInput} data-cy='type-message' onChange={e => setCurrentValue(e.target.value)} value={currentValue} placeholder="Type a message" autoFocus />
            <button data-cy="send-message" type='submit'>Send</button>
        </form>
    );
}

export default ChatInput;
