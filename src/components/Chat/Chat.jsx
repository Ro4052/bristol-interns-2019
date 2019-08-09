import React from 'react';
import { sendChat } from './ChatActions';
import { connect } from 'react-redux';
import styles from './Chat.module.css';
import Button from '../shared/Button/Button';

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

    sendMessage() {
        this.props.sendChat(this.props.username, this.state.currentValue);
    }

    render() {
        const messageList = this.props.messages.map(message => (
            <h2 data-cy='messages' className={styles.chat}>{message.username} : {message.text}</h2>
        ));
        return (
            <div className={styles.chatRoom}>  
                <h1 className={styles.header} >Chat</h1>
                <div className={styles.chatBox}>
                    {messageList}
                </div>
                <div className={styles.chatBottom}>
                    <input className={styles.input} data-cy='type-message' onChange={this.handleChange} value={this.state.currentValue} placeholder="Type a message">
                    </input>
                    <Button cy="send-message" text="Send" handleClick={this.sendMessage} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    messages: state.chatReducer.messages,
    username: state.authReducer.username
});

const mapDispatchToProps = dispatch => ({
    sendChat: (username, message) => dispatch(sendChat(username, message))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
