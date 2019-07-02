import React from 'react';
import socket from '../socket';


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
        
        return (
            <div>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" />
                <button className="chat-button" onClick={this.sendMessage}>Send a message</button>
                <div>
                    <h1>{this.state.message}</h1>
                    {/* <ul>
                        {/* {this.state.messages.map((message, key) => {
                            return <li key={key}>{message}</li> */}
                        {/* })} */}
                        {/* {return <li>{this.state.currentValue}</li>}
                    </ul> */}
                </div>
            </div>
        )
    }
}

export default Message;
