import React from 'react';
import socket from '../../socket';
import axios from 'axios';
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
        // console.log(this.state.currentValue);
    }

    sendMessage() {
        // Get value of input
        socket.emit("private message", this.state.currentValue);
    }

    render() {
        const box = (
            <div>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" />
                <button className="chat-button" onClick={this.sendMessage}>Send a message</button>
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
        message: state.reducer.message
    });
}

export default connect(mapStateToProps)(Message);
