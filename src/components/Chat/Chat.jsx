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
        window.addEventListener('resize', this.updateWindowDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    updateWindowDimensions() {
        this.setState({
            showChat: window.innerWidth > 950
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
        const messageList = this.props.messages.map(message => (
            <h2 data-cy='messages' className={styles.chat}>{message.username} : {message.text}</h2>
        ));
        return (
            <div className={styles.chatArea}>
                <div className={cx({ showChatArrow: !this.state.showChat, hideChatArrow: this.state.showChat })} data-cy='chat-arrow' onClick={this.showChat}/>
                <div className={cx(styles.chatRoom, { shown: this.state.showChat, hidden: !this.state.showChat })} data-cy='chat-room'>
                    <h1 className={styles.chatHeader}>Chat</h1>
                    <div className={styles.chatBox}>
                        {messageList}
                    </div>
                    <form data-cy="message-form" onSubmit={this.sendMessage} className={styles.chatBottom}>
                        <input className={styles.chatInput} data-cy='type-message' onChange={this.handleChange} value={this.state.currentValue} placeholder="Type a message" autoFocus />
                        <button data-cy="send-message" type='submit'>Send</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    messages: state.chatReducer.messages
});

const mapDispatchToProps = dispatch => ({
    sendChat: message => dispatch(sendChat(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
