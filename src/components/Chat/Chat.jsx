import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Chat.module.css';
import classNames from 'classnames/bind';
import ChatInput from './ChatInput/ChatInput';
import Message from './Message/Message';

const cx = classNames.bind(styles);

export function Chat() {
    const { messages } = useSelector(state => state.chatReducer);

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' });
    });

    return (
        <div className={cx(styles.chat)} data-cy='chat-room'>
            <h1>Chat</h1>
            <div className={styles.messagesContainer}>
                <div className={styles.scrollContainer}>
                    <div className={cx(styles.messages, 'arrowScrollbar')}>
                        {messages.map((message, key) => <Message message={message} key={key} />)}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <ChatInput />
        </div>
    );
}

export default Chat;
