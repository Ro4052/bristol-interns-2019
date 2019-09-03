import React from 'react';
import styles from '../Chat.module.css';

export function Message(props) {
    const { message } = props;
    return (
        <div className={styles.message}>
            <div data-cy='message-username' className={styles.messageUsername}>{message.username}:</div>
            <div data-cy='message-text' className={styles.messageText}>{message.text}</div>
        </div>  
    );
}

export default Message;
