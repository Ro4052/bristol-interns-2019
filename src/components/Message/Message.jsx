import React from 'react';
import socket from '../../socket';
import axios from 'axios';

class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            currentValue: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        socket.on("messages", msg => {
            console.log(msg);
            // Update the state with the messages
            this.setState({
                message: msg
            });
            console.log(this.state.message);
        })
        
    }

    handleChange(event) {
        this.setState({ currentValue: event.target.value });
        // console.log(this.state.currentValue);
    }

    sendMessage() {
        // Get value of input
        console.log(this.state.currentValue);

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
                    <h1>{this.state.message}</h1>
                </div>
            </div>
        )
    }
}

export default Message;
