import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Chat.module.css';
import classNames from 'classnames/bind';
import ChatForm from './ChatForm/ChatForm';

const cx = classNames.bind(styles);

function Chat() {
    const { messages } = useSelector(state => state.chatReducer);

    const messagesEndRef = useRef();
    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' });
    });

    return (
        <div className={cx(styles.chat)} data-cy='chat-room'>
            <h1>Chat</h1>
            <div className={styles.messagesContainer}>
                <div className={styles.scrollContainer}>
                    <div className={cx(styles.messages, 'arrowScrollbar')}>
                        {messages.map((message, index) => 
                            <div key={index} className={styles.message}>
                                <div data-cy='message-username' className={styles.messageUsername}>{message.username}:</div>
                                <div data-cy='message-text' className={styles.messageText}>{message.text}</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <ChatForm />
        </div>
    );
}

export default Chat;
