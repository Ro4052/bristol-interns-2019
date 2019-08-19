import React from 'react';
import { sendChat } from './ChatActions';
import { connect } from 'react-redux';
import styles from './Chat.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: '',
            showChat: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.showChat = this.showChat.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
      
    componentDidMount() {
        this.updateWindowDimensions();        
        this.setState({
            showChat: this.props.showOnDefault || window.innerWidth > 1500
        });
        window.addEventListener('resize', this.updateWindowDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    updateWindowDimensions() {
        this.setState({
            showChat: window.innerWidth > 950 && this.state.showChat
        });
    }

    handleChange(event) {
        this.setState({ currentValue: event.target.value });
    }

    sendMessage(e) {
        e.preventDefault();
        this.props.sendChat(this.state.currentValue);
        this.setState({ currentValue: '' });
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
                            <div className={cx(styles.messages, 'arrowScroll')}>
                                {this.props.messages.map((message, key) => (
                                    <div key={key} className={styles.message}>
                                        <div className={styles.text}>{message.text}</div>
                                        <div className={styles.sender}>{message.username}</div>
                                    </div>  
                                ))}
                            </div>
                        </div>
                    </div>
                    <form data-cy="message-form" onSubmit={this.sendMessage} className={styles.messageForm}>
                        <input className={styles.chatInput} data-cy='type-message' onChange={this.handleChange} value={this.state.currentValue} placeholder="Type a message" autoFocus />
                        <button data-cy="send-message" type='submit'>Send</button>
                    </form>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    messages: state.chatReducer.messages,
    status: state.dashboardReducer.status
});

const mapDispatchToProps = dispatch => ({
    sendChat: message => dispatch(sendChat(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
