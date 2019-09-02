import React from 'react';
import { connect } from 'react-redux';
import styles from './Chat.module.css';
import classNames from 'classnames/bind';
import ChatInput from './ChatInput/ChatInput';
import Message from './Message/Message';

const cx = classNames.bind(styles);

export class Chat extends React.Component {
    messagesEndRef = React.createRef();

    constructor() {
        super();
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' });
    }

    render() {
        return (
            <div className={cx(styles.chat)} data-cy='chat-room'>
                <h1>Chat</h1>
                <div className={styles.messagesContainer}>
                    <div className={styles.scrollContainer}>
                        <div className={cx(styles.messages, 'arrowScrollbar')}>
                            {this.props.messages.map((message, key) => <Message message={message} key={key} />)}
                            <div ref={this.messagesEndRef} />
                        </div>
                    </div>
                </div>
                <ChatInput />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    messages: state.chatReducer.messages
});

export default connect(mapStateToProps)(Chat);
