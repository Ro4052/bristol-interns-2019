import React from 'react';
import { connect } from 'react-redux';
import styles from './Chat.module.css';
import classNames from 'classnames/bind';
import ChatInput from './ChatInput';
import Message from './Message';

const cx = classNames.bind(styles);

export class Chat extends React.Component {
    messagesEndRef = React.createRef();

    constructor() {
        super();
        this.state = { showChat: true };
        this.showChat = this.showChat.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.scrollToBottom();
        this.updateWindowDimensions();        
        this.setState({
            showChat: this.props.showOnDefault || window.innerWidth > 1500
        });
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    updateWindowDimensions() {
        this.setState({
            showChat: window.innerWidth > 950 && this.state.showChat
        });
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' });
    }

    showChat() {
        this.setState({
            showChat: !this.state.showChat
        });
    }

    render() {
        return (
            <>
                <div className={cx({ showChatArrow: !this.state.showChat, hideChatArrow: this.state.showChat })} data-cy='chat-arrow' onClick={this.showChat}/>
                <div className={cx(styles.chat, { shown: this.state.showChat, hidden: !this.state.showChat })} data-cy='chat-room'>
                    <h1>Chat</h1>
                    <div className={styles.messagesContainer}>
                        <div className={styles.scrollbarPadding}>
                            <div className={cx(styles.messages, 'arrowScrollbar')}>
                                {this.props.messages.map((message, key) => <Message message={message} key={key} />)}
                                <div ref={this.messagesEndRef} />
                            </div>
                        </div>
                    </div>
                    <ChatInput />
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    messages: state.chatReducer.messages
});

export default connect(mapStateToProps)(Chat);
