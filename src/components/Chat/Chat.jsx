import React from 'react';
import { connect } from 'react-redux';
import { viewMessages } from './ChatActions';
import styles from './Chat.module.css';
import classNames from 'classnames/bind';
import ChatInput from './ChatInput/ChatInput';
import Message from './Message';

const cx = classNames.bind(styles);

export class Chat extends React.Component {
    messagesEndRef = React.createRef();

    constructor() {
        super();
        this.state = { showChat: true };
        this.toggleChat = this.toggleChat.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.scrollToBottom();
        this.setState({ showChat: window.innerWidth > 1500 });
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' });
    }

    toggleChat() {
        this.setState({ showChat: !this.state.showChat });
        this.props.viewMessages();
    }

    render() {
        return (
            <>
                <div className={styles.chatArrowArea} onClick={this.toggleChat}>
                    <div className={cx({ showChatArrow: !this.state.showChat, hideChatArrow: this.state.showChat })} data-cy='chat-arrow'/>
                    <span onClick={this.showChat} data-cy='show-chat'>{this.state.showChat ? "Hide chat" : "Show Chat"}</span>
                    {this.props.newMessages.length !== 0 && !this.state.showChat && <div className={styles.newMessage} data-cy='new-message'>+{this.props.newMessages.length}</div>}
                </div>
                <div className={cx(styles.chat, { gameChat: !this.props.showOnDefault, lobbyChat: this.props.showOnDefault, shown: this.state.showChat, hidden: !this.state.showChat })} data-cy='chat-room'>
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
    messages: state.chatReducer.messages,
    newMessages: state.chatReducer.newMessages
});

const mapDispatchToProps = dispatch => ({
    viewMessages: () => dispatch(viewMessages())
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
