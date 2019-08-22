import React from 'react';
import { sendChat } from '../ChatActions';
import { connect } from 'react-redux';
import styles from '../Chat.module.css';

export class ChatInput extends React.Component {
    constructor() {
        super();
        this.state = { currentValue: '' };
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    handleChange(e) {
        this.setState({ currentValue: e.target.value });
    }

    sendMessage(e) {
        e.preventDefault();
        this.props.sendChat(this.state.currentValue);
        this.setState({ currentValue: '' });
    }

    render() {
        return (
            <form className={styles.chatMessageForm} data-cy="message-form" onSubmit={this.sendMessage}>
                <input className={styles.chatInput} data-cy='type-message' onChange={this.handleChange} value={this.state.currentValue} placeholder="Type a message" autoFocus />
                <button className={styles.chatButton} data-cy="send-message" type='submit'>Send</button>
            </form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    sendChat: message => dispatch(sendChat(message))
});

export default connect(null, mapDispatchToProps)(ChatInput);
