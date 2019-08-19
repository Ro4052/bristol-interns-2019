import React from 'react';
import styles from './Chat.module.css';

export class Message extends React.Component {
    render() {
        return (
            <div className={styles.message}>
                <div data-cy='message-text' className={styles.messageText}>{this.props.message.text}</div>
                <div data-cy='message-username' className={styles.messageUsername}>{this.props.message.username}</div>
            </div>  
        );
    }
}

export default Message;
