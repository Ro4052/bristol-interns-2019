import React from 'react';
import { sendChat } from './ChatActions';
import { connect } from 'react-redux';
import styles from './Chat.module.css';

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    handleChange(event) {
        this.setState({ currentValue: event.target.value });
    }

    sendMessage(e) {
        e.preventDefault();
        this.props.sendChat(this.state.currentValue);
        this.setState({ currentValue: '' });
    }

    render() {
        const messageList = this.props.messages.map(message => (
            <h2 data-cy='messages' className={styles.chat}>{message.username} : {message.text}</h2>
        ));
        return (
            <div className={styles.chatRoom}>  
                <h1 className={styles.chatHeader}>Chat</h1>
                <div className={styles.chatBox}>
                    {messageList}
                </div>
                <form data-cy="message-form" onSubmit={this.sendMessage} className={styles.chatBottom}>
                    <input className={styles.chatInput} data-cy='type-message' onChange={this.handleChange} value={this.state.currentValue} placeholder="Type a message" autoFocus />
                    <button data-cy="send-message" type='submit'>Send</button>
                </form>
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
