import React from 'react';
import { sendChat } from '../ChatActions';
import { connect } from 'react-redux';

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
            <form data-cy="message-form" onSubmit={this.sendMessage}>
                <input data-cy='type-message' onChange={this.handleChange} value={this.state.currentValue} placeholder="Type a message" autoFocus />
                <button data-cy="send-message" type='submit'>Send</button>
            </form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    sendChat: message => dispatch(sendChat(message))
});

export default connect(null, mapDispatchToProps)(ChatInput);
