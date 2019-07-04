import React from 'react';
import { sendWord } from '../../services/socket';
import { connect } from 'react-redux';

export class Message extends React.Component {

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
        sendWord(this.props.socket, this.state.currentValue);
    }

    render() {
        const box = (
            <div>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" />
                <button id="send-message" className="chat-button" onClick={this.sendMessage}>Send a message</button>
            </div>
        );
        return (
            <div>
                {this.props.myTurn && box}
                <div>
                    <h1 id="message">{this.props.message}</h1>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return ({
        myTurn: state.reducer.gameState.myTurn,
        message: state.reducer.message,
        socket: state.reducer.socket
    });
}

export default connect(mapStateToProps)(Message);
